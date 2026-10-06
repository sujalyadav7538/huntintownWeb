import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BowArrow,
  Check,
  LoaderCircle,
  X,
} from "lucide-react";

import { useIsDesktop } from "@/src/shared/hooks/useBreakpoint";
import { useSeo } from "@/src/shared/hooks/useSeo";

import CategoryStep from "@/src/features/posts/components/steps/CategoryStep";
import DetailsStep from "@/src/features/posts/components/steps/DetailsStep";
import ExtraDetailsStep from "@/src/features/posts/components/steps/ExtraDetailsStep";
import LocationStep from "@/src/features/posts/components/steps/LocationStep";
import { apiFetch } from "@/src/shared/lib/api";
import { useNavigate } from "react-router-dom";

type Step = 1 | 2 | 3 | 4;

interface PostFormData {
  title: string;
  description: string;
  category: string;

  address: string;
  coordinates: [number, number] | null;

  budget: string;
  timeline: string;

  images: File[];
  imagePreviews: string[];

  questions: string[];

  expiryDays: number;
}

interface CreatePostProps {
  onPostCreated?: (postId: string) => void;
}

const STEPS: { id: Step; label: string }[] = [
  { id: 1, label: "Category" },
  { id: 2, label: "Details" },
  { id: 3, label: "Location" },
  { id: 4, label: "Extras" },
];

const TOTAL_STEPS = STEPS.length;

const INITIAL_FORM: PostFormData = {
  title: "",
  description: "",
  category: "",

  address: "",
  coordinates: null,

  budget: "",
  timeline: "",

  images: [],
  imagePreviews: [],

  questions: [],

  expiryDays: 7,
};

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [step, setStep] = useState<Step>(1);

  const [form, setForm] = useState<PostFormData>(INITIAL_FORM);
  const previewsRef = useRef<string[]>([]);
  previewsRef.current = form.imagePreviews;

  const [publishing, setPublishing] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  useSeo({ title: "Post a Requirement" });

  /* ============================================================
     FORM UPDATE
  ============================================================ */

  const updateForm = <K extends keyof PostFormData>(
    key: K,
    value: PostFormData[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* ============================================================
     IMAGE UPDATE
  ============================================================ */

  const handleImagesChange = (files: File[]) => {
    setForm((prev) => {
      // Reuse existing object URLs for files that are still selected.
      const previewByFile = new Map(
        prev.images.map((file, index) => [file, prev.imagePreviews[index]]),
      );
      const nextPreviews = files.map(
        (file) => previewByFile.get(file) ?? URL.createObjectURL(file),
      );
      prev.imagePreviews
        .filter((url) => !nextPreviews.includes(url))
        .forEach((url) => URL.revokeObjectURL(url));

      return { ...prev, images: files, imagePreviews: nextPreviews };
    });
  };

  useEffect(
    () => () => {
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  /* ============================================================
     STEP VALIDATION
  ============================================================ */

  const canContinue = useMemo(() => {
    if (step === 1) {
      return Boolean(form.category);
    }

    if (step === 2) {
      return (
        form.title.trim().length > 0 &&
        form.description.trim().length > 0 &&
        form.budget.trim().length > 0 &&
        form.timeline.trim().length > 0
      );
    }

    // The API needs an address or coordinates; an address alone is geocoded server-side.
    if (step === 3) {
      return form.address.trim().length > 0 || form.coordinates !== null;
    }

    return true;
  }, [step, form]);

  /* ============================================================
     NEXT
  ============================================================ */

  const goNext = () => {
    if (!canContinue) {
      setError(
        step === 3
          ? "Add an area/address or use your current location."
          : "Please complete the required details.",
      );
      return;
    }

    setError("");

    setStep((prev) => Math.min(4, prev + 1) as Step);
  };

  /* ============================================================
     BACK
  ============================================================ */

  const goBack = () => {
    if (publishing) return;

    setError("");

    setStep((prev) => Math.max(1, prev - 1) as Step);
  };

  /* ============================================================
     PUBLISH
  ============================================================ */

  const handlePublish = async () => {
    if (
      !form.category ||
      !form.title.trim() ||
      !form.description.trim() ||
      !form.budget.trim() ||
      !form.timeline.trim()
    ) {
      setError("Please complete the required details.");
      return;
    }

    if (!form.address.trim() && !form.coordinates) {
      setError("Please add a location for your requirement.");
      setStep(3);
      return;
    }

    setPublishing(true);
    setError("");

    try {
      const formData = new FormData();

      // Required fields
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("category", form.category);
      formData.append("budget", form.budget.trim());
      formData.append("timeline", form.timeline.trim());
      formData.append("expiryDays", String(form.expiryDays));

      if (form.address.trim()) {
        formData.append("address", form.address.trim());
      }

      // The API reads GeoJSON from `location`; without it the address is geocoded.
      if (form.coordinates) {
        formData.append(
          "location",
          JSON.stringify({ type: "Point", coordinates: form.coordinates }),
        );
      }

      // Optional questions
      if (form.questions.length > 0) {
        const validQuestions = form.questions
          .map((question) => question.trim())
          .filter(Boolean);

        if (validQuestions.length > 0) {
          formData.append("questions", JSON.stringify(validQuestions));
        }
      }

      // Optional images
      form.images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await apiFetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (res.status === 401) {
        throw new Error("Your session has expired. Please login again.");
      }

      if (res.status === 403) {
        throw new Error("You are not authorised to create a post.");
      }

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.message || `Unable to publish requirement (${res.status})`,
        );
      }

      if (!data?.success) {
        throw new Error(data?.message || "Unable to publish requirement.");
      }

      /*
       * Get the newly created post ID.
       */
      const createdPost = data?.post;

      const postId = createdPost?.id ?? createdPost?._id;

      if (!postId) {
        throw new Error(
          "Requirement was published, but the created post could not be opened.",
        );
      }

      /*
       * Do NOT reset the form here.
       *
       * We are navigating away from CreatePost,
       * so resetting it is unnecessary.
       */

      if (onPostCreated) {
        onPostCreated(postId);
      } else {
        navigate(`/post/${postId}`);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to publish your requirement. Please try again.",
      );
    } finally {
      setPublishing(false);
    }
  };

  /* ============================================================
     HEADER CONTENT
  ============================================================ */

  const stepTitle = {
    1: "What do you need help with?",
    2: "Describe your requirement",
    3: "Where do you need it?",
    4: "Final touches",
  }[step];

  const stepDescription = {
    1: "Pick the category that fits best — it helps the right people find you.",
    2: "A clear title, short description, budget and timeline get faster offers.",
    3: "Share your location or type an area so nearby helpers can see it.",
    4: "Add photos or questions if they help, then review and publish.",
  }[step];

  /* ============================================================
     UI
  ============================================================ */

  const stepContent = (
    <>
      <div className="mt-7">
        {/* STEP 1 */}

        {step === 1 && (
          <CategoryStep
            value={form.category}
            onChange={(value) => updateForm("category", value)}
          />
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <DetailsStep
            title={form.title}
            description={form.description}
            budget={form.budget}
            timeline={form.timeline}
            category={form.category}
            onTitleChange={(value) => updateForm("title", value)}
            onDescriptionChange={(value) => updateForm("description", value)}
            onBudgetChange={(value) => updateForm("budget", value)}
            onTimelineChange={(value) => updateForm("timeline", value)}
          />
        )}

        {/* STEP 3 */}

        {step === 3 && (
          <LocationStep
            address={form.address}
            coordinates={form.coordinates}
            onAddressChange={(value) => updateForm("address", value)}
            onCoordinatesChange={(value) => updateForm("coordinates", value)}
          />
        )}

        {/* STEP 4 */}

        {step === 4 && (
          <ExtraDetailsStep
            images={form.images}
            imagePreviews={form.imagePreviews}
            questions={form.questions}
            expiryDays={form.expiryDays}
            summary={{
              category: form.category,
              title: form.title.trim(),
              budget: form.budget.trim(),
              timeline: form.timeline.trim(),
              address: form.address.trim(),
              hasCoordinates: form.coordinates !== null,
            }}
            onImagesChange={handleImagesChange}
            onQuestionsChange={(questions) =>
              updateForm("questions", questions)
            }
            onExpiryChange={(value) => updateForm("expiryDays", value)}
          />
        )}
      </div>

      {/* ==================================================
                ERROR
            ================================================== */}

      {error && (
        <div
          role="alert"
          className="mt-5 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-xs text-red-500"
        >
          <X className="h-4 w-4 shrink-0" />

          <span>{error}</span>
        </div>
      )}
    </>
  );

  const actions = (
    <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
      <button
        type="button"
        onClick={goBack}
        disabled={step === 1 || publishing}
        className="theme-chip theme-divider inline-flex h-10 items-center gap-1.5 rounded-lg border px-3.5 text-[11px] font-semibold transition disabled:pointer-events-none disabled:opacity-40"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>

      {step < 4 ? (
        <button
          type="button"
          onClick={goNext}
          disabled={publishing}
          className={`theme-btn-accent inline-flex h-10 items-center gap-1.5 rounded-lg border px-4 text-[11px] font-bold transition ${canContinue ? "" : "opacity-50"}`}
        >
          Continue
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handlePublish}
          disabled={publishing}
          className="theme-btn-accent inline-flex h-10 items-center gap-1.5 rounded-lg border px-4 text-[11px] font-bold transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {publishing ? (
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <BowArrow className="h-3.5 w-3.5" />
          )}
          {publishing ? "Hunting..." : "Hunt"}
        </button>
      )}
    </div>
  );

  const viewProps: CreatePostViewProps = {
    step,
    stepTitle,
    stepDescription,
    stepContent,
    actions,
  };

  return isDesktop ? (
    <CreatePostDesktop {...viewProps} />
  ) : (
    <CreatePostMobile {...viewProps} />
  );
}

interface CreatePostViewProps {
  step: Step;
  stepTitle: string;
  stepDescription: string;
  stepContent: ReactNode;
  actions: ReactNode;
}

/* ================================================================
   DESKTOP — centred column with a visible step rail
================================================================ */

function CreatePostDesktop({
  step,
  stepTitle,
  stepDescription,
  stepContent,
  actions,
}: CreatePostViewProps) {
  return (
    <div className="theme-page-shell h-full">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-6">
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
          <div className="mx-auto w-full max-w-5xl py-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF3F3F]">
              Post a requirement
            </p>

            <div className="mt-4">
              <StepRail step={step} />
            </div>

            <div className="mt-8">
              <h1 className="theme-text-primary font-display text-2xl font-bold tracking-tight">
                {stepTitle}
              </h1>

              <p className="theme-text-muted mt-1.5 max-w-xl text-sm leading-6">
                {stepDescription}
              </p>
            </div>

            {stepContent}
          </div>
        </div>

        <div className="theme-divider sticky bottom-0 z-20  border-t px-6 pb-2 pt-3 backdrop-blur-md">
          {actions}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MOBILE — full width, compact counter, action bar above the nav
================================================================ */

function CreatePostMobile({
  step,
  stepTitle,
  stepDescription,
  stepContent,
  actions,
}: CreatePostViewProps) {
  return (
    <div className="theme-page-shell h-full">
      <div className="mx-auto flex h-full w-full flex-col px-4">
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
          <div className="w-full py-3">
            <div className="flex flex-row items-center justify-between">
              {/* <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF3F3F]">
                Step {step} of {TOTAL_STEPS}
              </p> */}

              <h1 className="theme-text-primary mt-2 font-display text-xl font-bold tracking-tight">
                {stepTitle}
              </h1>
            </div>

            <p className="theme-text-muted mt-1.5 text-xs leading-5">
              {stepDescription}
            </p>

            <StepDots step={step} />

            {stepContent}
          </div>
        </div>

        <div className="theme-divider sticky bottom-0 z-20 -mx-4 border-t pt-1  backdrop-blur-md">
          {actions}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SHARED PIECES
================================================================ */

function StepRail({ step }: { step: Step }) {
  return (
    <div className="flex items-center">
      {STEPS.map((item, index) => {
        const completed = step > item.id;
        const active = step === item.id;

        return (
          <div key={item.id} className="flex flex-1 items-center">
            <div className="flex shrink-0 items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition ${
                  completed
                    ? "border-[#FF3F3F] bg-[#FF3F3F] text-white"
                    : active
                      ? "border-[#FF3F3F] bg-[#FF3F3F]/10 text-[#FF3F3F]"
                      : "theme-divider theme-chip"
                }`}
              >
                {completed ? <Check className="h-4 w-4" /> : item.id}
              </div>

              <span
                className={`text-xs font-semibold ${
                  active ? "theme-text-primary" : "theme-text-muted"
                }`}
              >
                {item.label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div
                className={`mx-3 h-px flex-1 ${
                  completed ? "bg-[#FF3F3F]" : "theme-divider border-t"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepDots({ step }: { step: Step }) {
  return (
    <div className="mt-4 flex items-center gap-1.5">
      {STEPS.map((item) => (
        <span
          key={item.id}
          className={`h-1 flex-1 rounded-full transition ${
            step >= item.id ? "bg-[#FF3F3F]" : "theme-chip"
          }`}
        />
      ))}
    </div>
  );
}
