"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowRight, AudioLines, BadgeCheck, Bell, BriefcaseBusiness, CalendarDays, Check, CheckCircle2, ChevronDown, CircleHelp, Clock3, CloudSun, House, Luggage, MapPin, MessageCircle, MoreHorizontal, Plane, Plus, RotateCcw, Send, ShieldCheck, Sparkles, Sun, UserRound, Users, CarFront, X } from "lucide-react";
import { Action, makePlan, respondTo, TripContext } from "@/lib/plan";

type Message = { id: number; from: "you" | "afterme"; text: string };
const initialContext: TripContext = { destination: "Delhi", departure: "Tomorrow, 7:00 AM", guests: 1, nights: 3 };
const starterMessage: Message = { id: 1, from: "you", text: "I’m leaving for Delhi tomorrow at 7 AM. Make sure everything is ready." };
const initialAssistant: Message = { id: 2, from: "afterme", text: "On it. I’ve pulled together a plan for your trip and home. I’ll handle the little things; I’ll check with you before I book anything or change your home settings." };

function ActionIcon({ name, size = 18 }: { name: string; size?: number }) {
  const props = { size, strokeWidth: 1.8 };
  switch (name) {
    case "sun": return <Sun {...props} />;
    case "bag": return <Luggage {...props} />;
    case "bell": return <Bell {...props} />;
    case "car": return <CarFront {...props} />;
    default: return <House {...props} />;
  }
}

export default function Home() {
  const [context, setContext] = useState(initialContext);
  const [actions, setActions] = useState<Action[]>(makePlan(1));
  const [messages, setMessages] = useState<Message[]>([starterMessage, initialAssistant]);
  const [input, setInput] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState<"all" | "approval">("all");

  useEffect(() => {
    const saved = window.localStorage.getItem("afterme-demo-v1");
    if (saved) {
      try {
        const value = JSON.parse(saved) as { context?: TripContext; actions?: Action[]; messages?: Message[] };
        if (value.context && value.actions && value.messages) { setContext(value.context); setActions(value.actions); setMessages(value.messages); }
      } catch { window.localStorage.removeItem("afterme-demo-v1"); }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("afterme-demo-v1", JSON.stringify({ context, actions, messages }));
  }, [context, actions, messages, hydrated]);

  const doneCount = actions.filter((action) => action.state === "done" || action.state === "approved").length;
  const visibleActions = useMemo(() => actions.filter((a) => filter === "all" || a.state === "approval"), [actions, filter]);

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(""), 2800); }

  function sendMessage(text = input) {
    const cleaned = text.trim(); if (!cleaned) return;
    const result = respondTo(cleaned, context);
    setMessages((old) => [...old, { id: Date.now(), from: "you", text: cleaned }, { id: Date.now() + 1, from: "afterme", text: result.reply }]);
    setContext(result.context);
    if (result.context.guests !== context.guests) setActions((old) => old.map((a) => a.id === "packing" ? { ...a, detail: "3 travellers · everyone’s essentials, chargers, medication" } : a));
    setInput("");
    if (result.context.guests !== context.guests) notify("Trip updated for 3 travellers");
  }

  function runAction(id: string) {
    const action = actions.find((item) => item.id === id); if (!action) return;
    if (action.state === "done" || action.state === "approved") {
      setActions((old) => old.map((item) => item.id === id ? { ...item, state: item.kind === "approval" ? "approval" : "ready" } : item));
      notify(`${action.title} returned to your plan`);
      return;
    }
    if (action.kind === "approval") {
      setActions((old) => old.map((item) => item.id === id ? { ...item, state: "approved" } : item));
      const label = id === "transport" ? "Airport ride approved · booking confirmed in this demo" : "Away routine approved · scheduled in this demo";
      notify(label);
      setMessages((old) => [...old, { id: Date.now(), from: "afterme", text: id === "transport" ? "Your airport ride is confirmed for 5:00 AM in this demo." : "Your away routine is set for tomorrow when you leave in this demo." }]);
      return;
    }
    setActions((old) => old.map((item) => item.id === id ? { ...item, state: "done" } : item));
    notify(action.id === "packing" ? "Packing list is ready" : action.id === "weather" ? "Delhi forecast is ready" : "Reminder is set");
    const outcomes: Record<string, string> = { weather: "Delhi looks sunny and warm tomorrow. Light layers should be comfortable.", packing: `I’ve prepared a packing list for ${context.guests} ${context.guests === 1 ? "traveller" : "travellers"}, including chargers and medication.`, reminder: "I’ve set your demo reminder for 4:30 AM, before your 5:00 AM ride." };
    if (outcomes[id]) setMessages((old) => [...old, { id: Date.now(), from: "afterme", text: outcomes[id] }]);
  }

  function reset() { setContext(initialContext); setActions(makePlan(1)); setMessages([starterMessage, initialAssistant]); setInput(""); setFilter("all"); window.localStorage.removeItem("afterme-demo-v1"); notify("Your demo is back at the beginning"); }

  return <main className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#home" aria-label="AfterMe home"><span className="brand-mark"><Sparkles size={19} /></span><span>afterme<span className="brand-period">.</span></span></a>
      <div className="side-label">YOUR SPACE</div>
      <nav className="nav-list" aria-label="Main navigation">
        <a className="nav-item active" href="#home"><span className="nav-icon"><MessageCircle size={17} /></span>My assistant<span className="nav-dot" /></a>
        <button className="nav-item" onClick={() => document.getElementById("plan")?.scrollIntoView({ behavior: "smooth" })}><span className="nav-icon"><CalendarDays size={17} /></span>Plans<span className="nav-count">1</span></button>
        <button className="nav-item" onClick={() => notify("Your home profile is ready for this trip.")}><span className="nav-icon"><House size={17} /></span>My home</button>
      </nav>
      <div className="sidebar-spacer" />
      <button className="help-link" onClick={() => notify("This is a simulated Alexa+ experience. No real services are connected.")}><CircleHelp size={17} /> How AfterMe works</button>
      <div className="profile"><div className="avatar"><UserRound size={17} /></div><div className="profile-text"><strong>Alex Morgan</strong><span>Personal space</span></div><MoreHorizontal size={18} className="profile-more" /></div>
    </aside>

    <section id="home" className="workspace">
      <header className="topbar"><div className="crumb">My assistant <span>/</span> <strong>Trip to {context.destination}</strong></div><div className="top-actions"><span className="privacy"><ShieldCheck size={14} /> Your plans stay private</span><button className="icon-button" aria-label="Notifications" onClick={() => notify("You’re all caught up.")}><Bell size={18} /><i /></button><div className="mini-avatar">A</div></div></header>
      <div className="main-content">
        <div className="welcome-row"><div><div className="eyebrow"><span className="status-pip" />YOUR PERSONAL ASSISTANT</div><h1>A little more <span>ready.</span></h1><p className="subheading">The details are handled. The decisions are yours.</p></div><button className="reset-button" onClick={reset}><RotateCcw size={14} /> Start fresh</button></div>

        <section className="trip-card" aria-label="Trip summary"><div className="trip-card-top"><span className="trip-kicker"><Plane size={15} /> UPCOMING TRIP</span><button className="trip-more" aria-label="More trip options" onClick={() => notify("Trip details are up to date.")}><MoreHorizontal size={18} /></button></div><div className="trip-main"><div className="destination"><h2>{context.destination}<span className="trip-pin"><MapPin size={14} fill="currentColor" /></span></h2><p><Clock3 size={14} /> {context.departure}</p></div><div className="trip-separator" /><div className="trip-meta"><div><span className="meta-icon"><Users size={15} /></span><strong>{context.guests} {context.guests === 1 ? "traveller" : "travellers"}</strong><small>going together</small></div><div><span className="meta-icon amber"><BriefcaseBusiness size={15} /></span><strong>{context.nights} nights</strong><small>a little time away</small></div></div></div><div className="trip-bottom"><div className="trip-stamp"><CalendarDays size={14} /><span>DEPARTING IN</span><strong>1 day</strong></div><span className="trip-bottom-note">We’ll make the little things feel easy.</span><div className="sun-sketch"><Sun size={72} strokeWidth={.8} /></div></div></section>

        <div className="content-grid">
          <section id="plan" className="plan-section"><div className="section-head"><div><div className="section-kicker">YOUR GAME PLAN</div><h2>All the little things</h2></div><button className="outline-button" onClick={() => notify("Plan is tailored to your 7:00 AM departure.")}><Sparkles size={15} /> Refine plan</button></div>
            <div className="progress-card"><div className="progress-copy"><div className="progress-title">Getting trip-ready <span>{doneCount}/{actions.length} done</span></div><div className="progress-track"><span style={{ width: `${(doneCount / actions.length) * 100}%` }} /></div><span className="progress-caption">I’ll keep the details in order, as they come together.</span></div><div className="progress-illustration"><div className="progress-circle"><Check size={18} /></div></div></div>
            <div className="actions-heading"><div><h3>The plan</h3><span className="task-count">{actions.length} thoughtful steps</span></div><div className="filter-wrap"><button className={`filter-chip ${filter === "all" ? "selected" : ""}`} onClick={() => setFilter("all")}>All</button><button className={`filter-chip ${filter === "approval" ? "selected" : ""}`} onClick={() => setFilter("approval")}><ShieldCheck size={12} /> Needs you</button></div></div>
            <div className="action-list">{visibleActions.map((action, index) => <article className={`action-card ${action.state === "done" || action.state === "approved" ? "completed" : ""}`} key={action.id}><div className={`action-symbol ${action.kind === "approval" ? "needs-approval" : ""}`}><ActionIcon name={action.icon} /></div><div className="action-body"><div className="action-title-row"><h4>{action.title}</h4>{action.state === "done" || action.state === "approved" ? <span className="done-pill"><CheckCircle2 size={13} /> {action.state === "approved" ? "Approved" : "Ready"}</span> : action.kind === "approval" ? <span className="approval-pill"><ShieldCheck size={12} /> Your OK</span> : <span className="auto-pill"><Sparkles size={12} /> I’ll handle it</span>}</div><p>{action.detail}</p><span className="action-time"><Clock3 size={12} />{action.time}</span></div><button className={`action-cta ${action.kind === "approval" && action.state === "approval" ? "cta-approve" : ""}`} onClick={() => runAction(action.id)} aria-label={`${action.kind === "approval" && action.state === "approval" ? "Approve" : action.state === "done" || action.state === "approved" ? "Undo" : "Run"} ${action.title}`}>{action.state === "approval" ? "Approve" : action.state === "approved" || action.state === "done" ? <Check size={17} /> : <ArrowRight size={17} />}</button><span className="step-number">{String(index + 1).padStart(2, "0")}</span></article>)}{visibleActions.length === 0 && <div className="empty-filter">Nothing needs your approval. I’ll take care of the rest.</div>}</div>
            <button className="add-step" onClick={() => notify("Tell me in the conversation what else you need for the trip.")}><Plus size={15} /> Add something to the plan</button>
            <div className="trust-note"><ShieldCheck size={16} /><span><strong>You’re in control.</strong> I’ll ask before I spend money or change your home.</span><ChevronDown size={15} /></div>
          </section>

          <aside className="conversation-panel"><div className="conversation-head"><div className="assistant-avatar"><Sparkles size={19} /></div><div className="assistant-names"><strong>Your assistant</strong><span><span className="online-dot" /> Here with you</span></div><button className="conversation-menu" aria-label="Conversation options" onClick={reset}><RotateCcw size={15} /></button></div><div className="context-strip"><div className="context-spark"><Sparkles size={14} /></div><div><span>KEEPING IN MIND</span><strong>{context.destination}, tomorrow at 7 AM <i>·</i> {context.guests} {context.guests === 1 ? "traveller" : "travellers"}</strong></div></div><div className="messages" aria-live="polite">{messages.map((message) => message.from === "you" ? <div className="message-row user-row" key={message.id}><div className="user-bubble">{message.text}</div><div className="user-avatar">A</div></div> : <div className="message-row assistant-row" key={message.id}><div className="message-assistant-icon"><Sparkles size={13} /></div><div className="assistant-bubble">{message.text}</div></div>)}<div className="suggestion-label">PICK UP WHERE WE LEFT OFF</div><button className="suggestion" onClick={() => sendMessage("Actually, my parents are coming too.")}><span className="suggestion-icon"><Users size={15} /></span><span>Actually, my parents are coming too.</span><ArrowDownLeft size={14} /></button></div><div className="composer-wrap"><form className="composer" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}><input aria-label="Message your assistant" placeholder="Tell me what’s on your mind..." value={input} onChange={(e) => setInput(e.target.value)} /><button className="send-button" type="submit" disabled={!input.trim()} aria-label="Send message"><Send size={16} /></button></form><div className="composer-foot"><span><AudioLines size={12} /> Your assistant remembers the context</span><span>SIMULATED EXPERIENCE</span></div></div></aside>
        </div>
        <footer className="page-foot"><span><CloudSun size={14} /> Weather and travel details are illustrative in this demo.</span><span>MADE FOR THE MOMENTS BEFORE YOU GO <Sparkles size={12} /></span></footer>
      </div>
    </section>
    {toast && <div className="toast" role="status"><BadgeCheck size={17} />{toast}<button onClick={() => setToast("")} aria-label="Dismiss notification"><X size={14} /></button></div>}
  </main>;
}
