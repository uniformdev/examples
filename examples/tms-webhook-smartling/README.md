This is Next.js App with example api handler.

To use it please instal [ngrok](https://ngrok.com/) on your machine
Then start the project with `npm run dev`
Then tunnel it to the internet via `ngrok http http://localhost:3003/`

End URL for Smartling mesh integration settings should look like `https://{ngrok-temp-domain}.ngrok-free.app/api/smartling-job-completed-webhook`

If you backend only flow based on Uniform Workflow stages:

1. Ensure you have `WORKFLOW_ID`, `WORKFLOW_LOCKED_FOR_TRANSLATION_STAGE_ID`, `WORKFLOW_TRANSLATED_STAGE_ID`, `UNIFORM_SOURCE_LOCALE`, `UNIFORM_TO_SMARTLING_LOCALE_MAPPING` env variables
2. Add this URL as Uniform Webhook listener `https://{ngrok-temp-domain}.ngrok-free.app/api/uniform-workflow-transition-webhook`. Uniform event that need subscriber is `workflow.transition`
3. Assign your workflow to entity you want to automatically translate
