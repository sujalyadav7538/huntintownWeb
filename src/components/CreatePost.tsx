// import { useEffect, useMemo, useState } from "react";
// import { ArrowLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react";

// import { useAppSelector } from "../store/hooks";
// import { apiFetch } from "../lib/api";

// import PostTypeSelector, {
//   PostType,
// } from "../components/create-post/PostTypeSelector";
// import CategorySelector, {
//   Category,
// } from "../components/create-post/CategorySelector";
// import BudgetSelector, { Budget } from "./create-post/BudgetSelector";
// import LocationSelector from "./create-post/LocationSelector";
// import TimelineSelector, { Timeline } from "./create-post/TimelineSelector";
// import ImageUploader from "./create-post/ImageUploader";
// import PostPreview from "./create-post/PostPreview";
// import DescriptionInput from "./create-post/DescriptionInput";

// export interface CreatePostData {
//   type: PostType;
//   category: string;
//   description: string;
//   address: string;
//   coordinates: [number, number] | null;
//   budget: string;
//   timeline: string;
//   expiryDays: number;
//   images: File[];
// }

// const DEFAULT_EXPIRY_DAYS = 7;

// interface CreatePostProps {
//   onPostCreated?: (postId: string) => void;
// }

// export default function CreatePost({ onPostCreated }: CreatePostProps) {
//   const currentUser = useAppSelector((state) => state.auth.currentUser);

//   /* -------------------------------------------------
//    * Form state
//    * ------------------------------------------------- */

//   const [type, setType] = useState<PostType>("help_needed");

//   const [category, setCategory] = useState<Category>("Home & Living");

//   const [description, setDescription] = useState("");

//   const [address, setAddress] = useState(currentUser?.address || "");

//   const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

//   const [budget, setBudget] = useState<Budget>("Negotiable");

//   const [timeline, setTimeline] = useState<Timeline>("Flexible");

//   const [expiryDays, setExpiryDays] = useState(DEFAULT_EXPIRY_DAYS);

//   const [images, setImages] = useState<File[]>([]);

//   /* -------------------------------------------------
//    * UI state
//    * ------------------------------------------------- */

//   const [submitting, setSubmitting] = useState(false);

//   const [submitted, setSubmitted] = useState(false);

//   const [error, setError] = useState("");

//   /* -------------------------------------------------
//    * Image previews (object URLs for PostPreview)
//    * ------------------------------------------------- */

//   const imagePreviews = useMemo(
//     () => images.map((f) => URL.createObjectURL(f)),
//     [images],
//   );

//   /* -------------------------------------------------
//    * Validation
//    * ------------------------------------------------- */

//   const isValid =
//     description.trim().length >= 10 &&
//     category.trim().length > 0 &&
//     address.trim().length > 0 &&
//     coordinates !== null;

//   /* -------------------------------------------------
//    * Title
//    *
//    * Title is not entered by the user.
//    * It is generated from the description.
//    * ------------------------------------------------- */

//   const generateTitle = () => {
//     const cleaned = description.trim();

//     if (!cleaned) {
//       return "";
//     }

//     if (cleaned.length <= 60) {
//       return cleaned;
//     }

//     return `${cleaned.slice(0, 60).trim()}…`;
//   };

//   /* -------------------------------------------------
//    * Submit
//    * ------------------------------------------------- */

//   const handleSubmit = async () => {
//     if (!isValid || submitting) {
//       return;
//     }

//     setSubmitting(true);
//     setError("");

//     try {
//       /*
//        * Calculate expiry date.
//        */
//       const expiresAt = new Date();

//       expiresAt.setDate(expiresAt.getDate() + expiryDays);

//       /*
//        * Build FormData.
//        *
//        * Only send fields that belong to postSchema.
//        */
//       const formData = new FormData();

//       formData.append("title", generateTitle());

//       formData.append("description", description.trim());

//       formData.append("category", category);

//       formData.append("address", address.trim());

//       formData.append(
//         "location",
//         JSON.stringify({
//           type: "Point",
//           coordinates,
//         }),
//       );

//       formData.append("type", type);

//       formData.append("budget", budget || "Negotiable");

//       formData.append("timeline", timeline || "Flexible");

//       formData.append("status", "live");

//       formData.append("expiryDays", String(expiryDays));

//       formData.append("expiresAt", expiresAt.toISOString());

//       /*
//        * Images
//        */
//       images.forEach((file) => {
//         formData.append("images", file);
//       });

//       /*
//        * Send request.
//        */
//       const response = await apiFetch("/api/posts", {
//         method: "POST",
//         headers: {},
//         body: formData,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to create post");
//       }

//       const postId = data.post?._id || data.post?.id || data.id;

//       setSubmitted(true);

//       /*
//        * Give the success state a moment
//        * before closing the modal.
//        */
//       setTimeout(() => {
//         // onClose();

//         if (postId && onPostCreated) {
//           onPostCreated(postId);
//         }
//       }, 1500);
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Something went wrong. Please try again.",
//       );

//       setSubmitting(false);
//     }
//   };

//   /* -------------------------------------------------
//    * Success state
//    * ------------------------------------------------- */

//   if (submitted) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]">
//         <div className="flex max-w-sm flex-col items-center text-center">
//           <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
//             <CheckCircle2 className="h-8 w-8 text-emerald-400" />
//           </div>

//           <h2 className="mt-5 text-xl font-bold text-white">Post published</h2>

//           <p className="mt-2 text-sm leading-relaxed text-zinc-500">
//             Your post is now visible to people nearby.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   /* -------------------------------------------------
//    * Main
//    * ------------------------------------------------- */

//   return (
//     <div className="h-full min-h-0 overflow-hidden bg-[#09090b]">
//       {/* HEADER */}
//       <header className="h-14 shrink-0 border-b border-white/[0.06] bg-[#0c0c0f]">
//         <div className="flex h-full items-center justify-between px-4 sm:px-6">
//           <div className="flex items-center gap-2.5">
//             <div className="h-1.5 w-1.5 rounded-full bg-[#FF3F3F]" />

//             <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
//               Create Post
//             </span>
//           </div>

//           <span className="hidden text-[10px] text-zinc-700 sm:block">
//             Your post will be visible after publishing
//           </span>
//         </div>
//       </header>

//       {/* CONTENT */}
//       <div className="grid h-[calc(100%-3.5rem)] min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px]">
//         {/* LEFT — FORM */}
//         <main className="min-h-0 min-w-0 overflow-y-auto scrollbar-hide">
//           <div className="mx-auto w-full max-w-3xl px-5 py-7 sm:px-8 sm:py-9 lg:px-12">
//             {/* Intro */}
//             <div className="mb-10">
//               <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
//                 Share your needs or offer
//               </h1>

//               <p className="mt-2 max-w-xl text-xs leading-relaxed text-zinc-600 sm:text-sm">
//                 Add a few details so the right people can understand what you
//                 need.
//               </p>
//             </div>

//             {/* FORM */}
//             <div className="space-y-7">
//               {/* 01 */}
//               <section>
//                 <SectionHeader
//                   step="01"
//                   title="What are you posting?"
//                   description="Choose whether you need help or can provide it."
//                 />

//                 <div className="mt-3">
//                   <PostTypeSelector value={type} onChange={setType} />
//                 </div>
//               </section>

//               {/* 02 */}
//               <section>
//                 <SectionHeader
//                   step="02"
//                   title="What is it about?"
//                   description="Pick the category that best matches your post."
//                 />

//                 <div className="mt-3">
//                   <CategorySelector value={category} onChange={setCategory} />
//                 </div>
//               </section>

//               {/* 03 */}
//               <section>
//                 <SectionHeader
//                   step="03"
//                   title="Tell us about it"
//                   description="A clear description helps people understand your requirement."
//                 />

//                 <div className="mt-3">
//                   <DescriptionInput
//                     value={description}
//                     onChange={setDescription}
//                     postType={type}
//                   />
//                 </div>
//               </section>

//               {/* 04 */}
//               <section>
//                 <SectionHeader
//                   step="04"
//                   title="Where?"
//                   description="Add the location where help is needed."
//                 />

//                 <div className="mt-3">
//                   <LocationSelector
//                     address={address}
//                     coordinates={coordinates}
//                     onAddressChange={setAddress}
//                     onCoordinatesChange={setCoordinates}
//                   />
//                 </div>
//               </section>

//               {/* 05 */}
//               <section>
//                 <SectionHeader
//                   step="05"
//                   title="Budget"
//                   description="Let people know what you have in mind."
//                 />

//                 <div className="mt-3">
//                   <BudgetSelector value={budget} onChange={setBudget} />
//                 </div>
//               </section>

//               {/* 06 */}
//               <section>
//                 <SectionHeader
//                   step="06"
//                   title="When?"
//                   description="Choose an approximate timeline."
//                 />

//                 <div className="mt-3">
//                   <TimelineSelector value={timeline} onChange={setTimeline} />
//                 </div>
//               </section>

//               {/* 07 */}
//               <section>
//                 <SectionHeader
//                   step="07"
//                   title="Add photos"
//                   description="Optional. Up to 3 photos."
//                 />

//                 <div className="mt-3">
//                   <ImageUploader
//                     files={images}
//                     previews={imagePreviews}
//                     onChange={setImages}
//                     maxImages={3}
//                   />
//                 </div>
//               </section>

//               {/* Error */}
//               {error && (
//                 <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3">
//                   <p className="text-xs leading-relaxed text-red-300">
//                     {error}
//                   </p>
//                 </div>
//               )}

//               {/* Mobile CTA */}
//               <button
//                 type="button"
//                 disabled={!isValid || submitting}
//                 onClick={handleSubmit}
//                 className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF3F3F] px-5 py-3.5 text-xs font-bold text-white transition hover:bg-[#e93636] disabled:cursor-not-allowed disabled:opacity-40 lg:hidden"
//               >
//                 {submitting ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Publishing…
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="h-4 w-4" />
//                     Publish Post
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </main>

//         {/* RIGHT — PREVIEW */}
//         <aside className="hidden min-h-0 border-l border-white/[0.06] bg-[#0b0b0d] lg:block">
//           <div className="flex h-full flex-col">
//             {/* Preview header */}
//             <div className="shrink-0 border-b border-white/[0.06] px-6 py-5">
//               <div className="flex items-center gap-2">
//                 <div className="h-1.5 w-1.5 rounded-full bg-[#FF3F3F]" />

//                 <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
//                   Live Preview
//                 </span>
//               </div>

//               <h2 className="mt-1.5 text-sm font-semibold text-zinc-200">
//                 Your post
//               </h2>
//             </div>

//             {/* Preview content */}
//             <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide px-6 py-6">
//               <div className="rounded-2xl border border-white/[0.06] bg-[#101014] p-4">
//                 <PostPreview
//                   category={category}
//                   description={description}
//                   address={address}
//                   budget={budget}
//                   timeline={timeline}
//                   expiryDays={expiryDays}
//                   imagePreviews={imagePreviews}
//                   user={currentUser}
//                 />
//               </div>

//               {/* Completion hint */}
//               <div className="mt-5 rounded-xl border border-white/[0.045] bg-white/[0.015] px-3.5 py-3">
//                 <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
//                   Publishing
//                 </p>

//                 <p className="mt-1 text-[10px] leading-relaxed text-zinc-600">
//                   {isValid
//                     ? "Everything looks good. Your post is ready to publish."
//                     : "Complete the required fields to publish your post."}
//                 </p>
//               </div>
//             </div>

//             {/* Desktop CTA */}
//             <div className="shrink-0 border-t border-white/[0.06] p-6">
//               <button
//                 type="button"
//                 disabled={!isValid || submitting}
//                 onClick={handleSubmit}
//                 className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF3F3F] px-5 py-3.5 text-xs font-bold text-white transition hover:bg-[#e93636] disabled:cursor-not-allowed disabled:opacity-40"
//               >
//                 {submitting ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Publishing…
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="h-4 w-4" />
//                     Publish Post
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }

// /* -------------------------------------------------
//  * Section Header
//  * ------------------------------------------------- */

// interface SectionHeaderProps {
//   step: string;
//   title: string;
//   description: string;
// }

// function SectionHeader({ step, title, description }: SectionHeaderProps) {
//   return (
//     <div>
//       <div className="flex items-baseline gap-3">
//         <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF3F3F]/20 to-[#FF3F3F]/5 font-mono text-xs font-bold text-[#FF3F3F]">
//           {step}
//         </span>
//         <h3 className="text-base font-bold text-white">{title}</h3>
//       </div>
//       <p className="mt-2 ml-10 text-xs leading-relaxed text-zinc-500">
//         {description}
//       </p>
//     </div>
//   );
// }

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import PostTypeStep from "./post/PostTypeStep";
import CategoryStep from "./post/CategoryStep";
import DetailsStep from "./post/DetailsStep";
import LocationStep from "./post/LocationStep";
import TimelineStep from "./post/TimelineStep";
import BudgetStep from "./post/BudgetStep";
import PhotosStep from "./post/PhotoStep";
import PostPreview from "./create-post/PostPreview";

// Step components — we'll build these next



const STEPS = [
  {
    id: 1,
    label: "Type",
  },
  {
    id: 2,
    label: "Category",
  },
  {
    id: 3,
    label: "Details",
  },
  {
    id: 4,
    label: "Location",
  },
  {
    id: 5,
    label: "Budget",
  },
  {
    id: 6,
    label: "Timeline",
  },
  {
    id: 7,
    label: "Photos",
  },
];

interface CreatePostProps {
  currentUser: any;
  onBack?: () => void;
  onSaveDraft?: () => void;
  onSubmit?: (data: any) => void;
}

export default function CreatePost({
  currentUser,
  onBack,
  onSaveDraft,
  onSubmit,
}: CreatePostProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  /*
   * FORM STATE
   *
   * Keep all form state in the parent.
   * Individual step components only receive value + setters.
   */
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<any>(null);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [expiryDays, setExpiryDays] = useState(7);

  const formData = useMemo(
    () => ({
      type,
      category,
      description,
      address,
      coordinates,
      budget,
      timeline,
      images,
      imagePreviews,
      expiryDays,
    }),
    [
      type,
      category,
      description,
      address,
      coordinates,
      budget,
      timeline,
      images,
      imagePreviews,
      expiryDays,
    ],
  );

  /*
   * STEP VALIDATION
   *
   * We only prevent moving forward.
   * Users can always go backwards.
   */
  const isStepValid = useMemo(() => {
    switch (currentStep) {
      case 1:
        return Boolean(type);

      case 2:
        return Boolean(category);

      case 3:
        return description.trim().length > 0;

      case 4:
        return Boolean(address);

      case 5:
        return Boolean(budget);

      case 6:
        return Boolean(timeline);

      case 7:
        return true;

      default:
        return false;
    }
  }, [currentStep, type, category, description, address, budget, timeline]);

  const isLastStep = currentStep === STEPS.length;
  const isFirstStep = currentStep === 1;

  const goNext = () => {
    if (!isStepValid || isLastStep) return;

    setCurrentStep((step) => Math.min(step + 1, STEPS.length));
  };

  const goPrevious = () => {
    if (isFirstStep) {
      onBack?.();
      return;
    }

    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const goToStep = (step: number) => {
    // Don't allow jumping ahead.
    if (step > currentStep) return;

    setCurrentStep(step);
  };

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      await onSaveDraft?.();
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = () => {
    if (!isLastStep) return;

    onSubmit?.(formData);
  };

  /*
   * Render current step
   */
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PostTypeStep value={type} onChange={setType} />;

      case 2:
        return <CategoryStep value={category} onChange={setCategory} />;

      case 3:
        return (
          <DetailsStep
            value={description}
            onChange={setDescription}
            postType={type}
          />
        );

      case 4:
        return (
          <LocationStep
            address={address}
            coordinates={coordinates}
            onAddressChange={setAddress}
            onCoordinatesChange={setCoordinates}
          />
        );

      case 5:
        return <BudgetStep value={budget} onChange={setBudget} />;

      case 6:
        return (
          <TimelineStep
            value={timeline}
            expiryDays={expiryDays}
            onChange={setTimeline}
            onExpiryChange={setExpiryDays}
          />
        );

      case 7:
        return (
          <PhotosStep
            files={images}
            previews={imagePreviews}
            onChange={setImages}
            onPreviewsChange={setImagePreviews}
            maxImages={3}
          />
        );

      default:
        return null;
    }
  };

  const activeStep = STEPS[currentStep - 1];

  return (
    <div className="h-full min-h-0 overflow-hidden bg-[#09090b]">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="h-14 shrink-0 border-b border-white/[0.06] bg-[#0c0c0f]">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          {/* Back */}
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-[11px] font-medium text-zinc-500 transition hover:text-zinc-200"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />

            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Title */}
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#FF3F3F]" />

            <span className="text-[11px] font-semibold text-zinc-300">
              Create Post
            </span>
          </div>

          {/* Save */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[10px] font-medium text-zinc-500 transition hover:border-white/[0.12] hover:text-zinc-300 disabled:opacity-40"
          >
            <Bookmark className="h-3 w-3" />

            <span className="hidden sm:inline">
              {saving ? "Saving..." : "Save Draft"}
            </span>
          </button>
        </div>
      </header>

      {/* =====================================================
          STEP PROGRESS
      ===================================================== */}
      <div className="shrink-0 border-b border-white/[0.05] bg-[#0b0b0d]">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center px-4 sm:px-6 lg:px-8">
          <div className="flex w-full items-center justify-between">
            {STEPS.map((step, index) => {
              const active = step.id === currentStep;
              const completed = step.id < currentStep;
              const clickable = step.id <= currentStep;

              return (
                <div key={step.id} className="flex min-w-0 flex-1 items-center">
                  {/* Step */}
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => goToStep(step.id)}
                    className="group flex shrink-0 items-center gap-2 disabled:cursor-default"
                  >
                    <span
                      className={`
                        flex h-7 w-7 items-center justify-center
                        rounded-full border text-[9px] font-bold
                        transition
                        ${
                          active
                            ? "border-[#FF3F3F] bg-[#FF3F3F] text-white"
                            : completed
                              ? "border-[#FF3F3F]/30 bg-[#FF3F3F]/10 text-[#FF5b5b]"
                              : "border-white/[0.12] bg-white/[0.02] text-zinc-600"
                        }
                      `}
                    >
                      {completed ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        String(step.id).padStart(2, "0")
                      )}
                    </span>

                    <span
                      className={`
                        hidden text-[9px] font-semibold
                        sm:block
                        ${
                          active
                            ? "text-zinc-200"
                            : completed
                              ? "text-zinc-500"
                              : "text-zinc-700"
                        }
                      `}
                    >
                      {step.label}
                    </span>
                  </button>

                  {/* Connector */}
                  {index < STEPS.length - 1 && (
                    <div
                      className={`
                        mx-2 h-px flex-1
                        ${completed ? "bg-[#FF3F3F]/30" : "bg-white/[0.06]"}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <div className="grid h-[calc(100%-7rem)] min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* ===================================================
            LEFT — FORM
        =================================================== */}
        <main className="min-h-0 min-w-0 overflow-y-auto scrollbar-hide">
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-5 py-7 sm:px-8 sm:py-9 lg:px-12">
            {/* Current step heading */}
            <div className="mb-8">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[9px] font-bold tracking-[0.16em] text-[#FF3F3F]">
                  {String(activeStep.id).padStart(2, "0")}
                </span>

                <span className="h-px w-5 bg-[#FF3F3F]/30" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                  {activeStep.label}
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
                Create your post
              </h1>

              <p className="mt-2 text-xs leading-relaxed text-zinc-600 sm:text-sm">
                Add the details people need to understand your post.
              </p>
            </div>

            {/* Active step */}
            <div className="min-h-0 flex-1">{renderCurrentStep()}</div>

            {/* Navigation */}
            <div className="mt-10 flex items-center justify-between border-t border-white/[0.06] pt-5">
              <button
                type="button"
                onClick={goPrevious}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 text-[10px] font-semibold text-zinc-500 transition hover:border-white/[0.12] hover:text-zinc-300"
              >
                <ChevronLeft className="h-3.5 w-3.5" />

                {isFirstStep ? "Back" : "Previous"}
              </button>

              {isLastStep ? (
                <button
                  type="button"
                  disabled={!isStepValid}
                  onClick={handleSubmit}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#FF3F3F] px-5 text-[10px] font-bold text-white transition hover:bg-[#e93636] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Publish Post
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!isStepValid}
                  onClick={goNext}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#FF3F3F] px-5 text-[10px] font-bold text-white transition hover:bg-[#e93636] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </main>

        {/* ===================================================
            RIGHT — LIVE PREVIEW
        =================================================== */}
        <aside className="hidden min-h-0 border-l border-white/[0.06] bg-[#0b0b0d] lg:block">
          <div className="flex h-full flex-col">
            {/* Preview header */}
            <div className="shrink-0 border-b border-white/[0.06] px-6 py-5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF3F3F]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                  Live Preview
                </span>
              </div>

              <h2 className="mt-1.5 text-sm font-semibold text-zinc-200">
                How your post will look
              </h2>
            </div>

            {/* Preview */}
            <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide px-6 py-6">
              <div className="rounded-2xl border border-white/[0.06] bg-[#101014] p-4">
                <PostPreview
                  category={category}
                  description={description}
                  address={address}
                  budget={budget}
                  timeline={timeline}
                  expiryDays={expiryDays}
                  imagePreviews={imagePreviews}
                  user={currentUser}
                />
              </div>

              {/* Tips */}
              <div className="mt-4 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FF3F3F]/10">
                    <Sparkles className="h-3.5 w-3.5 text-[#FF3F3F]" />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-zinc-300">
                      Tips for better responses
                    </p>

                    <ul className="mt-2 space-y-1.5 text-[9px] leading-relaxed text-zinc-600">
                      <li>• Be clear and specific</li>
                      <li>• Add a realistic budget</li>
                      <li>• Mention your expected timeline</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
