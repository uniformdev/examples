## Phrase TMS — Workflow mode

This small project will handle cases when a special workflow state will be used to send the composition for translation.

## Phrase TMS - Phrase job Webhook

1. Run `npm i`
1. Run `npm run dev`
2. Run ngrok `ngrok http 3002 -hostname="<NGROK_HOST>"`
2. Configure [Phrase webhook](https://us.cloud.memsource.com/web/webHook/list) with `https://<NGROK_HOST>/api/jobWebhook` url and `Job status changed` event
