## Rewards Helper — Copilot instructions

This file gives concise, actionable guidance for AI coding agents working on the Rewards Helper Chrome extension (Manifest V3).

Keep edits minimal and focused: the extension is small and centralized around a single service-worker background script (`background.js`), a popup (`popup.*`) and an options/settings page (`options.*`). Refer to these files when changing behavior.

- Project shape / important files
  - `manifest.json` — Manifest V3; background runs as a `service_worker: background.js`.
  - `background.js` — Core orchestrator. Handles: loading `topics.json`, selecting topics, building Bing URLs, opening a window and sequentially updating one tab, scheduling via `chrome.alarms`, message handlers and status broadcasts. Primary place for behavioral changes.
  - `topics.json` — Canonical search-topic pool. `background.js` fetches it with `chrome.runtime.getURL('topics.json')`.
  - `popup.html` / `popup.js` — Small UI that polls the background for status (because the service worker may be inactive). Use `chrome.runtime.sendMessage({ action: 'getStatus' })` and listen for `{ type: 'status' }` messages.
  - `options.html` / `options.js` — Settings UI with three logical modules in code: `UI`, `Storage`, `App`. `Storage` wraps `chrome.storage.local` and uses messages to schedule/cancel runs.

- Key runtime patterns (do not change without good reason)
  - Single-tab sequential searches: the extension intentionally navigates one tab/window sequentially for `tabsToOpen` searches (see `runSearchSession`). Avoid reintroducing concurrent tab logic unless you update UI and badge semantics.
  - Settings keys used in `chrome.storage.local`: `customTopics`, `tabsToOpen`, `delayMode`, `fixedDelaySeconds`.
  - Message actions accepted by `background.js`: `startOpeningTabs`, `stopOpeningTabs`, `getStatus`. Keep these names if adding external callers.
  - UI polling: popup polls every second while open to work around MV3 service worker lifecycle. Keep that polling behavior if background push updates are unreliable.

- Development & debugging notes (explicit commands/actions)
  - Install / load locally: open Dev Extensions (Chrome/Edge) and "Load unpacked" the repository root. See `README.md` for step-by-step instructions.
  - Reload after edits: MV3 service worker may be inactive — open `chrome://extensions`, find the extension, click "service worker" (inspect) and click reload/refresh in DevTools to pick up code changes. For quick UI changes, reload the popup/options page or re-open them.
  - Background logs: inspect the background service worker console for logs from `console.log` and `console.error` in `background.js` (use the Extensions page -> Service worker link).
  - Popup/options logs: right-click the popup/options window and choose "Inspect" to open DevTools for those contexts.

- Safety and behavioral expectations
  - The extension emulates user searches on `bing.com` only. Avoid adding network calls to other domains unless necessary and documented.
  - Keep user privacy patterns: the project expects no telemetry; do not introduce analytics or external APIs without explicit consent and README updates.

- Examples & snippets (useful for tests or small changes)
  - Start run (from popup/options or tests):
    - chrome.runtime.sendMessage({ action: 'startOpeningTabs' })
  - Stop run: chrome.runtime.sendMessage({ action: 'stopOpeningTabs' })
  - Request status: chrome.runtime.sendMessage({ action: 'getStatus' }) => { isRunning, openedTabs, totalTabs }
  - (Scheduling removed) The extension no longer supports manual daily scheduling via `scheduleRun`/`cancelSchedule` or a `scheduleTime` key.

- Typical small tasks & where to edit
  - Change search URL generation or query params: edit `buildBingUrl` in `background.js`.
  - Change how topics are selected/shuffled: edit `selectSearchTopics` in `background.js`.
  - Add new settings or UI fields: update `options.html` and `options.js` (update `UI.populateSettings`, `UI.getGeneralSettings`, and `App.handleSaveGeneral`).
  - Modify delays/backoff behavior: adjust `delayMode` handling and `runSearchSession` (respect `fixed` vs `random` vs `immediate`).

- Quality gates & verification (what to run before PR)
  - Manual smoke test: load unpacked extension, set `tabsToOpen=3`, start, and confirm that one tab is opened and navigated sequentially through 3 queries from `topics.json` or your `customTopics` list.
  - Debugging: reproduce and inspect service worker console if `openTabs()` errors or `No topics available` occurs.

If any expected file/behavior is missing from these notes or you want more examples (unit tests, CI rules, or stricter linting), tell me which area to expand and I will iterate.
