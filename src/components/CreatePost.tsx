import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { apiFetch } from "../lib/api";
import { useAppSelector } from "../store/hooks";
import PostTypeStep from "./post/PostTypeStep";
import CategoryStep from "./post/CategoryStep";
import DetailsStep from "./post/DetailsStep";
import LocationStep from "./post/LocationStep";
import TimelineStep from "./post/TimelineStep";
import BudgetStep from "./post/BudgetStep";
import PhotosStep from "./post/PhotoStep";
import PostPreview from "./create-post/PostPreview";

type PostType = "need" | "offer";

type Coordinates = {
  lat: number;
  lng: number;
};

interface CreatePostPayload {
  type: PostType;
  title: string;
  description: string;
  category: string;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  budget: string;
  timeline: string;
  expiryDays: number;
  images: File[];
}

interface CreatePostProps {
  onBack?: () => void;
  onPostCreated?: (postId: string) => void;
  onSaveDraft?: () => void;
  onSubmit?: (data: CreatePostPayload) => void;
}

const STEPS = [
  { id: 1, label: "Type" },
  { id: 2, label: "Category" },
  { id: 3, label: "Details" },
  { id: 4, label: "Location" },
  { id: 5, label: "Budget" },
  { id: 6, label: "Timeline" },
  { id: 7, label: "Photos" },
] as const;

const DEFAULT_EXPIRY_DAYS = 7;

export default function CreatePost({
  onBack,
  onPostCreated,
  onSaveDraft,
  onSubmit,
}: CreatePostProps) {
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  const [type, setType] = useState<PostType>("need");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [budget, setBudget] = useState("Negotiable");
  const [timeline, setTimeline] = useState("Flexible");
  const [images, setImages] = useState<File[]>([]);
  const [expiryDays] = useState(DEFAULT_EXPIRY_DAYS);

  const imagePreviews = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images],
  );

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const isStepValid = useMemo(() => {
    switch (currentStep) {
      case 1:
        return Boolean(type);
      case 2:
        return Boolean(category);
      case 3:
        return title.trim().length > 0 && description.trim().length > 0;
      case 4:
        return Boolean(address.trim()) && Boolean(coordinates);
      case 5:
        return Boolean(budget.trim());
      case 6:
        return Boolean(timeline.trim());
      case 7:
        return true;
      default:
        return false;
    }
  }, [currentStep, type, category, title, description, address, coordinates, budget, timeline]);

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

  const payload = useMemo<CreatePostPayload | null>(() => {
    if (!coordinates) return null;

    return {
      type,
      title: title.trim(),
      description: description.trim(),
      category,
      address: address.trim(),
      location: {
        type: "Point",
        coordinates: [coordinates.lng, coordinates.lat],
      },
      budget,
      timeline,
      expiryDays,
      images,
    };
  }, [type, title, description, category, address, coordinates, budget, timeline, expiryDays, images]);

  const handleSubmit = async () => {
    if (!isLastStep || !payload || publishing) return;

    setError("");
    setPublishing(true);

    try {
      onSubmit?.(payload);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + payload.expiryDays);

      const formData = new FormData();
      formData.append("type", payload.type === "need" ? "help_needed" : "help_offered");
      formData.append("title", payload.title);
      formData.append("description", payload.description);
      formData.append("category", payload.category);
      formData.append("address", payload.address);
      formData.append("location", JSON.stringify(payload.location));
      formData.append("budget", payload.budget || "Negotiable");
      formData.append("timeline", payload.timeline || "Flexible");
      formData.append("expiryDays", String(payload.expiryDays));
      formData.append("expiresAt", expiresAt.toISOString());

      payload.images.forEach((file) => {
        formData.append("images", file);
      });

      const response = await apiFetch("/api/posts", {
        method: "POST",
        headers: {},
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      const postId = data.post?._id || data.post?.id || data.id;
      if (postId && onPostCreated) {
        onPostCreated(postId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish post");
    } finally {
      setPublishing(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PostTypeStep value={type} onChange={setType} />;
      case 2:
        return <CategoryStep value={category} onChange={setCategory} />;
      case 3:
        return (
          <DetailsStep
            title={title}
            description={description}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
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
        return <TimelineStep value={timeline} onChange={setTimeline} />;
      case 7:
        return (
          <PhotosStep
            files={images}
            previews={imagePreviews}
            onChange={setImages}
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
      <header className="h-14 shrink-0 border-b border-white/6 bg-[#0c0c0f]">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-[11px] font-medium text-zinc-500 transition hover:text-zinc-200"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#FF3F3F]" />
            <span className="text-[11px] font-semibold text-zinc-300">Create Post</span>
          </div>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/7 bg-white/2.5 px-2.5 py-1.5 text-[10px] font-medium text-zinc-500 transition hover:border-white/12 hover:text-zinc-300 disabled:opacity-40"
          >
            <Bookmark className="h-3 w-3" />
            <span className="hidden sm:inline">{saving ? "Saving..." : "Save Draft"}</span>
          </button>
        </div>
      </header>

      <div className="shrink-0 border-b border-white/5 bg-[#0b0b0d]">
        <div className="mx-auto flex h-16 max-w-300 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex w-full items-center justify-between">
            {STEPS.map((step, index) => {
              const active = step.id === currentStep;
              const completed = step.id < currentStep;
              const clickable = step.id <= currentStep;

              return (
                <div key={step.id} className="flex min-w-0 flex-1 items-center">
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => goToStep(step.id)}
                    className="group flex shrink-0 items-center gap-2 disabled:cursor-default"
                  >
                    <span
                      className={
                        `flex h-7 w-7 items-center justify-center rounded-full border text-[9px] font-bold transition ` +
                        (active
                          ? "border-[#FF3F3F] bg-[#FF3F3F] text-white"
                          : completed
                            ? "border-[#FF3F3F]/30 bg-[#FF3F3F]/10 text-[#FF5b5b]"
                            : "border-white/12 bg-white/2 text-zinc-600")
                      }
                    >
                      {completed ? <Check className="h-3 w-3" /> : String(step.id).padStart(2, "0")}
                    </span>

                    <span
                      className={
                        `hidden text-[9px] font-semibold sm:block ` +
                        (active ? "text-zinc-200" : completed ? "text-zinc-500" : "text-zinc-700")
                      }
                    >
                      {step.label}
                    </span>
                  </button>

                  {index < STEPS.length - 1 && (
                    <div className={`mx-2 h-px flex-1 ${completed ? "bg-[#FF3F3F]/30" : "bg-white/6"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid h-[calc(100%-7rem)] min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px]">
        <main className="min-h-0 min-w-0 overflow-y-auto scrollbar-hide">
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-5 py-7 sm:px-8 sm:py-9 lg:px-12">
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

              <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">Create your post</h1>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 sm:text-sm">
                Add the details people need to understand your post.
              </p>
            </div>

            <div className="min-h-0 flex-1">{renderCurrentStep()}</div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/7 px-4 py-3">
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between border-t border-white/6 pt-5">
              <button
                type="button"
                onClick={goPrevious}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/7 bg-white/2 px-4 text-[10px] font-semibold text-zinc-500 transition hover:border-white/12 hover:text-zinc-300"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                {isFirstStep ? "Back" : "Previous"}
              </button>

              {isLastStep ? (
                <button
                  type="button"
                  disabled={!isStepValid || publishing}
                  onClick={handleSubmit}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#FF3F3F] px-5 text-[10px] font-bold text-white transition hover:bg-[#e93636] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {publishing ? "Publishing..." : "Publish Post"}
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

        <aside className="hidden min-h-0 border-l border-white/6 bg-[#0b0b0d] lg:block">
          <div className="flex h-full flex-col">
            <div className="shrink-0 border-b border-white/6 px-6 py-5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF3F3F]" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">Live Preview</span>
              </div>
              <h2 className="mt-1.5 text-sm font-semibold text-zinc-200">How your post will look</h2>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide px-6 py-6">
              <div className="rounded-2xl border border-white/6 bg-[#101014] p-4">
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

              <div className="mt-4 rounded-2xl border border-white/5 bg-white/1.5 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FF3F3F]/10">
                    <Sparkles className="h-3.5 w-3.5 text-[#FF3F3F]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-300">Tips for better responses</p>
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
