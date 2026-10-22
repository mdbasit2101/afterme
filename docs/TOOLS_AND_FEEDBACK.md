# Tools, APIs, and product feedback notes

Maintain this list as the project changes. The hackathon requires product feedback for every tool, API, or SDK used; describe actual experience rather than assumptions.

| Tool / API / SDK | Use | Feedback status |
| --- | --- | --- |
| Next.js | App Router, local development server, production build | To complete from actual use before submission |
| React | Interactive trip planner and conversation UI | To complete from actual use before submission |
| TypeScript | Typed plan and action state | To complete from actual use before submission |
| Lucide React | Interface icons | To complete from actual use before submission |
| Node.js 24 / npm 11 | Install dependencies, run dev server, audit dependencies, build app | To complete from actual use before submission |
| ChatGPT / Codex | AI assistance for research and project implementation | Record separately in the Devpost AI-tools field; no app runtime dependency |
| Alexa+ | Hackathon track; simulated experience route only | Clearly disclose that no live Alexa+ integration was used |

## Experience notes for Devpost product feedback

- **Next.js:** The App Router and optimized production build supported a compact, deployable demo. The first build exposed a missing TypeScript path alias early; after correcting it, the production build passed.
- **React:** Client-side state made the conversational follow-up and action approvals straightforward to demonstrate. Browser storage kept trip context and action state through a reload.
- **TypeScript:** The production build checked the action and trip-context types as part of the app build.
- **Lucide React:** A broad set of consistent interface icons was available without adding an icon-image pipeline.
- **Node.js / npm:** Dependency installation, security auditing, and the production build worked. Package fetches were slower than expected in this environment; the audit surfaced advisories that were cleared with patched dependencies.
- **Alexa+:** The simulation route avoided partner-only tooling and gave a practical way to demonstrate an Alexa+-style planning flow. This is not a live Alexa+ integration.

No AWS service, Amazon Bedrock API, or other live third-party API is currently integrated. Do not claim AWS Builder mini-challenge eligibility without an actual AWS integration.
