import React, { useState } from "react";
import "./AICommunications.css";
import Sidebar from "../components/Sidebar";
import {
  Search,
  Plus,
  Phone,
  Bell,
  Filter,
  Mic,
  Grid3x3,
  PhoneOff,
  Pause,
  ArrowLeftRight,
  Mail,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Download,
  Calendar,
  ChevronDown,
  Play,
  Maximize2,
  Smile,
  Target,
  Star,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
} from "lucide-react";

const calls = [
  {
    id: 1,
    name: "John Davis",
    vip: true,
    phone: "+1 (555) 123-4567",
    time: "10:24 AM",
    duration: "12:45",
    type: "incoming",
    active: true,
    initials: "JD",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    phone: "+1 (555) 987-6543",
    time: "9:15 AM",
    duration: "05:32",
    type: "incoming",
    initials: "SJ",
    color: "from-fuchsia-500 to-purple-600",
  },
  {
    id: 3,
    name: "Michael Brown",
    phone: "+1 (555) 456-7890",
    time: "Yesterday",
    duration: "08:11",
    type: "missed",
    initials: "MB",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: 4,
    name: "Emily Wilson",
    phone: "+1 (555) 234-5678",
    time: "Yesterday",
    duration: "11:07",
    type: "incoming",
    initials: "EW",
    color: "from-violet-500 to-fuchsia-600",
  },
  {
    id: 5,
    name: "David Lee",
    phone: "+1 (555) 345-6789",
    time: "May 20",
    duration: "07:19",
    type: "incoming",
    initials: "DL",
    color: "from-purple-500 to-violet-700",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    phone: "+1 (555) 678-9012",
    time: "May 20",
    duration: "04:45",
    type: "missed",
    initials: "LA",
    color: "from-fuchsia-500 to-pink-600",
  },
  {
    id: 7,
    name: "Robert Taylor",
    phone: "+1 (555) 789-0123",
    time: "May 19",
    duration: "06:33",
    type: "incoming",
    initials: "RT",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: 8,
    name: "Olivia Martinez",
    phone: "+1 (555) 890-1234",
    time: "May 19",
    duration: "09:21",
    type: "incoming",
    initials: "OM",
    color: "from-violet-500 to-purple-700",
  },
];

const transcriptData = {
  1: [
    {
      speaker: "John Davis",
      time: "10:24 AM",
      text: "Hi, I'm interested in learning more about your enterprise plan and pricing options.",
    },
    {
      speaker: "AI Assistant",
      time: "10:25 AM",
      text: "Of course! I'd be happy to help you with information about our enterprise plan. Could you tell me about your team size and specific needs?",
    },
    {
      speaker: "John Davis",
      time: "10:26 AM",
      text: "We have a team of 50 people and we need advanced analytics, CRM integration, and priority support.",
    },
    {
      speaker: "AI Assistant",
      time: "10:27 AM",
      text: "Perfect! Our enterprise plan includes all of that and more. Would you like me to schedule a demo for you?",
    },
  ],
};

const defaultTranscript = [
  {
    speaker: "Contact",
    time: "--:--",
    text: "No transcript available yet for this call.",
  },
];

const keyPointsData = {
  1: [
    "Interested in Enterprise Plan",
    "Team Size: 50 people",
    "Needs: Analytics, CRM, Priority Support",
    "Next Step: Schedule Demo",
  ],
};

const defaultKeyPoints = ["No key points extracted yet"];

const tabs = ["All Calls", "Missed", "Incoming", "Outgoing"];

const typeIcon = {
  incoming: <PhoneIncoming className="w-4 h-4 text-emerald-400" />,
  missed: <PhoneMissed className="w-4 h-4 text-rose-400" />,
  outgoing: <PhoneOutgoing className="w-4 h-4 text-sky-400" />,
};

function Waveform({ bars = 60, active = false, progress = 0.4 }) {
  const heights = React.useMemo(
    () =>
      Array.from({ length: bars }, () => 8 + Math.round(Math.random() * 28)),
    [bars]
  );
  return (
    <div className="flex items-center gap-[2px] h-10 w-full">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`w-[2px] rounded-full transition-colors ${
            active && i < bars * progress ? "bg-violet-400" : "bg-slate-600/60"
          }`}
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

export default function AICommunications() {
  const [activeTab, setActiveTab] = useState("All Calls");
  const [selectedId, setSelectedId] = useState(1);
  const [query, setQuery] = useState("");
  const [muted, setMuted] = useState(false);
  const [onHold, setOnHold] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [tags, setTags] = useState(["VIP", "Lead", "Enterprise"]);

  const selected = calls.find((c) => c.id === selectedId) || calls[0];
  const transcript = transcriptData[selectedId] || defaultTranscript;
  const keyPoints = keyPointsData[selectedId] || defaultKeyPoints;

  const filteredCalls = calls
    .filter((c) => {
      if (activeTab === "Missed") return c.type === "missed";
      if (activeTab === "Incoming") return c.type === "incoming";
      if (activeTab === "Outgoing") return c.type === "outgoing";
      return true;
    })
    .filter((c) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
      );
    });

  const addTag = () => {
    const t = window.prompt("New tag name");
    if (t && t.trim() && !tags.includes(t.trim())) {
      setTags([...tags, t.trim()]);
    }
  };

  return (
    <div className="dashboard ai-page">
      <Sidebar />

      <main className="main-content">
        <div className="text-slate-200 font-sans">
          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-white/5">
            <div>
              <h1 className="text-lg font-semibold text-white">
                AI Communications
              </h1>
              <p className="text-xs text-slate-500">
                Manage calls, contacts and conversations with AI intelligence.
              </p>
            </div>

            <div className="flex-1 min-w-[200px] max-w-md order-3 sm:order-none">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search contacts, calls..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition px-4 py-2 rounded-xl text-sm font-medium text-white">
                <Plus className="w-4 h-4" /> New Call
              </button>
              <button className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5">
                <Phone className="w-4 h-4 text-slate-300" />
              </button>
              <button className="relative w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5">
                <Bell className="w-4 h-4 text-slate-300" />
                <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </button>
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-semibold text-white">
                AI
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-[#0a0a14]" />
              </div>
            </div>
          </header>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_280px] gap-4 p-4">
            {/* Left: call list */}
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col overflow-hidden max-h-[70vh] lg:max-h-[calc(100vh-105px)]">
              <div className="flex items-center gap-1 px-3 pt-3 pb-2 border-b border-white/5 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1.5 text-xs rounded-lg transition whitespace-nowrap ${
                      activeTab === tab
                        ? "text-violet-400 font-medium bg-violet-600/10"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <button className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredCalls.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-6">
                    No calls match your search.
                  </p>
                )}
                {filteredCalls.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left border-b border-white/[0.03] transition ${
                      selectedId === c.id
                        ? "bg-violet-600/10"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-xs font-semibold text-white shrink-0`}
                    >
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-white truncate">
                          {c.name}
                        </span>
                        {c.vip && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold shrink-0">
                            VIP
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">{c.phone}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[11px] text-slate-500">
                        {c.time}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-slate-600">
                          {c.duration}
                        </span>
                        {typeIcon[c.type]}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="py-3 text-center border-t border-white/5">
                <button className="text-xs text-violet-400 flex items-center gap-1 mx-auto hover:text-violet-300">
                  Load more <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Middle: active call + transcript */}
            <div className="flex flex-col gap-4 overflow-hidden">
              {/* Call card */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                      {selected.initials}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0a14]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-white">
                          {selected.name}
                        </h2>
                        {selected.vip && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">
                            VIP
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{selected.phone}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-slate-400">
                          Lead
                        </span>
                        <span className="text-[10px] px-2 py-1 rounded-md bg-violet-600/20 text-violet-300">
                          Interested in Enterprise Plan
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{selected.time}</p>
                    <p className="text-sm font-medium text-white mt-2">
                      {selected.duration}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Waveform active={!onHold} />
                </div>

                <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      onClick={() => setMuted((m) => !m)}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
                        muted
                          ? "bg-rose-600/30 text-rose-300"
                          : "bg-white/5 hover:bg-white/10 text-slate-300"
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] text-slate-500">
                      {muted ? "Muted" : "Mute"}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <button className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition">
                      <Grid3x3 className="w-4 h-4 text-slate-300" />
                    </button>
                    <span className="text-[10px] text-slate-500">Keypad</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <button className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition">
                      <Plus className="w-4 h-4 text-slate-300" />
                    </button>
                    <span className="text-[10px] text-slate-500">Add Call</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      onClick={() => setOnHold((h) => !h)}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
                        onHold
                          ? "bg-amber-600/30 text-amber-300"
                          : "bg-white/5 hover:bg-white/10 text-slate-300"
                      }`}
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] text-slate-500">
                      {onHold ? "On Hold" : "Hold"}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <button className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition">
                      <ArrowLeftRight className="w-4 h-4 text-slate-300" />
                    </button>
                    <span className="text-[10px] text-slate-500">Transfer</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <button className="w-11 h-11 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center transition">
                      <PhoneOff className="w-4 h-4 text-white" />
                    </button>
                    <span className="text-[10px] text-slate-500">End Call</span>
                  </div>
                </div>
              </div>

              {/* Transcript + summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col overflow-hidden max-h-96">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <h3 className="text-sm font-semibold text-white">
                      Call Transcript
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="relative hidden sm:block">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                        <input
                          placeholder="Search in transcript"
                          className="bg-white/5 border border-white/10 rounded-lg pl-6 pr-2 py-1 text-[11px] placeholder:text-slate-500 w-36 focus:outline-none"
                        />
                      </div>
                      <button title="Download transcript">
                        <Download className="w-3.5 h-3.5 text-slate-500 hover:text-violet-400" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                    {transcript.map((t, i) => (
                      <div key={i}>
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`text-xs font-medium ${
                              t.speaker === "AI Assistant"
                                ? "text-emerald-300"
                                : "text-violet-300"
                            }`}
                          >
                            {t.speaker}
                          </span>
                          <span className="text-[10px] text-slate-600">
                            {t.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {t.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="py-2 text-center border-t border-white/5">
                    <button className="text-xs text-violet-400 flex items-center gap-1 mx-auto">
                      Show more <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col overflow-hidden max-h-96">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <h3 className="text-sm font-semibold text-white">
                      Call Summary
                    </h3>
                    <span className="flex items-center gap-1 text-[10px] text-violet-400">
                      <Sparkles className="w-3 h-3" /> AI Generated
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-3">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {selectedId === 1
                        ? "John is interested in the enterprise plan for his team of 50 people. He needs advanced analytics, CRM integration, and priority support. He is considering our solution and would like to see a demo."
                        : `Summary for the call with ${selected.name} will appear here once the transcript has been analyzed.`}
                    </p>
                    <h4 className="text-xs font-semibold text-white mt-4 mb-2">
                      Key Points
                    </h4>
                    <ul className="space-y-2">
                      {keyPoints.map((p) => (
                        <li
                          key={p}
                          className="flex items-center gap-2 text-xs text-slate-400"
                        >
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] shrink-0">
                            ✓
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 border-t border-white/5">
                    <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition py-2 rounded-xl text-xs font-medium text-white">
                      <Calendar className="w-3.5 h-3.5" /> Schedule Follow-up
                    </button>
                  </div>
                </div>
              </div>

              {/* Player */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-3">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center transition shrink-0"
                >
                  {playing ? (
                    <Pause className="w-3.5 h-3.5 text-white" fill="white" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="white" />
                  )}
                </button>
                <span className="text-xs text-slate-500 w-10 shrink-0">
                  00:00
                </span>
                <div className="flex-1 min-w-0">
                  <Waveform bars={90} active={playing} />
                </div>
                <span className="text-xs text-slate-500 shrink-0">
                  {selected.duration}
                </span>
                <button className="text-[11px] text-slate-400 border border-white/10 rounded-md px-2 py-1 shrink-0 hover:bg-white/5">
                  1x
                </button>
                <button title="Fullscreen">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500 hover:text-violet-400 shrink-0" />
                </button>
              </div>
            </div>

            {/* Right: contact info + AI insights */}
            <div className="flex flex-col gap-4">
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">
                    Contact Information
                  </h3>
                  <button className="text-xs text-violet-400 hover:text-violet-300">
                    Edit
                  </button>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2.5 text-xs text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">john.davis@techcorp.com</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {selected.phone}
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-400">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    TechCorp Solutions
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    New York, USA
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    Local Time: {selected.time}
                  </li>
                </ul>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">
                    AI Insights
                  </h3>
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Smile className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Sentiment</p>
                      <p className="text-xs font-medium text-emerald-400">
                        Positive
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Very engaged and interested
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                      <Target className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Intent</p>
                      <p className="text-xs font-medium text-violet-400">
                        High Intent
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Looking for enterprise solution
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Grid3x3 className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 mb-1">
                        Topics Discussed
                      </p>
                      <ul className="text-[11px] text-slate-400 space-y-0.5">
                        <li>• Enterprise Plan</li>
                        <li>• Pricing</li>
                        <li>• Team Size</li>
                        <li>• Integrations</li>
                        <li>• Support</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">
                        Next Best Action
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Schedule a product demo and send pricing details
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">Tags</h3>
                  <button className="text-xs text-violet-400 hover:text-violet-300">
                    Manage
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-violet-600/15 text-violet-300"
                    >
                      {tag}
                    </span>
                  ))}
                  <button
                    onClick={addTag}
                    className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
