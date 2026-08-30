import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";

import CategoryStep from "./post/CategoryStep";
import DetailsStep from "./post/DetailsStep";
import ExtraDetailsStep from "./post/ExtraDetailsStep";
import LocationStep from "./post/LocationStep";
import { apiFetch } from "../lib/api";
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

const STEPS = [
  {
    id: 1,
    label: "Category",
  },
  {
    id: 2,
    label: "Details",
  },
  {
    id: 3,
    label: "Location",
  },
  {
    id: 4,
    label: "Extras",
  },
];

export default function CreatePost() {
  const [step, setStep] = useState<Step>(1);

  const [form, setForm] = useState<PostFormData>(INITIAL_FORM);

  const [publishing, setPublishing] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const handleImagesChange = (files: File[], previews: string[]) => {
    setForm((prev) => ({
      ...prev,
      images: files,
      imagePreviews: previews,
    }));
  };

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
        Boolean(form.budget) &&
        Boolean(form.timeline)
      );
    }

    return true;
  }, [step, form]);

  /* ============================================================
     NEXT
  ============================================================ */

  const goNext = () => {
    if (!canContinue) {
      setError("Please complete the required details.");
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
      !form.budget ||
      !form.timeline
    ) {
      setError("Please complete the required details.");
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
      formData.append("budget", form.budget);
      formData.append("timeline", form.timeline);
      formData.append("expiryDays", String(form.expiryDays));

      // Optional location
      if (form.address.trim()) {
        formData.append("address", form.address.trim());
      }

      // Optional coordinates
      if (form.coordinates) {
        formData.append("coordinates", JSON.stringify(form.coordinates));
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
       *
       * Supports either:
       * data.post.id
       * data.post._id
       */
      const createdPost = data?.post;

      const postId = createdPost?.id || createdPost?._id;

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

      navigate(`/post/${postId}`);
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
    2: "Tell us what you need",
    3: "Add your location",
    4: "Add anything else",
  }[step];

  const stepDescription = {
    1: "Choose a category to get started.",
    2: "Keep it simple. Choose options instead of typing whenever possible.",
    3: "Add the place where you need help, if it matters.",
    4: "Add photos or questions only if they help.",
  }[step];

  /* ============================================================
     UI
  ============================================================ */

  return (
    <div className="h-full text-zinc-100">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-4 sm:px-6">
        {/* ======================================================
            SCROLLABLE CONTENT
        ====================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
          <div className="mx-auto w-full max-w-5xl py-3  sm:py-8 ">
            {/* ==================================================
                PROGRESS
            ================================================== */}

            {/* <CreateProgress step={step} /> */}

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#FF3F3F]">
                Step {step} of 4
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {stepTitle}
              </h1>

              <p className="mt-2 max-w-xl text-[11px] leading-5 text-zinc-500 sm:text-xs">
                {stepDescription}
              </p>
            </div>

            {/* ==================================================
                STEP CONTENT
            ================================================== */}

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
                  onDescriptionChange={(value) =>
                    updateForm("description", value)
                  }
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
                  onCoordinatesChange={(value) =>
                    updateForm("coordinates", value)
                  }
                />
              )}

              {/* STEP 4 */}

              {step === 4 && (
                <ExtraDetailsStep
                  address={form.address}
                  coordinates={form.coordinates}
                  images={form.images}
                  imagePreviews={form.imagePreviews}
                  questions={form.questions}
                  expiryDays={form.expiryDays}
                  onAddressChange={(value) => updateForm("address", value)}
                  onCoordinatesChange={(value) =>
                    updateForm("coordinates", value)
                  }
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
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-500/15 bg-red-500/[0.06] px-3 py-2.5 text-[10px] text-red-300">
                <X className="h-3.5 w-3.5 shrink-0" />

                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================
            STICKY BOTTOM ACTION BAR
        ====================================================== */}

        <div className="sticky bottom-0 z-20 -mx-4  px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
            {/* BACK */}

            <button
              type="button"
              onClick={goBack}
              disabled={step === 1 || publishing}
              className="
                inline-flex
                h-10
                items-center
                gap-1.5
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.02]
                px-4
                text-[10px]
                font-semibold
                text-zinc-500
                transition
                hover:bg-white/[0.04]
                hover:text-white
                disabled:pointer-events-none
                disabled:opacity-30
              "
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>

            {/* NEXT / PUBLISH */}

            {step < 4 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue || publishing}
                className="
                  inline-flex
                  h-10
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#FF3F3F]
                  px-5
                  text-[10px]
                  font-bold
                  text-white
                  transition
                  hover:bg-[#e93636]
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                Continue
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="
                  inline-flex
                  h-10
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#FF3F3F]
                  px-5
                  text-[10px]
                  font-bold
                  text-white
                  transition
                  hover:bg-[#e93636]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {publishing ? "Publishing..." : "Publish Requirement"}

                {!publishing && <Check className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   PROGRESS
================================================================ */

function CreateProgress({ step }: { step: Step }) {
  return (
    <div className="flex items-center">
      {STEPS.map((item, index) => {
        const completed = step > item.id;

        const active = step === item.id;

        return (
          <div key={item.id} className="flex flex-1 items-center">
            {/* STEP */}

            <div className="flex shrink-0 items-center gap-2">
              <div
                className={`
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  border
                  text-[9px]
                  font-bold
                  transition

                  ${
                    completed
                      ? "border-[#FF3F3F] bg-[#FF3F3F] text-white"
                      : active
                        ? "border-[#FF3F3F] bg-[#FF3F3F]/10 text-[#FF3F3F]"
                        : "border-white/[0.09] bg-white/[0.02] text-zinc-600"
                  }
                `}
              >
                {completed ? <Check className="h-3.5 w-3.5" /> : item.id}
              </div>

              <span
                className={`
                  hidden
                  text-[9px]
                  font-semibold
                  sm:block

                  ${
                    active
                      ? "text-zinc-200"
                      : completed
                        ? "text-zinc-400"
                        : "text-zinc-600"
                  }
                `}
              >
                {item.label}
              </span>
            </div>

            {/* CONNECTOR */}

            {index < STEPS.length - 1 && (
              <div
                className={`
                  mx-2
                  h-px
                  flex-1

                  ${step > item.id ? "bg-[#FF3F3F]" : "bg-white/[0.07]"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
