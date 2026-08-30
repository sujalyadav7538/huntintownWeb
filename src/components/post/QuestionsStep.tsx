import { Check, HelpCircle, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";

interface QuestionsStepProps {
  category: string;
  questions: string[];
  onChange: (questions: string[]) => void;
}

const CATEGORY_QUESTIONS: Record<string, string[]> = {
  jobs: [
    "What experience do you have?",
    "When can you start?",
    "How much do you charge?",
    "Can you share previous work?",
  ],

  services: [
    "What is your experience?",
    "What is your availability?",
    "What is your expected price?",
    "Can you share previous work?",
  ],

  education: [
    "What is your experience level?",
    "What topics do you need help with?",
    "When do you need help?",
    "What is your preferred timing?",
  ],

  products: [
    "Is the item still available?",
    "What is the final price?",
    "Can you share more photos?",
    "Where can I collect it?",
  ],

  housing: [
    "When is it available?",
    "What is included?",
    "Are there any additional charges?",
    "Can I visit the place?",
  ],

  events: [
    "What is your availability?",
    "How many people can you accommodate?",
    "What is your price?",
    "Can you share previous work?",
  ],

  default: [
    "When are you available?",
    "What is your experience?",
    "What is your expected price?",
    "Can you share more details?",
  ],
};

export default function QuestionsStep({
  category,
  questions,
  onChange,
}: QuestionsStepProps) {
  const [customQuestion, setCustomQuestion] = useState("");

  const suggestions = useMemo(() => {
    const normalized = category?.toLowerCase() ?? "";

    const matchedKey = Object.keys(CATEGORY_QUESTIONS).find(
      (key) =>
        key !== "default" &&
        (normalized.includes(key) || key.includes(normalized)),
    );

    return CATEGORY_QUESTIONS[matchedKey ?? "default"];
  }, [category]);

  const toggleQuestion = (question: string) => {
    if (questions.includes(question)) {
      onChange(questions.filter((item) => item !== question));
      return;
    }

    onChange([...questions, question]);
  };

  const addCustomQuestion = () => {
    const value = customQuestion.trim();

    if (!value) return;
    if (questions.includes(value)) return;

    onChange([...questions, value]);
    setCustomQuestion("");
  };

  const removeQuestion = (question: string) => {
    onChange(questions.filter((item) => item !== question));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10">
            <HelpCircle className="h-4 w-4 text-amber-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                Ask responders
              </p>

              <span className="rounded-full bg-white/[0.04] px-1.5 py-0.5 text-[8px] text-zinc-600">
                Optional
              </span>
            </div>

            <p className="mt-0.5 text-[10px] text-zinc-700">
              Ask something before accepting a response.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested questions */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Suggested questions
            </p>

            <p className="mt-1 text-[9px] text-zinc-700">
              Tap to add
            </p>
          </div>

          {questions.length > 0 && (
            <span className="text-[9px] text-zinc-600">
              {questions.length} selected
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestions.map((question) => {
            const selected = questions.includes(question);

            return (
              <button
                key={question}
                type="button"
                onClick={() => toggleQuestion(question)}
                className={`
                  flex items-center gap-2 rounded-xl border px-3 py-2.5
                  text-left text-[10px]
                  transition-all
                  ${
                    selected
                      ? "border-[#FF3F3F]/30 bg-[#FF3F3F]/10 text-zinc-200"
                      : "border-white/[0.07] bg-[#111317] text-zinc-500 hover:border-white/[0.14] hover:text-zinc-300"
                  }
                `}
              >
                <span
                  className={`
                    flex h-4 w-4 shrink-0 items-center justify-center rounded-full border
                    ${
                      selected
                        ? "border-[#FF3F3F] bg-[#FF3F3F]"
                        : "border-zinc-700"
                    }
                  `}
                >
                  {selected && (
                    <Check className="h-2.5 w-2.5 text-white" />
                  )}
                </span>

                {question}
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected questions */}
      {questions.length > 0 && (
        <section>
          <div className="mb-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Your questions
            </p>
          </div>

          <div className="space-y-2">
            {questions.map((question, index) => (
              <div
                key={`${question}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#111317] px-3 py-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-[9px] font-bold text-zinc-600">
                  {index + 1}
                </span>

                <p className="min-w-0 flex-1 text-[10px] leading-4 text-zinc-300">
                  {question}
                </p>

                <button
                  type="button"
                  onClick={() => removeQuestion(question)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-red-400/10 hover:text-red-400"
                  aria-label="Remove question"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom question */}
      <section>
        <div className="mb-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Something else?
          </p>
        </div>

        <div className="flex gap-2">
          <input
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomQuestion();
              }
            }}
            placeholder="Add your own question..."
            maxLength={150}
            className="
              h-10 min-w-0 flex-1 rounded-xl
              border border-white/[0.07]
              bg-[#111317]
              px-3
              text-[10px] text-zinc-200
              outline-none
              placeholder:text-zinc-700
              focus:border-[#FF3F3F]/40
            "
          />

          <button
            type="button"
            onClick={addCustomQuestion}
            disabled={!customQuestion.trim()}
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              border border-white/[0.07]
              bg-[#111317]
              text-zinc-600
              transition
              hover:border-[#FF3F3F]/30
              hover:bg-[#FF3F3F]/10
              hover:text-[#FF3F3F]
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
            aria-label="Add question"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2 text-[8px] text-zinc-700">
          Keep questions short and relevant.
        </p>
      </section>

      {/* Empty / skip state */}
      {questions.length === 0 && (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-white/[0.06] px-4 py-3">
          <p className="text-[9px] text-zinc-700">
            No questions? That's fine — you can skip this step.
          </p>
        </div>
      )}
    </div>
  );
}