# Uniform Automations starter

Examples of authoring and deploying Uniform [Automations](https://docs.uniform.app/docs/guides/automations)
with `@uniformdev/automations-sdk` and the `uniform automation` CLI. There are two kinds:
[code automations](https://docs.uniform.app/docs/guides/automations/code-automations) (TypeScript
handlers you deploy with the CLI) and [Scout automations](https://docs.uniform.app/docs/guides/automations/scout-automations)
(instructions Uniform's AI agent runs on each trigger).

A Next.js site (Home + About, one page type, one Hero) is included so you have Canvas
content to trigger automations against: edit a page, move it through the AI Workflow,
and so on.

Each `*.automation.ts` file is one automation. The CLI infers the kind from the default export:

- `defineAutomation({ metadata, handler })` — you write the handler.
- `defineScoutAutomation({ metadata }, 'instructions')` — Uniform runs Scout against the
  instructions. No handler; the agent's tool calls are the actions, performed as the automation's
  machine identity (a role grant is required).

The deployed `publicId` is the filename without `.automation.ts`. Renaming a file orphans the old
automation and creates a new one. Handlers and helpers it imports are just modules.

## Layout

```
automations/                 one *.automation.ts per automation
  lib/                       shared helpers (notifications, Slack, workflow IDs, …)
uniform-data/                Canvas site, locales, and the AI Workflow definition
```

## Getting started

1. Create an empty Uniform project. The API key needs **Developer** (to push Canvas data)
   and **Manage Automations** (to deploy automations). At deploy time you can only grant
   roles you hold yourself.
1. `npm install`
1. `cp .env.example .env` and set `UNIFORM_API_KEY` + `UNIFORM_PROJECT_ID`
1. `npm run uniform:push` to push components, compositions, locales, and the AI Workflow
1. `npm run dev` and open http://localhost:3000

The CLI auto-loads `.env`.

Automations are plain functions: `npm test` imports a default export and calls it
with a payload. No local Uniform, no SDK mocks. The returned `{ outcome, logs }` is
the assertion surface — for an `aiTool`, those logs are also what Scout receives.
See [testing code automations](https://docs.uniform.app/docs/guides/automations/code-automations#testing).

## Deploying automations

Deploy is push-only (you cannot read deployed code back) and enables the automation immediately.
`npm run automation:deploy` / `npm run automation:delete` push or remove every `*.automation.ts`
file in `./automations`. `npm run automation:list` shows what's deployed; runs and logs live
under Settings → Automations. See [deploying](https://docs.uniform.app/docs/guides/automations/code-automations#deploying).

Some examples need extra setup (see below): `UNIFORM_ENV_*` secrets, and `shared-content-sync`
is meant for a **hub** project.
You can still deploy a single file with `uniform automation deploy ./automations/<file>.automation.ts`.

Secrets use `UNIFORM_ENV_*` variables, inlined by the CLI at deploy time from a **literal**
`process.env.UNIFORM_ENV_FOO`. A computed lookup (`process.env[someVar]`) is not inlined and reads
as `undefined` at runtime. `.env.example` lists each variable and which automation needs it.
See [secrets and environment variables](https://docs.uniform.app/docs/guides/automations/code-automations#secrets-and-environment-variables).

## Basics

Trigger types, combining them, and CEL filters are covered in the
[triggers](https://docs.uniform.app/docs/guides/automations/triggers) guide.

`npm run automation:deploy` / `npm run automation:delete`

| File | Trigger | What it shows |
| --- | --- | --- |
| `on-content-changed.automation.ts` | `entry.changed`, `composition.changed` | Typed `input` from the trigger; two triggers with CEL filters, narrowed on `input.eventType`. Edit **Home** or **About** to fire it. The entry filter looks for type `product`. |
| `notifications.automation.ts` | same | Split from the above so notifying can be deployed on its own. In-app Uniform notification plus Slack (`lib/notifications.ts`, `lib/slack.ts`). |
| `on-inbound-hook.automation.ts` | `incomingWebhook` | Deploy prints the webhook URL. Returns `unauthorized` / `rejected` on a bad payload. |
| `daily-cleanup.automation.ts` | `schedule` | RFC 5545 `rrule`. Fails until `UNIFORM_ENV_EXTERNAL_KEY` is set (secret injection). Granularity is ~1 minute. |
| `ai-tool.automation.ts` | `aiTool` | Invoked by Scout, not by an event. Runs do not appear in the runs list; outcome and logs go back to Scout. No role grant — credentials are the identity invoking Scout. |

`npm run automation:deploy` / `npm run automation:delete`

| File | Trigger | What it shows |
| --- | --- | --- |
| `on-publish-or-nightly.automation.ts` | `entry.published`, `composition.published`, `schedule` | One handler across three triggers, narrowed by an exhaustive `switch` (`never` default). `compatibilityDate`, and CEL filters that prevent a run from being created. |

## AI workflow demo

This is the [workflow-stage pattern](https://docs.uniform.app/docs/guides/automations/best-practices#delegate-editing-work-through-workflow-stages)
from the best practices guide, implemented as [Scout automations](https://docs.uniform.app/docs/guides/automations/scout-automations).
Scout reviews content entering the AI Review stage, then translates it and sends
it for human approval. The three automations sit in `automations/` with the rest;
they share IDs from `automations/lib/workflow.ts`. The workflow, locales (`en-US`,
`es-MX`), and sample composition are in `uniform-data/` and are pushed with
`npm run uniform:push`.

| File | Kind | What it does |
| --- | --- | --- |
| `ai-workflow-reviewer.automation.ts` | Scout | On `workflow.transition` into AI Review: approve → Translation, or reject → Editing. |
| `ai-workflow-translator.automation.ts` | Scout | On transition into Translation: translate en-US → es-MX and send for human approval. Split from the reviewer so the approval's transition is not a self-retrigger (cycle protection would abort it). |
| `ai-workflow-notify.automation.ts` | `aiTool` | Uniform and Slack notify, called by the two Scout automations. A Scout automation has no code, so anything that isn't an agent capability is a tool. |

```bash
npm run uniform:push              # includes the AI Workflow, locales, and sample pages
npm run automation:deploy
```

- Push `uniform-data` as-is. The stage automations hardcode those workflow/stage
  UUIDs; recreating the workflow by hand will not match.
- Grants `editor` (a built-in role). You must hold it to deploy. Scout automations always
  need a role — without a machine identity the agent cannot act. The AI Review and Translation
  stages only allow `editor` to write and execute transitions.
- Scout runs consume [AI credits](https://docs.uniform.app/docs/guides/automations/scout-automations#ai-credits).
- `UNIFORM_ENV_SLACK_WEBHOOK_URL` is optional; omit it to skip Slack. In-app Uniform notify
  needs `UNIFORM_ENV_NOTIFY_RECIPIENTS` (the tool run has no person behind it). Notifications
  are best-effort (the agent chooses to call the tool). The run log is the source of truth.

Drive it by moving a composition through the AI Workflow stages (Home and About start on this
workflow). A Scout run log is the agent's transcript: every tool call, then its summary of what
it did.

## Release conflicts and shared content

`npm run automation:deploy` / `npm run automation:delete`

| File | Trigger | What it does |
| --- | --- | --- |
| `release-content-conflicts.automation.ts` | `entry.changed`, `composition.changed` | Warns in-product when the same entity is also changed in a pending release. `EntityReleasesClient` + `ReleaseClient`. |

`shared-content-sync` is meant for a **hub** project, not the site project. Set
`UNIFORM_ENV_SHARED_CONTENT_TARGETS` before deploy; the target list is baked into
`permissions.projects`. Deploy it on its own with
`uniform automation deploy ./automations/shared-content-sync.automation.ts`.

| File | Trigger | What it does |
| --- | --- | --- |
| `shared-content-sync.automation.ts` | `entry.published` | Copies a published entry into each spoke project, writing the content type there so the target can store it (create-or-update). The only example of cross-project permissions. |

`automations/lib/` is shared by the notify examples and the advanced automations: `notifications.ts`
(in-product notifications, recipient from the run initiator), `slack.ts` (Block Kit incoming
webhook), `errors.ts`, `utils.ts`.

## Documentation

- [Automations](https://docs.uniform.app/docs/guides/automations) — overview, dashboard, and execution model
- [Triggers](https://docs.uniform.app/docs/guides/automations/triggers) — content events, schedules, incoming webhooks, AI tools, and filters
- [Code automations](https://docs.uniform.app/docs/guides/automations/code-automations) — SDK, identity, secrets, notify, test, and deploy
- [Scout automations](https://docs.uniform.app/docs/guides/automations/scout-automations) — instruction-based automations and AI credits
- [Best practices](https://docs.uniform.app/docs/guides/automations/best-practices) — workflow stages, filtering, and loop protection
