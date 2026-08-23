import { useEffect, useState } from "react";
import { ArrowLeft, HelpCircle, Loader2, Send, X } from "lucide-react";
import { Post } from "@/src/types";

interface ApplyRequirementModalProps {
  isOpen: boolean;
  post: Post;
  onClose: () => void;

  onSubmit?: (data: {
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

  const questions = post.questions ?? [];

  useEffect(() => {
    if (!isOpen) {
      setMessage("");
      setAnswers({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
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

    if (!message.trim() || hasEmptyAnswer || isSubmitting) return;

    try {
      setIsSubmitting(true);

      await onSubmit?.({
        postId: post._id,
        message: message.trim(),
        answers: formattedAnswers,
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div
      className="
      fixed inset-0 z-9999
      bg-black/75
      backdrop-blur-sm
    "
    >
      {/* =====================================================
        DESKTOP
    ===================================================== */}
      <div className="hidden min-h-full items-center justify-center p-4 sm:flex">
        <div
          className="
          flex
          max-h-[78vh]
          w-full
          max-w-md
          flex-col
          overflow-hidden
          rounded-2xl
          border border-[#29292f]
          bg-[#111113]
          shadow-[0_25px_80px_rgba(0,0,0,0.65)]
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
      <div className="flex h-full w-full flex-col bg-[#0c0c0e] sm:hidden">
        {/* Top bar */}
        <div
          className="
          flex shrink-0 items-center gap-3
          border-b border-[#202025]
          px-4 py-3
        "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
            inline-flex items-center gap-1.5
            text-[11px] font-medium
            text-zinc-400
            transition
            hover:text-zinc-100
            disabled:opacity-40
          "
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="h-3.5 w-px bg-[#29292f]" />

          <span className="truncate text-[11px] font-medium text-zinc-300">
            Apply for requirement
          </span>
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
