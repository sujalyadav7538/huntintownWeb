"use client";

import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "../store/hooks";
import { apiFetch } from "../lib/api";
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  Wallet,
  Clock,
  MessageSquare,
  Phone,
  Check,
  CheckCircle2,
  Loader2,
  Navigation,
  ImagePlus,
  X,
  IndianRupee,
  Users,
  Zap,
} from "lucide-react";
import { getAvatarUrl, handleAvatarError } from "../utils";

interface CreatePostProps {
  onClose: () => void;
  onPostCreated?: (postId: string) => void;
}

const CATEGORIES = [
  "Home & Living", "Tech & Electronics", "Education & Tutoring",
  "Health & Wellness", "Events & Celebrations", "Business & Finance",
  "Creative & Design", "Transport & Moving", "Legal & Consulting",
  "Pets & Animals", "Fitness & Sports", "Food & Catering",
];

const CATEGORY_ICONS: Record<string, string> = {
  "Home & Living": "🏠", "Tech & Electronics": "💻", "Education & Tutoring": "📚",
  "Health & Wellness": "💪", "Events & Celebrations": "🎉", "Business & Finance": "💼",
  "Creative & Design": "🎨", "Transport & Moving": "🚚", "Legal & Consulting": "⚖️",
  "Pets & Animals": "🐾", "Fitness & Sports": "🏃", "Food & Catering": "🍽️",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Home & Living": "#f97316", "Tech & Electronics": "#6366f1",
  "Education & Tutoring": "#3b82f6", "Health & Wellness": "#22c55e",
  "Events & Celebrations": "#ec4899", "Business & Finance": "#14b8a6",
  "Creative & Design": "#a855f7", "Transport & Moving": "#f59e0b",
  "Legal & Consulting": "#8b5cf6", "Pets & Animals": "#84cc16",
  "Fitness & Sports": "#06b6d4", "Food & Catering": "#ef4444",
};

export default function CreatePost({ onClose, onPostCreated }: CreatePostProps) {
  const currentUser = useAppSelector((s) => s.auth.currentUser);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Home & Living");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [expiryDays, setExpiryDays] = useState(7);
  const [contactMethods, setContactMethods] = useState({ whatsApp: true, phone: false, chat: true });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    return () => { imagePreviews.forEach(URL.revokeObjectURL); };
  }, [imagePreviews]);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCoords([pos.coords.longitude, pos.coords.latitude]); setLocating(false); },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  useEffect(() => { detectLocation(); }, []);

  const addImages = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, 3 - imageFiles.length);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setImageFiles((p) => [...p, ...newFiles]);
    setImagePreviews((p) => [...p, ...newPreviews]);
  };

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(imagePreviews[idx]);
    setImageFiles((p) => p.filter((_, i) => i !== idx));
    setImagePreviews((p) => p.filter((_, i) => i !== idx));
  };

  const canSubmit = description.trim().length >= 10 && address.trim().length > 0;
  const previewTitle = description.length > 60 ? description.substring(0, 60) + "…" : description;
  const previewBudget = budget.trim() || "Negotiable";
  const accentColor = CATEGORY_COLORS[category] || "#FF3F3F";

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    const locationCoords: [number, number] = coords ?? [77.3649, 28.6273];

    const formData = new FormData();
    formData.append("title", previewTitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("address", address.trim());
    formData.append("location", JSON.stringify({ type: "Point", coordinates: locationCoords }));
    formData.append("type", "help_needed");
    formData.append("budget", budget.trim() || "Negotiable");
    formData.append("timeline", timeline.trim() || "Flexible");
    formData.append("status", "live");
    formData.append("expiryDays", String(expiryDays));
    formData.append("expiresAt", expiryDate.toISOString());
    formData.append("questions", JSON.stringify([]));
    formData.append("contactMethods", JSON.stringify(contactMethods));
    imageFiles.forEach((file) => formData.append("images", file));

    try {
      const token = localStorage.getItem("access_token");
      const response = await apiFetch("/api/posts", {
        method: "POST",
        headers: { Authorization: `${token}` }, // No Content-Type — browser sets multipart boundary
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create post");
      setSubmitted(true);
      const postId = data.post?._id || data.post?.id || data.id;
      setTimeout(() => { onClose(); if (postId && onPostCreated) onPostCreated(postId); }, 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const inp = "w-full px-3.5 py-2.5 bg-[#111113] border border-[#252529] text-sm text-zinc-100 rounded-xl placeholder-zinc-600 focus:outline-none focus:border-[#FF3F3F]/60 transition-all duration-200";
  const lbl = "block text-xs font-semibold text-zinc-400 mb-1.5";

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5 text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Post is Live!</h2>
          <p className="text-zinc-400 text-sm">Your requirement has been published. Helpers nearby will see it now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] flex flex-col overflow-hidden animate-in fade-in duration-200">

      {/* Top bar */}
      <header className="shrink-0 flex items-center justify-between px-6 py-3.5 border-b border-[#1a1a1e] bg-[#0e0e10]">
        <button onClick={onClose} className="flex items-center gap-2 text-zinc-400 hover:text-white transition text-sm font-medium cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF3F3F]" />
          <span className="text-sm font-bold text-white">Post a Requirement</span>
        </div>
        <button type="button" disabled={!canSubmit || submitting} onClick={handleSubmit} id="submit-create-post-btn"
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FF3F3F] hover:bg-[#e53535] text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
          {submitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing…</> : <><Sparkles className="w-3.5 h-3.5" /> Publish</>}
        </button>
      </header>

      {/* Two-column body */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT: Form */}
        <div className="overflow-y-auto px-6 py-6 space-y-6 border-r border-[#1a1a1e]">

          <div>
            <label className={lbl}>What do you need? <span className="text-[#FF3F3F]">*</span></label>
            <textarea placeholder="e.g. I need a plumber to fix a leaking pipe in my kitchen…" rows={4}
              value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300}
              className={`${inp} resize-none`} />
            <div className="flex justify-between mt-1.5">
              {description.trim().length > 0 && description.trim().length < 10 && <span className="text-[11px] text-amber-500">Min. 10 characters required</span>}
              <span className="text-[11px] text-zinc-600 ml-auto font-mono">{description.length}/300</span>
            </div>
          </div>

          <div>
            <label className={lbl}>Category</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat} type="button" onClick={() => setCategory(cat)}
                  className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border text-center transition-all cursor-pointer ${category === cat ? "text-white" : "bg-[#111113] border-[#252529] text-zinc-500 hover:border-[#333337] hover:text-zinc-300"}`}
                  style={category === cat ? { backgroundColor: `${accentColor}15`, borderColor: `${accentColor}50` } : {}}>
                  <span className="text-lg leading-none">{CATEGORY_ICONS[cat]}</span>
                  <span className="text-[9px] font-semibold leading-tight">{cat.split(" & ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={lbl}><span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> Address <span className="text-[#FF3F3F]">*</span></span></label>
            <div className="flex gap-2">
              <input type="text" placeholder="e.g. Noida, Sector 62" value={address} onChange={(e) => setAddress(e.target.value)} className={`${inp} flex-1`} />
              <button type="button" onClick={detectLocation} title="Detect my location"
                className="px-3 rounded-xl border border-[#252529] bg-[#111113] text-zinc-500 hover:text-[#FF3F3F] hover:border-[#FF3F3F]/40 transition cursor-pointer">
                {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              </button>
            </div>
            {coords && <p className="text-[11px] text-emerald-500 mt-1.5 flex items-center gap-1"><Check className="w-3 h-3" /> GPS location captured</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}><span className="inline-flex items-center gap-1"><Wallet className="w-3 h-3" /> Budget</span></label>
              <input type="text" placeholder="₹5,000 or Negotiable" value={budget} onChange={(e) => setBudget(e.target.value)} className={inp} />
            </div>
            <div>
              <label className={lbl}><span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Timeline</span></label>
              <input type="text" placeholder="e.g. 3 Days" value={timeline} onChange={(e) => setTimeline(e.target.value)} className={inp} />
            </div>
          </div>

          <div>
            <label className={lbl}><span className="inline-flex items-center gap-1"><ImagePlus className="w-3 h-3" /> Photos <span className="text-zinc-600 font-normal">(max 3)</span></span></label>
            {imageFiles.length < 3 && (
              <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); addImages(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed cursor-pointer transition-all ${dragOver ? "border-[#FF3F3F]/60 bg-[#FF3F3F]/5" : "border-[#252529] hover:border-[#FF3F3F]/40 hover:bg-[#111113]"}`}>
                <ImagePlus className="w-5 h-5 text-zinc-600" />
                <p className="text-xs text-zinc-600">Drop images here or <span className="text-[#FF3F3F]">browse</span></p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addImages(e.target.files)} />
              </div>
            )}
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#252529] group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className={lbl}>Post expires in</label>
            <div className="flex gap-2">
              {[1, 3, 5, 7, 10].map((d) => (
                <button key={d} type="button" onClick={() => setExpiryDays(d)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${expiryDays === d ? "bg-[#FF3F3F]/15 border-[#FF3F3F]/50 text-white" : "bg-[#111113] border-[#252529] text-zinc-500 hover:border-[#333337] hover:text-zinc-300"}`}>
                  {d}d
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={lbl}>Contact via</label>
            <div className="flex gap-2">
              {([
                { key: "whatsApp", label: "WhatsApp", icon: MessageSquare, on: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" },
                { key: "phone", label: "Phone", icon: Phone, on: "text-blue-400 border-blue-500/40 bg-blue-500/10" },
                { key: "chat", label: "In-App", icon: MessageSquare, on: "text-[#FF3F3F] border-[#FF3F3F]/40 bg-[#FF3F3F]/10" },
              ] as const).map((m) => {
                const active = contactMethods[m.key];
                return (
                  <button key={m.key} type="button" onClick={() => setContactMethods((p) => ({ ...p, [m.key]: !p[m.key] }))}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl border transition-all cursor-pointer text-xs font-semibold ${active ? m.on : "bg-[#111113] border-[#252529] text-zinc-600 hover:border-[#333337]"}`}>
                    <m.icon className="w-3.5 h-3.5" />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">{error}</div>}

          <div className="lg:hidden pt-2 pb-8">
            <button type="button" disabled={!canSubmit || submitting} onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FF3F3F] hover:bg-[#e53535] text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing…</> : <><Sparkles className="w-4 h-4" /> Publish Post</>}
            </button>
          </div>
        </div>

        {/* RIGHT: Live preview */}
        <div className="hidden lg:flex flex-col overflow-y-auto bg-[#0a0a0c] px-8 py-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF3F3F] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Live Preview</span>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#1e1e22] bg-[#0e0e10]" style={{ borderLeft: `3px solid ${accentColor}` }}>
            <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}55, transparent)` }} />
            <div className="p-5 space-y-4">

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative shrink-0">
                    <img src={getAvatarUrl(currentUser?.name || "You", currentUser?.avatar)} alt={currentUser?.name || "You"}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-[#1e1e22]"
                      onError={(e) => handleAvatarError(e, currentUser?.name || "You")} referrerPolicy="no-referrer" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0e0e10]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-zinc-100">{currentUser?.name || "You"}</p>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-500 mt-0.5">
                      <MapPin className="w-3 h-3" /><span>{address || "Location"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-[#262629] bg-[#161619] px-2.5 py-1 text-[11px] text-zinc-400">
                  <Users className="w-3 h-3 text-zinc-500" /><span>0</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-[15px] font-bold text-zinc-100 leading-snug">
                  {previewTitle || <span className="text-zinc-600 italic font-normal text-sm">Your title will appear here…</span>}
                </h3>
                <p className="text-[12px] text-zinc-500 leading-relaxed line-clamp-3">
                  {description || <span className="italic text-zinc-700">Description will appear here…</span>}
                </p>
              </div>

              {imagePreviews.length > 0 && (
                <div className={`grid gap-1.5 ${imagePreviews.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                  {imagePreviews.map((src, i) => (
                    <img key={i} src={src} alt="" className={`w-full object-cover rounded-xl border border-[#1e1e22] ${imagePreviews.length === 1 ? "max-h-48" : "h-28"}`} />
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide"
                  style={{ color: accentColor, borderColor: `${accentColor}30`, backgroundColor: `${accentColor}12` }}>
                  {category}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#232328] rounded-full text-[10px] font-semibold text-zinc-400">
                  <IndianRupee className="w-2.5 h-2.5" />{previewBudget}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950/40 border border-emerald-900/40 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                  <Clock className="w-2.5 h-2.5" />Expires in {expiryDays}d
                </span>
                {description.toLowerCase().includes("urgent") && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-black tracking-widest bg-[#FF3F3F]/15 text-[#FF3F3F] border border-[#FF3F3F]/30 px-1.5 py-0.5 rounded-full uppercase">
                    <Zap className="w-2.5 h-2.5" /> Urgent
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-700 mt-4 text-center">This is exactly how your post will appear in the feed.</p>
        </div>
      </div>
    </div>
  );
}
