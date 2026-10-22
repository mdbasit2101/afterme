# AfterMe

**A trip-ready home, before you leave.** AfterMe is a web-based simulated Alexa+ experience for turning a natural-language request into a coordinated, reviewable plan. It is an interactive prototype for the Alexa+ simulated-experience route in the Build, Ship, Shape: Amazon Developer Hackathon.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the suggested request or type “Actually, my parents are coming too.” Context and completed actions are saved in this browser. Use **Start fresh** to reset the demo.

## What the simulation demonstrates

- A natural-language travel request becomes a structured plan across packing, schedule, transport, weather, and household reminders.
- Reversible, low-impact preparation can run automatically; purchases and changes that affect other people wait for approval.
- A follow-up updates trip context and recalculates the plan for two guests while preserving the conversation.
- Each demo action has a visible outcome. Data is illustrative and changes stay in this browser; no real-world service is contacted.

## Hackathon route

This project uses the hackathon’s explicitly permitted **simulated Alexa+ web experience** route. It does not claim to connect to an Alexa device, use a live Alexa+ integration, or implement MCP. The official rules specify that the simulation route can use any agentic tool, is exempt from the live runtime-technology-hook requirement, and must include source code and be shown working in the demo. See the [official rules](https://amazonappdev2026.devpost.com/rules).

## Submission checklist

- [ ] Publish this repository publicly and confirm the license is visible in the GitHub About section (or share a private repo with the listed reviewers).
- [ ] Record and publish an English demo on YouTube or Vimeo, under 3 minutes, showing the initial request, a visible action, and the parents-coming follow-up updating the plan.
- [ ] Complete product feedback for every tool/API/SDK used. The app currently uses Next.js, React, TypeScript, and Lucide React; no AWS service or third-party runtime API has been integrated.
- [ ] Complete Devpost’s required AI-tools and eligibility questions.
- [ ] Add teammates to the Devpost submission if applicable.
- [ ] Review the repository for secrets before submission.
- [ ] The optional friction log is maintained in `docs/FRICTION_LOG.md`; it records only encountered friction, not hypothetical issues.

## Build decisions

The plan engine lives in `src/lib/plan.ts` behind a small typed interface so it can later call an Amazon Bedrock-backed planner. The current deterministic planner keeps the demo reliable and key-free. No Bedrock SDK, credentials, or fictitious live integrations are included.
