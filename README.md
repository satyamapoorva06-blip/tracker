# Threadline

A demo email-management workspace for assistants and clients. React/Vite powers the interface; an Express API stores the shared workspace in `data/store.json` (created on first run). Changes survive server restarts. Run `npm install`, then `npm run dev` and open the Vite URL. For a production-style local run, use `npm run build && npm start`. Run `npm test` for classification tests.

## Demo limitations

This is not a production email service. Connections, outgoing replies and the account/onboarding flow are simulated. There is no real authentication, access control, OAuth, mailbox synchronization, attachment download, or multi-user isolation; do not deploy with sensitive data. Both roles share the same local demo workspace. Client actions are reflected immediately when switching views. The assistant panel and reply draft use local data/templates, not an LLM.

Classification uses an explicitly labeled sample rules engine unless `OPENAI_API_KEY` is set on the server. Optionally set `OPENAI_MODEL` (default `gpt-4o-mini`) and `OPENAI_BASE_URL` (full chat-completions endpoint). Provider errors or invalid output fall back to rules. Never put API keys in frontend code. Reclassify from a conversation to request a fresh analysis. Replies always require review and confirmation and are only simulated.
