# Hackathon friction log

Record real friction only. Keep each entry specific enough to paste into the Devpost form: task, steps, expected result, actual result, severity, workaround, and actionable suggestion.

## Entries

No product, API, or SDK friction encountered so far.

## Development environment note

- **Task:** Inspect the starter workspace and locate the JavaScript runtime.
- **Steps:** Checked the project workspace and the standard Node/npm command locations; loaded the configured workspace dependency paths.
- **Expected:** A starter repository or directly available development runtime.
- **Actual:** The workspace was empty and the standard Node entry was a desktop shim; the configured bundled Node.js 24 runtime was available and worked.
- **Severity:** Low; no product impact.
- **Workaround:** Used the configured bundled runtime.
- **Suggestion:** Surface the configured runtime path clearly when standard Node commands resolve to desktop shims.

- **Task:** Open the local demo in a browser.
- **Steps:** Started the Next.js development server and opened its localhost URL in the in-app browser.
- **Expected:** The app would bind to localhost and load directly.
- **Actual:** The initial sandboxed server could not bind to the local port; running the same development server with the approved elevated execution allowed the browser preview to load.
- **Severity:** Low; development-only friction, resolved.
- **Workaround:** Started the local development server with the available approved execution path.
- **Suggestion:** Make local development server port access work without requiring a separate approval step.
