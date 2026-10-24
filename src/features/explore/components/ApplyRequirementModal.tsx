import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAppDialog } from "@/src/shared/components/layout/AppDialogProvider";
import { HelpCircle, Loader2, Send, X } from "lucide-react";
import { Post } from "@/src/shared/types";

interface ApplyRequirementModalProps {
  isOpen: boolean;
  post: Post;
  onClose: () => void;

  onSubmit: (data: {
    postId: string;
    message: string;
    answers: {
      question: string;
      answer: string;
    }[];
  }) => Promise<void> | void;
}

export default function ApplyRequirementModal({
  isOpen,
  post,
  onClose,
  onSubmit,
}: ApplyRequirementModalProps) {
  const [message, setMessage] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submissionLocked = useRef(false);
  const submitted = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { showConfirm } = useAppDialog();

  const questions = post.questions ?? [];

  useEffect(() => {
    if (!isOpen) {
      setMessage("");
      setAnswers({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isSubmitting) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const background = Array.from(document.body.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement && !element.contains(modalRef.current),
    );
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => { element.inert = true; });
    modalRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
      if (event.key === "Tab") {
        const controls = Array.from(modalRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
        ) ?? []).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === modalRef.current)) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === modalRef.current)) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      previouslyFocused?.focus();
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleAnswerChange = (question: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
  };

  const hasUnansweredQuestion = questions.some(
    (question) => !answers[question]?.trim(),
  );

  const canSubmit =
    message.trim().length > 0 && !hasUnansweredQuestion && !isSubmitting;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Hard guard validation before submitting.
    const formattedAnswers = questions.map((question) => ({
      question,
      answer: (answers[question] ?? "").trim(),
    }));
    const hasEmptyAnswer = formattedAnswers.some((item) => !item.answer);

    if (!message.trim() || hasEmptyAnswer || submissionLocked.current || submitted.current) return;

    submissionLocked.current = true;
    setIsSubmitting(true);
    try {
      setError("");
      const confirmed = await showConfirm(
        "Submit your application? You can apply only once for this requirement and cannot apply again after submitting.",
        {
          title: "Confirm application",
          confirmLabel: "Submit application",
        },
      );
      if (!confirmed) return;

      await onSubmit({
        postId: post.id ?? post._id,
        message: message.trim(),
        answers: formattedAnswers,
      });

      submitted.current = true;
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not submit your offer. Please try again.");
    } finally {
      submissionLocked.current = false;
      setIsSubmitting(false);
    }
  };
  return createPortal(
    <div
      className="theme-modal-backdrop fixed inset-0 z-[80] flex items-end justify-center bg-black/60 sm:items-center sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="Apply for requirement"
      tabIndex={-1}
      className="relative max-h-[90dvh] w-full overflow-y-auto rounded-t-2xl pb-[env(safe-area-inset-bottom)] outline-none theme-page-shell sm:max-w-2xl sm:rounded-lg sm:pb-0"
    >
      {error && <p role="alert" className="px-5 py-3 text-sm text-red-400">{error}</p>}
      {/* =====================================================
        DESKTOP
    ===================================================== */}
      <div className="hidden max-h-[90dvh] items-start justify-center sm:flex">
        <div
          className="
          flex
          max-h-[90dvh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-lg
          border border-[#29292f]
          bg-[#111113]
        "
        >
          {/* Header */}
          <div
            className="
            flex shrink-0 items-start justify-between
            border-b border-[#202025]
            px-5 py-3.5
          "
          >
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#FF3F3F]">
                Apply for requirement
              </p>

              <h2 className="mt-1 truncate text-sm font-semibold text-zinc-100">
                {post.title}
              </h2>
            </div>

            <button
              type="button"
              aria-label="Close application"
              onClick={onClose}
              disabled={isSubmitting}
              className="
              ml-3 shrink-0 rounded-full p-1.5
              text-zinc-500 transition
              hover:bg-white/5
              hover:text-zinc-200
              disabled:opacity-40
            "
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ApplyFormContent
            questions={questions}
            answers={answers}
            message={message}
            isSubmitting={isSubmitting}
            onAnswerChange={handleAnswerChange}
            onMessageChange={setMessage}
            onSubmit={handleSubmit}
            canSubmit={canSubmit}
            onCancel={onClose}
          />
        </div>
      </div>

      {/* =====================================================
        MOBILE
    ===================================================== */}
      <div className="flex h-[min(42rem,85dvh)] w-full flex-col bg-[#0c0c0e] sm:hidden">
        {/* Top bar */}
        <div
          className="
          flex shrink-0 items-center justify-between gap-3
          border-b border-[#202025]
          px-4 py-3
        "
        >
          <span className="min-w-0 truncate text-[11px] font-medium text-zinc-300">
            Apply for requirement
          </span>
          <button
            type="button"
            aria-label="Close application"
            title="Close application"
            onClick={onClose}
            disabled={isSubmitting}
            className="
            inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md
            text-zinc-400
            transition
            hover:bg-white/5
            hover:text-zinc-100
            disabled:opacity-40
          "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile title */}
        <div className="shrink-0 px-5 pt-4">
          <h1 className="text-base font-semibold leading-snug text-zinc-100">
            {post.title}
          </h1>

          <p className="mt-1 text-[10px] leading-relaxed text-zinc-600">
            Answer the questions below and tell the requester how you can help.
          </p>
        </div>

        <ApplyFormContent
          questions={questions}
          answers={answers}
          message={message}
          isSubmitting={isSubmitting}
          onAnswerChange={handleAnswerChange}
          onMessageChange={setMessage}
          onSubmit={handleSubmit}
          canSubmit={canSubmit}
          onCancel={onClose}
          mobile
        />
      </div>
    </div>
    </div>,
    document.body,
  );
}

/* =========================================================
   FORM CONTENT
========================================================= */

interface ApplyFormContentProps {
  questions: string[];
  answers: Record<string, string>;
  message: string;
  isSubmitting: boolean;
  canSubmit: boolean;
  mobile?: boolean;

  onAnswerChange: (question: string, answer: string) => void;

  onMessageChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
}

function ApplyFormContent({
  questions,
  answers,
  message,
  isSubmitting,
  canSubmit,
  mobile = false,
  onAnswerChange,
  onMessageChange,
  onSubmit,
  onCancel,
}: ApplyFormContentProps) {
  return (
    <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      {/* Scrollable content */}
      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          scrollbar-hide
          px-5
          py-4
        "
      >
        <div className="space-y-4">
          {/* Questions */}
          {questions.length > 0 && (
            <section>
              <div className="mb-2.5">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-3.5 w-3.5 text-[#FF3F3F]" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                    Questions from requester
                  </p>
                </div>

                <p className="mt-1 text-[9px] text-zinc-700">
                  Answer all questions before submitting.
                </p>
              </div>

              <div className="space-y-2.5">
                {questions.map((question, index) => {
                  const answer = answers[question] ?? "";

                  return (
                    <div
                      key={`${question}-${index}`}
                      className="
                        rounded-lg
                        border border-[#222228]
                        bg-[#101012]
                        px-3
                        py-2.5
                      "
                    >
                      <p className="text-[10px] font-medium leading-relaxed text-zinc-300">
                        <span className="mr-1.5 text-[#FF3F3F]">
                          {index + 1}.
                        </span>

                        {question}
                      </p>

                      <textarea
                        value={answer}
                        onChange={(event) =>
                          onAnswerChange(question, event.target.value)
                        }
                        placeholder="Write your answer..."
                        rows={2}
                        maxLength={500}
                        disabled={isSubmitting}
                        className="
                          mt-2
                          min-h-14
                          w-full
                          resize-none
                          rounded-md
                          border border-[#25252b]
                          bg-[#0c0c0e]
                          px-2.5
                          py-2
                          text-[10px]
                          leading-relaxed
                          text-zinc-200
                          outline-none
                          placeholder:text-zinc-700
                          transition
                          focus:border-[#FF3F3F]/40
                          disabled:opacity-50
                        "
                      />

                      <div className="mt-0.5 text-right text-[8px] text-zinc-700">
                        {answer.length}/500
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Message */}
          <section>
            <label
              htmlFor="application-message"
              className="
                mb-1.5
                block
                text-[9px]
                font-bold
                uppercase
                tracking-[0.14em]
                text-zinc-500
              "
            >
              Message
            </label>

            <p className="mb-2 text-[9px] text-zinc-700">
              Briefly introduce yourself and explain how you can help.
            </p>

            <textarea
              id="application-message"
              value={message}
              onChange={(event) => onMessageChange(event.target.value)}
              placeholder="I can help with this requirement because..."
              rows={3}
              maxLength={1000}
              disabled={isSubmitting}
              className="
                min-h-20
                w-full
                resize-none
                rounded-lg
                border border-[#25252b]
                bg-[#101012]
                px-3
                py-2.5
                text-[11px]
                leading-relaxed
                text-zinc-200
                outline-none
                placeholder:text-zinc-700
                transition
                focus:border-[#FF3F3F]/40
                disabled:opacity-50
              "
            />

            <div className="mt-0.5 text-right text-[8px] text-zinc-700">
              {message.length}/1000
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div
        className="
          flex shrink-0
          items-center justify-end
          gap-2
          border-t border-[#202025]
          bg-[#0d0d0f]
          px-5 py-3
        "
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="
            rounded-full
            px-4 py-2
            text-[10px]
            font-semibold
            text-zinc-500
            transition
            hover:bg-white/4
            hover:text-zinc-300
            disabled:opacity-40
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!canSubmit}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-full
            bg-[#FF3F3F]
            px-5
            py-2.5
            text-[10px]
            font-bold
            text-white
            transition
            hover:bg-[#e93636]
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              Send Application
            </>
          )}
        </button>
      </div>
    </form>
  );
}
