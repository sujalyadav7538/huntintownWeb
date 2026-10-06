import { LayoutGrid } from "lucide-react";
import { FormSection } from "@/src/features/posts/components/FormSection";
import { SelectDropdown } from "@/src/features/posts/components/Dropdowns";
import { POST_CATEGORIES } from "@/src/features/posts/lib/postForm";

interface CategoryStepProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CategoryStep({ value, onChange }: CategoryStepProps) {
  return (
    <FormSection
      icon={LayoutGrid}
      title="Category"
      hint="Search or pick the category that fits best."
    >
      <SelectDropdown
        value={value}
        options={POST_CATEGORIES}
        onChange={onChange}
        ariaLabel="Category"
        placeholder="Select a category"
        searchPlaceholder="Search categories"
      />
    </FormSection>
  );
}
