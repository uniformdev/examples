import type {
  AutomationLogger,
  UniformConnectionParams,
} from "@uniformdev/automations-sdk";
import { defineAutomation } from "@uniformdev/automations-sdk";
import {
  EntityReleasesClient,
  ReleaseClient,
  type Release,
  type ReleaseState,
} from "@uniformdev/canvas";
import { errorMessage } from "./lib/errors";
import {
  buildNotificationSummary,
  resolveNotificationRecipients,
  sendUniformNotification,
} from "./lib/notifications";
import { truncate } from "./lib/utils";

/**
 * Release conflict warnings.
 *
 * When an entry or composition is changed on the BASE version, this automation
 * checks whether the same entity is also changed inside a release that has not
 * been processed yet. If it is, both versions now hold different content and
 * whichever one lands second silently overwrites the other — so the editor who
 * just saved (or the configured watchers, when a change has no person behind it)
 * gets an in-app Uniform notification pointing at the releases involved.
 *
 * Only PENDING releases count (see `PENDING_RELEASE_STATES`): a launched or
 * deleting release has already been processed and can no longer overwrite base.
 * Base changes that were themselves CAUSED by a release being merged carry
 * `input.trigger.type === "release"` and are skipped, so launching a release
 * never reports a conflict with itself.
 *
 * Only the base side is watched. Editing the same entity inside a release fires
 * `entry.release.changed` / `composition.release.changed` instead, so that
 * direction of the same conflict goes unreported until base is touched again.
 *
 * There is deliberately no CEL trigger filter: whether an event is interesting
 * depends on the release lookup, which CEL cannot do. Every base save of an
 * entry or composition therefore creates a run, and a run without a conflict
 * ends after a single read. Note that repeated saves during an editing session
 * each notify again — runs hold no state, so they cannot tell that the same
 * conflict was already reported.
 *
 * The deployed `publicId` is the filename without extension: `release-content-conflicts`.
 *
 * @see https://docs.uniform.app/docs/guides/automations/best-practices#filter-before-you-run — handler vs filter when the condition needs a lookup
 */

/**
 * Release states whose contents are still pending. A release in any other state
 * (`launched`, `deleting`) has already been processed, so its copy of an entity
 * can no longer conflict with a base change.
 */
export const PENDING_RELEASE_STATES: ReleaseState[] = [
  "open",
  "locked",
  "queued",
  "launching",
];

type ConflictEntityType = "entry" | "composition";

/**
 * Upper bound on how many copies of one entity a run inspects, including the
 * base copy the API always returns — so up to five conflicting releases are
 * reported. One entity sitting in more pending releases than that is unusual,
 * and the warning lands either way.
 */
const MAX_RELEASES = 6;

/**
 * The release fields the notification uses — enough to name a release and link
 * to it. Narrowed from the SDK's `Release` so callers (and tests) do not have
 * to supply the rest of it.
 */
export type ReleaseInfo = Pick<Release, "id" | "name">;

/** Longest release name kept in the summary; longer ones are clipped. */
const MAX_RELEASE_NAME = 40;

/**
 * Markdown link for the notification body: the single conflicting release, or
 * a count linking to the project's release list when there are several.
 */
function getReleaseLinkMarkdown(
  conflictReleases: ReleaseInfo[],
  projectUrl: string
): string {
  const dashboardUrl = projectUrl.replace(/\/+$/, "");
  if (conflictReleases.length === 1) {
    const release = conflictReleases[0];
    return `[${truncate(release.name, MAX_RELEASE_NAME)}](${dashboardUrl}/releases/${release.id})`;
  }
  return `[${conflictReleases.length} pending releases](${dashboardUrl}/releases)`;
}

/**
 * Reads the given releases. Best-effort: a failed lookup is logged and the
 * releases fall back to being named by their id, so the conflict is still
 * reported.
 */
async function loadReleases(
  credentials: UniformConnectionParams,
  releaseIds: string[],
  log: AutomationLogger,
): Promise<ReleaseInfo[]> {
  try {
    const releases = new ReleaseClient(credentials);
    const { results } = await releases.list({
      releaseIDs: releaseIds,
      limit: releaseIds.length,
    });
    if (results.length !== releaseIds.length) {
      log.warning("Could not read all releases; using ids.");
      return releaseIds.map((id) => ({ id, name: id }));
    }
    return results;
  } catch (error) {
    log.warning(`Could not read releases (${errorMessage(error)}); using ids.`);
    return releaseIds.map((id) => ({ id, name: id }));
  }
}

// --------------------------------------------------------------------------
// Handler
// --------------------------------------------------------------------------

export default defineAutomation({
  metadata: {
    name: "Release content conflicts",
    description:
      "When an entry or composition changes on the base version, warns the editor if the same content is also changed in a release that has not launched yet.",
    triggers: [{ type: "entry.changed" }, { type: "composition.changed" }],
    permissions: { role: "developer" },
  },
  handler: async ({ input, log, uniformCredentials }) => {
    // A release being merged into base rewrites base content and emits this same
    // event. Those changes are the release doing its job, not a conflict.
    if (input.trigger?.type === "release") {
      log.info(
        `"${input.name}" changed by release ${input.trigger.id} merging; ignoring.`,
      );
      return { outcome: "rejected" };
    }

    const entityType: ConflictEntityType = input.eventType.startsWith("entry")
      ? "entry"
      : "composition";

    // Every copy of this entity across base and the pending releases.
    const entityReleases = new EntityReleasesClient(uniformCredentials);
    const { results } = await entityReleases.list({
      id: input.id,
      definitionType: entityType,
      releaseStates: PENDING_RELEASE_STATES,
      limit: MAX_RELEASES,
    });

    // The base copy is always in the results, and is the one without a release.
    const releaseIds = results
      .map((result) => result.releaseId)
      .filter((releaseId): releaseId is string => !!releaseId);

    if (releaseIds.length === 0) {
      log.info(
        `No pending release changes ${entityType} "${input.name}" (${input.id}).`,
      );
      return { outcome: "rejected" };
    }

    const conflictReleases = await loadReleases(
      uniformCredentials,
      releaseIds,
      log,
    );

    log.warning(
      `Conflict on ${entityType} "${input.name}" (${input.id}): also changed in ${conflictReleases
        .map((release) => release.name)
        .join(", ")}.`,
    );

    await sendUniformNotification(
      {
        recipients: resolveNotificationRecipients(input.initiator),
        projectId: input.project.id,
        summary: buildNotificationSummary(
          input.name,
          (name) =>
            `**${name}** also changed in ${getReleaseLinkMarkdown(conflictReleases, input.project.url)}.`,
        ),
        entity: {
          entityId: input.id,
          type: entityType,
          ...(input.editionId ? { editionId: input.editionId } : {}),
        },
      },
      uniformCredentials,
      log,
    );

    return { outcome: "success" };
  },
});
