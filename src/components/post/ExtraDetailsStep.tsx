import { ImagePlus, HelpCircle, X } from "lucide-react";

interface ExtraDetailsStepProps {
  images: File[];
  questions: string[];
  onImagesChange: (images: File[]) => void;
  onQuestionsChange: (questions: string[]) => void;
}

export default function ExtraDetailsStep({
  images,
  questions,
  onImagesChange,
  onQuestionsChange,
}: ExtraDetailsStepProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    // Keep it optional, but limit to 5 images.
    const nextImages = [...images, ...files].slice(0, 5);

    onImagesChange(nextImages);

    // Allow selecting the same file again.
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const addQuestion = () => {
    if (questions.length >= 3) return;
    onQuestionsChange([...questions, ""]);
  };

  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions];
    updated[index] = value;
    onQuestionsChange(updated);
  };

  const removeQuestion = (index: number) => {
    onQuestionsChange(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-5">
      {/* Images */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Add photos
              <span className="ml-1 text-[10px] font-normal text-zinc-600">
                Optional
              </span>
            </h3>

            <p className="mt-0.5 text-[10px] text-zinc-500">
              Photos help people understand what you need.
            </p>
          </div>

          <span className="text-[10px] text-zinc-600">{images.length}/5</span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {images.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-[#2a2a2e] bg-[#0e0e10]"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Upload ${index + 1}`}
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-zinc-300 opacity-100 backdrop-blur-sm transition hover:bg-red-500 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {images.length < 5 && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#2a2a2e] bg-[#111113] text-zinc-600 transition hover:border-[#FF3F3F]/50 hover:bg-[#151517] hover:text-zinc-400">
              <ImagePlus className="h-5 w-5" />

              <span className="mt-1 text-[9px] font-medium">Add photo</span>

              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
      </section>

      {/* Questions */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-white">Questions</h3>

              <span className="rounded-full bg-[#1e1e22] px-1.5 py-0.5 text-[8px] font-medium text-zinc-500">
                Optional
              </span>
            </div>

            <p className="mt-0.5 text-[10px] text-zinc-500">
              Ask something people should answer before responding.
            </p>
          </div>

          {questions.length < 3 && (
            <button
              type="button"
              onClick={addQuestion}
              className="text-[10px] font-semibold text-[#FF3F3F] transition hover:text-[#ff6666]"
            >
              + Add
            </button>
          )}
        </div>

        {questions.length === 0 ? (
          <button
            type="button"
            onClick={addQuestion}
            className="flex w-full items-center gap-3 rounded-xl border border-dashed border-[#2a2a2e] bg-[#111113] px-4 py-3 text-left transition hover:border-[#FF3F3F]/40 hover:bg-[#151517]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FF3F3F]/10">
              <HelpCircle className="h-4 w-4 text-[#FF3F3F]" />
            </div>

            <div>
              <p className="text-[11px] font-semibold text-zinc-300">
                Add a question
              </p>

              <p className="mt-0.5 text-[9px] text-zinc-600">
                Example: "Have you done this before?"
              </p>
            </div>
          </button>
        ) : (
          <div className="space-y-2">
            {questions.map((question, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-xl border border-[#1e1e22] bg-[#111113] p-2"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1a1a1d] text-[9px] font-bold text-zinc-500">
                  {index + 1}
                </span>

                <input
                  type="text"
                  value={question}
                  maxLength={150}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  placeholder="What would you like to know?"
                  className="min-w-0 flex-1 bg-transparent px-1 text-[11px] text-white outline-none placeholder:text-zinc-700"
                />

                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Small helper */}
      <div className="rounded-xl border border-[#1e1e22] bg-[#0e0e10] px-3 py-2.5">
        <p className="text-[9px] leading-4 text-zinc-600">
          You can skip both sections. Only add details that make your request
          easier to understand.
        </p>
      </div>
    </div>
  );
}
