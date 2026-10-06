import { useState } from "react";
import { Star } from "lucide-react";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export default function StarRatingInput({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <div className="flex items-center gap-3">
      <div
        role="radiogroup"
        aria-label="Rating"
        className="flex gap-1"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            className="rounded transition disabled:cursor-not-allowed"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= shown
                  ? "fill-amber-400 text-amber-400"
                  : "theme-icon-muted"
              }`}
            />
          </button>
        ))}
      </div>
      {shown > 0 && (
        <span className="theme-text-muted text-xs font-medium">
          {LABELS[shown]}
        </span>
      )}
    </div>
  );
}
