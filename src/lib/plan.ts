export type ActionState = "ready" | "done" | "approval" | "approved";
export type Action = { id: string; title: string; detail: string; time: string; kind: "auto" | "approval"; state: ActionState; icon: string };
export type TripContext = { destination: string; departure: string; guests: number; nights: number };

export function makePlan(guests: number): Action[] {
  const shared = guests > 1;
  return [
    { id: "weather", title: "Check Delhi weather", detail: "Sunny and warm · pack light layers", time: "Just now", kind: "auto", state: "ready", icon: "sun" },
    { id: "packing", title: "Build a packing list", detail: `${shared ? "2 travellers" : "1 traveller"} · essentials, chargers, medication`, time: "Tonight · 8:00 PM", kind: "auto", state: "ready", icon: "bag" },
    { id: "reminder", title: "Set a leave-home reminder", detail: "Leave by 5:00 AM for your 7:00 AM departure", time: "Tomorrow · 4:30 AM", kind: "auto", state: "ready", icon: "bell" },
    { id: "transport", title: "Arrange a ride to the airport", detail: "Estimated pickup 5:00 AM · fare shown before booking", time: "Tomorrow · 5:00 AM", kind: "approval", state: "approval", icon: "car" },
    { id: "home", title: "Adjust the home while you’re away", detail: "Set lights and thermostat to your away routine", time: "Tomorrow · when you leave", kind: "approval", state: "approval", icon: "house" },
  ];
}

export function respondTo(text: string, context: TripContext) {
  const parents = /parents|mother|father|mom|dad|mum/i.test(text);
  if (parents && context.guests === 1) {
    return { context: { ...context, guests: 3 }, reply: "Got it — your parents are coming too. I’ve updated the trip for three travellers, added their essentials to the packing list, and kept the same departure plan. The ride and home settings still need your approval." };
  }
  if (/actually|change|instead|also/i.test(text)) {
    return { context, reply: "I’ve noted that. Your trip plan is still here, and the actions that affect other people or spend money will wait for your approval." };
  }
  return { context, reply: "I’ve got your trip in mind. You can tell me who’s coming, ask me to adjust the plan, or approve a ride or home routine below." };
}
