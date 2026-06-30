import React, { useState } from "react";
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
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: 3,
    name: "Michael Brown",
    phone: "+1 (555) 456-7890",
    time: "Yesterday",
    duration: "08:11",
    type: "missed",
    initials: "MB",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: 4,
    name: "Emily Wilson",
    phone: "+1 (555) 234-5678",
    time: "Yesterday",
    duration: "11:07",
    type: "incoming",
    initials: "EW",
    color: "from-sky-500 to-blue-600",
  },
  {
    id: 5,
    name: "David Lee",
    phone: "+1 (555) 345-6789",
    time: "May 20",
    duration: "07:19",
    type: "incoming",
    initials: "DL",
    color: "from-orange-500 to-red-600",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    phone: "+1 (555) 678-9012",
    time: "May 20",
    duration: "04:45",
    type: "missed",
    initials: "LA",
    color: "from-pink-500 to-rose-600",
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
    color: "from-cyan-500 to-sky-600",
  },
];

const transcript = [
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
];

const keyPoints = [
  "Interested in Enterprise Plan",
  "Team Size: 50 people",
  "Needs: Analytics, CRM, Priority Support",
  "Next Step: Schedule Demo",
];

const tabs = ["All Calls", "Missed", "Incoming", "Outgoing"];

const typeIcon = {
  incoming: <PhoneIncoming className="w-4 h-4 text-emerald-400" />,
  missed: <PhoneMissed className="w-4 h-4 text-rose-400" />,
  outgoing: <PhoneOutgoing className="w-4 h-4 text-sky-400" />,
};

function Waveform({ bars = 60, active = false }) {
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
          className={`w-[2px] rounded-full ${
            active && i < bars * 0.4
              ? "bg-violet-400"
              : "bg-slate-600/60"
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
  const selected = calls.find((c) => c.id === selectedId);

return (
  <div className="dashboard">
    <Sidebar />

    <main className="main-content">
      <div className="min-h-screen bg-[#0a0a14] text-slate-200 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div>
          <h1 className="text-lg font-semibold text-white">
            AI Communications
          </h1>
          <p className="text-xs text-slate-500">
            Manage calls, contacts and conversations with AI intelligence.
          </p>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
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
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-semibold text-white">
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-[#0a0a14]" />
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="grid grid-cols-[300px_1fr_280px] gap-4 p-4 h-[calc(100vh-73px)]">
        {/* Left: call list */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
          <div className="flex items-center gap-1 px-3 pt-3 pb-2 border-b border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1.5 text-xs rounded-lg transition ${
                  activeTab === tab
                    ? "text-violet-400 font-medium"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab}
              </button>
            ))}
            <button className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {calls.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left border-b border-white/[0.03] transition ${
                  selectedId === c.id ? "bg-violet-600/10" : "hover:bg-white/[0.03]"
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
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">
                        VIP
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{c.phone}</span>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[11px] text-slate-500">{c.time}</span>
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
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-semibold text-white">
                  JD
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0a14]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-white">
                      {selected.name}
                    </h2>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">
                      VIP
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{selected.phone}</p>
                  <div className="flex items-center gap-2 mt-2">
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
                <p className="text-xs text-slate-500">10:24 AM</p>
                <p className="text-xs text-slate-500">May 21, 2025</p>
                <p className="text-sm font-medium text-white mt-2">12:45</p>
              </div>
            </div>

            <div className="mt-4">
              <Waveform active />
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
              {[
                { icon: Mic, label: "Mute" },
                { icon: Grid3x3, label: "Keypad" },
                { icon: Plus, label: "Add Call" },
                { icon: Pause, label: "Hold" },
                { icon: ArrowLeftRight, label: "Transfer" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <button className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition">
                    <Icon className="w-4 h-4 text-slate-300" />
                  </button>
                  <span className="text-[10px] text-slate-500">{label}</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-1.5">
                <button className="w-11 h-11 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center transition">
                  <PhoneOff className="w-4 h-4 text-white" />
                </button>
                <span className="text-[10px] text-slate-500">End Call</span>
              </div>
            </div>
          </div>

          {/* Transcript + summary */}
          <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white">
                  Call Transcript
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                    <input
                      placeholder="Search in transcript"
                      className="bg-white/5 border border-white/10 rounded-lg pl-6 pr-2 py-1 text-[11px] placeholder:text-slate-500 w-36 focus:outline-none"
                    />
                  </div>
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                {transcript.map((t, i) => (
                  <div key={i}>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-xs font-medium ${
                          t.speaker === "John Davis"
                            ? "text-violet-300"
                            : "text-emerald-300"
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

            <div className="bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
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
                  John is interested in the enterprise plan for his team of
                  50 people. He needs advanced analytics, CRM integration,
                  and priority support. He is considering our solution and
                  would like to see a demo.
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
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px]">
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
            <button className="w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center transition">
              <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="white" />
            </button>
            <span className="text-xs text-slate-500 w-10">00:00</span>
            <div className="flex-1">
              <Waveform bars={90} active />
            </div>
            <span className="text-xs text-slate-500">12:45</span>
            <button className="text-[11px] text-slate-400 border border-white/10 rounded-md px-2 py-1">
              1x
            </button>
            <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>

        {/* Right: contact info + AI insights */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">
                Contact Information
              </h3>
              <button className="text-xs text-violet-400">Edit</button>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-xs text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                john.davis@techcorp.com
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-400">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                TechCorp Solutions
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                New York, USA
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Local Time: 10:24 AM
              </li>
            </ul>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">AI Insights</h3>
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
                <div className="w-7 h-7 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0">
                  <Grid3x3 className="w-3.5 h-3.5 text-sky-400" />
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
              <button className="text-xs text-violet-400">Manage</button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {["VIP", "Lead", "Enterprise"].map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-violet-600/15 text-violet-300"
                >
                  {tag}
                </span>
              ))}
              <button className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
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
