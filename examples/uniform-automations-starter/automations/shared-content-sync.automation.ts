import {
  defineAutomation,
  type AutomationLogger,
  type UniformConnectionParams,
} from "@uniformdev/automations-sdk";
import {
  CANVAS_PUBLISHED_STATE,
  ContentTypeClient,
  convertEntryToPutEntry,
  EntryManagementClient,
  type Entry,
} from "@uniformdev/canvas";
import { ApiClientError } from "@uniformdev/context/api";
import type { WebhookPayloadFor } from "@uniformdev/webhooks";
import { errorMessage } from "./lib/errors";
import {
  buildNotificationSummary,
  resolveNotificationRecipients,
  sendUniformNotification,
} from "./lib/notifications";

/**
 * Shared content sync.
 *
 * Deployed to the *shared* project, which owns this automation. Publishing an
 * entry here creates or updates that entry in every project listed in
 * `UNIFORM_ENV_SHARED_CONTENT_TARGETS`, under its original id, and publishes it
 * there too. The entry's content type is written to the target first, since a
 * target cannot store an entry whose type it lacks.
 *
 * Credentials: the automation's identity reads on its home (shared) project and
 * is granted the same role on each target project, so all projects must belong
 * to one team.
 *
 * Configure before deploy:
 * - `UNIFORM_ENV_SHARED_CONTENT_TARGETS` — comma-separated ids of the projects
 *   to publish into. This is read at deploy time to build the cross-project
 *   role grants, so adding a target requires a redeploy.
 *
 * The deployed `publicId` is the filename without extension: `shared-content-sync`.
 */

/**
 * Parses the consuming project ids from `UNIFORM_ENV_SHARED_CONTENT_TARGETS`
 * (comma-separated). Whitespace is trimmed and empty entries dropped, so an
 * unset or blank value yields an empty list and the automation no-ops.
 *
 * Note: this reads `process.env.UNIFORM_ENV_SHARED_CONTENT_TARGETS` as a
 * literal so the Uniform CLI can statically inline the value into the deployed
 * bundle. A computed lookup (`process.env[someVar]`) would not be inlined and
 * would always read as undefined at runtime.
 */
export function configuredTargetProjectIds(): string[] {
  return (process.env.UNIFORM_ENV_SHARED_CONTENT_TARGETS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

/**
 * Spreadable `{ editionId }` for events that target a locale edition, or `{}`.
 * Omitting the key entirely keeps it out of request bodies rather than sending
 * `editionId: undefined`.
 */
function edition(event: WebhookPayloadFor<"entry.published">): { editionId?: string } {
  return "editionId" in event && event.editionId
    ? { editionId: event.editionId }
    : {};
}

/**
 * Drops source-project and workflow metadata from an entry PUT body so the
 * target project's client, workflows, and base (not a release) own the write.
 */
export function toTargetEntryPut(source: Entry) {
  const {
    projectId: _projectId,
    releaseId: _releaseId,
    workflowId: _workflowId,
    workflowStageId: _workflowStageId,
    state: _state,
    ...body
  } = convertEntryToPutEntry(source);
  return body;
}

export default defineAutomation({
  metadata: {
    name: "Shared content sync",
    description:
      "When an entry is published in this shared project, create or update the same entry in every consuming project.",
    triggers: [{ type: "entry.published" }],
    permissions: {
      role: "developer",
      // Cross-project grants must be known at deploy time, so the target list
      // is resolved from the environment here rather than in the handler.
      projects: Object.fromEntries(
        configuredTargetProjectIds().map((projectId) => [
          projectId,
          "developer",
        ]),
      ),
    },
  },
  handler: async ({ input, log, uniformCredentials }) => {
    // A target equal to the home project would copy this project onto itself.
    const targetProjectIds = configuredTargetProjectIds().filter(
      (projectId) => projectId !== uniformCredentials.projectId,
    );
    if (targetProjectIds.length === 0) {
      log.warning(
        "No target projects configured; set UNIFORM_ENV_SHARED_CONTENT_TARGETS to a comma-separated list of project ids and redeploy.",
      );
      return { outcome: "rejected" };
    }

    // A release-triggered publish belongs to a release on this project and is
    // not mirrored onto a target's base version.
    if (input.trigger?.type === "release") {
      log.info(
        `Ignoring release-triggered publish of "${input.name}" (${input.id}).`,
      );
      return { outcome: "rejected" };
    }

    log.info(
      `Fanning out entry "${input.name}" (${input.id}) to ${targetProjectIds.length} project(s): ${targetProjectIds.join(", ")}.`,
    );

    // Read the published entity once, then replay that single read into every
    // target so N targets cost one source read rather than N.
    let writeToTarget: TargetWriter;
    try {
      writeToTarget = await readPublishedEntity(input, uniformCredentials);
    } catch (error) {
      // Every Uniform client extends the shared `ApiClient`, so a deleted or
      // otherwise unreadable entity surfaces as a 404 `ApiClientError`. The
      // content model is read here too, hence naming both as the suspect.
      if (error instanceof ApiClientError && error.statusCode === 404) {
        log.warning(
          `Skipping entry "${input.name}" (${input.id}): it or its content model is missing from this project.`,
        );
        return { outcome: "rejected" };
      }
      log.error(
        `Failed to read entry "${input.name}" (${input.id}): ${errorMessage(error)}`,
      );
      return { outcome: "failure" };
    }

    const copied = await fanOut(
      targetProjectIds,
      uniformCredentials,
      writeToTarget,
      log,
    );

    // Notify the person who published, falling back to the configured
    // recipient list only when there is no such person (an API-key publish).
    // The entity reference makes the notification open the entity in-app.
    await sendUniformNotification(
      {
        recipients: resolveNotificationRecipients(input.initiator),
        projectId: uniformCredentials.projectId,
        summary: buildNotificationSummary(
          input.name,
          (name) =>
            `Shared content: **${name}** has been propagated to ${copied.length}/${targetProjectIds.length} project(s).`,
        ),
        entity: {
          entityId: input.id,
          type: "entry",
          ...edition(input),
        },
      },
      uniformCredentials,
      log,
    );

    // A target that failed leaves the projects out of sync, so surface the run
    // as a failure even though the others succeeded.
    return {
      outcome:
        copied.length === targetProjectIds.length ? "success" : "failure",
    };
  },
});

/**
 * Writes the already-read source entity into one target project. The clients'
 * save results are not used, so the resolved value is left unconstrained.
 */
type TargetWriter = (target: UniformConnectionParams) => Promise<unknown>;

/**
 * Reads the published entry and the content type it needs from the shared
 * project, and returns a writer that saves both into a target project. Reading
 * and writing are split so the source reads happen once regardless of how many
 * targets are configured.
 */
async function readPublishedEntity(
  event: WebhookPayloadFor<"entry.published">,
  credentials: UniformConnectionParams,
): Promise<TargetWriter> {
  const entry = await new EntryManagementClient(credentials).get({
    entryId: event.id,
    ...edition(event),
    state: CANVAS_PUBLISHED_STATE,
  });

  const contentType = await new ContentTypeClient(credentials).get({
    contentTypeId: entry.entry.type,
  });

  const body = { ...toTargetEntryPut(entry), ...edition(event) };
  return async (target) => {
    await new ContentTypeClient(target).save({ contentType });
    return new EntryManagementClient(target).saveAndPublish(body);
  };
}

/**
 * Writes to every target concurrently. One target's failure must not stop the
 * others, so failures are collected and logged rather than thrown; the ids of
 * the targets that were written are returned.
 */
async function fanOut(
  targetProjectIds: string[],
  credentials: UniformConnectionParams,
  writeToTarget: TargetWriter,
  log: AutomationLogger,
): Promise<string[]> {
  const results = await Promise.allSettled(
    targetProjectIds.map((projectId) =>
      writeToTarget({ ...credentials, projectId }),
    ),
  );

  return targetProjectIds.filter((projectId, index) => {
    const result = results[index];
    if (result?.status === "rejected") {
      log.error(
        `Failed to write to project ${projectId}: ${errorMessage(result.reason)}`,
      );
      return false;
    }
    log.info(`Wrote to project ${projectId}.`);
    return true;
  });
}
