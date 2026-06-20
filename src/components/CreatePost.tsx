"use client";

import { useState, FormEvent } from "react";
import { useAppSelector } from "../store/hooks";
import { apiFetch } from "../lib/api";
import { FUNCTIONAL_CATEGORIES } from "../data";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MapPin,
  Wallet,
  Clock,
  CalendarRange,
  HelpCircle,
  MessageSquare,
  Phone,
  Check,
  CheckCircle2,
  Loader2,
  FileText,
  Settings2,
} from "lucide-react";
import CustomQuestionsInput from "./create-post/CustomQuestionsInput";
import ContactMethodsToggle from "./create-post/ContactMethodsToggle";

interface CreatePostProps {
  onClose: () => void;
  onPostCreated?: (postId: string) => void;
}

const STEPS = [
  { id: 1, label: "Basics", icon: FileText },
  { id: 2, label: "Details", icon: MapPin },
  { id: 3, label: "Settings", icon: Settings2 },
];

const CATEGORY_ICONS: Record<string, string> = {
  "Home & Living": "🏠",
  "Tech & Electronics": "💻",
  "Education & Tutoring": "📚",
  "Health & Wellness": "💪",
  "Events & Celebrations": "🎉",
  "Business & Finance": "💼",
  "Creative & Design": "🎨",
  "Transport & Moving": "🚚",
  "Legal & Consulting": "⚖️",
  "Pets & Animals": "🐾",
  "Fitness & Sports": "🏃",
  "Food & Catering": "🍽️",
};

export default function CreatePost({ onClose, onPostCreated }: CreatePostProps) {
  const currentUser = useAppSelector((s) => s.auth.currentUser);

  // Step state
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Step 1 fields
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Home & Living");
  const [postType, setPostType] = useState<"help_needed" | "skill_offered">("help_needed");

  // Step 2 fields
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [location, setLocation] = useState(currentUser?.location || "");
  const [expiryDays, setExpiryDays] = useState(7);

  // Step 3 fields
  const [questions, setQuestions] = useState<string[]>([""]);
  const [contactMethods, setContactMethods] = useState({
    whatsApp: true,
    phone: false,
    chat: true,
  });

  const canAdvanceStep1 = description.trim().length >= 10;
  const canAdvanceStep2 = location.trim().length > 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    const title = description.length > 60 ? description.substring(0, 60) + "..." : description;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    const filteredQuestions = questions.map((q) => q.trim()).filter((q) => q.length > 0);

    const payload = {
      title,
      description,
      category,
      location,
      type: postType,
      budget: budget.trim() || "Negotiable",
      timeline: timeline.trim() || "Flexible",
      status: "open",
      expiryDays,
      expiresAt: expiryDate.toISOString(),
      questions: filteredQuestions,
      contactMethods,
      images: [],
    };

    try {
      const token = localStorage.getItem("access_token");
      const response = await apiFetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create post");

      setSubmitted(true);
      const postId = data.post?._id || data.post?.id || data.id;
      setTimeout(() => {
        onClose();
        if (postId && onPostCreated) onPostCreated(postId);
      }, 1600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] text-sm text-zinc-100 rounded-xl placeholder-zinc-600 focus:outline-none focus:border-[#FF3F3F]/60 focus:bg-white/[0.05] transition-all duration-200";
  const labelCls = "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-2";

  // ── Success screen ──
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#0E0E10] border border-white/[0.07] rounded-3xl p-12 flex flex-col items-center gap-5 text-center max-w-sm w-full shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white mb-1">Post is Live!</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Your requirement has been published. Helpers nearby will see it now.
            </p>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full animate-[progress_1.5s_ease-in-out]" style={{ width: "100%", transition: "width 1.5s ease-in-out" }} />
          </div>
          <p className="text-xs text-zinc-600">Taking you there…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0E0E10] border border-white/[0.07] rounded-3xl max-w-lg w-full shadow-[0_0_60px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#FF3F3F]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF3F3F]">
                  New Posting
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-white leading-tight">
                {step === 1 && "What do you need?"}
                {step === 2 && "Describe the details"}
                {step === 3 && "Final settings"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition cursor-pointer shrink-0 mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <button
                  type="button"
                  onClick={() => step > s.id && setStep(s.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                    step === s.id
                      ? "bg-[#FF3F3F]/15 border border-[#FF3F3F]/40 text-[#FF3F3F]"
                      : step > s.id
                      ? "bg-white/5 border border-white/10 text-zinc-400 cursor-pointer hover:border-white/20"
                      : "bg-transparent border border-white/4 text-zinc-700 cursor-default"
                  }`}
                >
                  {step > s.id ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <s.icon className="w-3 h-3" />
                  )}
                  {s.label}
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px ${step > s.id ? "bg-[#FF3F3F]/30" : "bg-white/5"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-white/5 mx-6" />

        {/* ── Form Content ── */}
        <div className="px-6 py-5 overflow-y-auto max-h-[55vh] space-y-5">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              {/* Post type toggle */}
              <div>
                <label className={labelCls}>I want to</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: "help_needed", label: "Get Help", sub: "Find someone to help me", emoji: "🙋" },
                    { value: "skill_offered", label: "Offer Skills", sub: "Share what I can do", emoji: "⚡" },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPostType(opt.value)}
                      className={`flex flex-col items-start gap-1 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        postType === opt.value
                          ? "bg-[#FF3F3F]/10 border-[#FF3F3F]/50 shadow-[0_0_12px_rgba(255,63,63,0.15)]"
                          : "bg-white/2 border-white/6 hover:border-white/12"
                      }`}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className={`text-sm font-bold ${postType === opt.value ? "text-white" : "text-zinc-300"}`}>
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-zinc-500 leading-tight">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Describe your requirement</label>
                <textarea
                  id="create-post-desc-textarea"
                  placeholder={
                    postType === "help_needed"
                      ? "e.g. I need a plumber to fix a leaking pipe in my kitchen…"
                      : "e.g. I offer professional web design services for small businesses…"
                  }
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={300}
                  className={`${inputCls} resize-none`}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[11px] text-zinc-600">
                    {description.trim().length < 10 && description.length > 0 && (
                      <span className="text-amber-500">At least 10 characters required</span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          description.length > 200 ? "bg-[#FF3F3F]" : description.length > 100 ? "bg-amber-400" : "bg-emerald-500"
                        }`}
                        style={{ width: `${(description.length / 300) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-zinc-600 font-mono">{description.length}/300</span>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className={labelCls}>Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {FUNCTIONAL_CATEGORIES.filter((c) => c !== "All Categories").map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        category === cat
                          ? "bg-[#FF3F3F]/10 border-[#FF3F3F]/50 text-white"
                          : "bg-white/2 border-white/6 text-zinc-400 hover:border-white/12 hover:text-zinc-200"
                      }`}
                    >
                      <span className="text-xl leading-none">{CATEGORY_ICONS[cat] || "📌"}</span>
                      <span className="text-[10px] font-semibold leading-tight">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>
                    <span className="inline-flex items-center gap-1.5"><Wallet className="w-3 h-3" /> Budget</span>
                  </label>
                  <input
                    id="create-post-budget"
                    type="text"
                    placeholder="e.g. ₹5,000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    <span className="inline-flex items-center gap-1.5"><Clock className="w-3 h-3" /> Timeline</span>
                  </label>
                  <input
                    id="create-post-timeline"
                    type="text"
                    placeholder="e.g. 3 Days"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Location <span className="text-[#FF3F3F]">*</span></span>
                </label>
                <input
                  id="create-post-location-input"
                  type="text"
                  placeholder="e.g. Noida, Sector 62"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  <span className="inline-flex items-center gap-1.5"><CalendarRange className="w-3 h-3" /> Auto-expire after</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[1, 2, 3, 5, 7, 10].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setExpiryDays(days)}
                      className={`py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                        expiryDays === days
                          ? "bg-[#FF3F3F]/15 border-[#FF3F3F]/50 text-white"
                          : "bg-white/2 border-white/6 text-zinc-500 hover:border-white/12 hover:text-zinc-300"
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-600 mt-2">
                  Post auto-expires in <span className="text-zinc-400 font-semibold">{expiryDays} day{expiryDays > 1 ? "s" : ""}</span>
                </p>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <CustomQuestionsInput questions={questions} setQuestions={setQuestions} />

              <div>
                <label className={labelCls}>Preferred contact</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: "whatsApp", label: "WhatsApp", icon: MessageSquare, activeClass: "bg-emerald-500/10 border-emerald-500/40 text-emerald-300" },
                    { key: "phone", label: "Phone Call", icon: Phone, activeClass: "bg-blue-500/10 border-blue-500/40 text-blue-300" },
                    { key: "chat", label: "In-App Chat", icon: MessageSquare, activeClass: "bg-[#FF3F3F]/10 border-[#FF3F3F]/40 text-[#FF3F3F]" },
                  ] as const).map((m) => {
                    const active = contactMethods[m.key];
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setContactMethods((prev) => ({ ...prev, [m.key]: !prev[m.key] }))}
                        className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                          active ? m.activeClass : "bg-white/2 border-white/6 text-zinc-600 hover:border-white/12"
                        }`}
                      >
                        <m.icon className="w-4 h-4" />
                        <span className="text-[11px] font-semibold leading-tight">{m.label}</span>
                        {active && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick summary */}
              <div className="rounded-2xl bg-white/2 border border-white/6 p-4 space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Summary</p>
                {[
                  { icon: "📋", label: description.length > 50 ? description.slice(0, 50) + "…" : description },
                  { icon: CATEGORY_ICONS[category] || "📌", label: category },
                  { icon: "📍", label: location || "—" },
                  { icon: "💰", label: budget || "Negotiable" },
                  { icon: "⏱", label: `Expires in ${expiryDays}d` },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="text-base leading-none w-5 text-center">{row.icon}</span>
                    <span className="text-zinc-400 truncate">{row.label}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer Actions ── */}
        <div className="px-6 py-5 border-t border-white/5 flex items-center gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/8 border border-white/8 text-zinc-400 hover:text-white text-sm font-semibold transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-300 text-sm font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
          )}

          <div className="flex-1" />

          {step < 3 ? (
            <button
              type="button"
              disabled={step === 1 ? !canAdvanceStep1 : !canAdvanceStep2}
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#FF3F3F] to-rose-500 hover:from-rose-500 hover:to-[#FF3F3F] text-white text-sm font-bold transition-all duration-300 shadow-[0_4px_16px_rgba(255,63,63,0.3)] hover:shadow-[0_4px_24px_rgba(255,63,63,0.5)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none active:scale-95 cursor-pointer"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              id="submit-create-post-btn"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-[#FF3F3F] to-rose-500 hover:from-rose-500 hover:to-[#FF3F3F] text-white text-sm font-bold transition-all duration-300 shadow-[0_4px_16px_rgba(255,63,63,0.3)] hover:shadow-[0_4px_24px_rgba(255,63,63,0.5)] disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Publish Post
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
