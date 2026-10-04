import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, totalItems, pageSize, loading = false, onPageChange }: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const firstItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, totalItems);

  return (
    <footer className="theme-divider flex shrink-0 items-center justify-between gap-3 border-t px-4 py-3">
      <span className="theme-text-muted text-[11px]">{firstItem}-{lastItem} of {totalItems} offers · Page {page} of {safeTotalPages}</span>
      <nav aria-label="Offers pagination" className="flex shrink-0 items-center gap-1.5">
        <button type="button" aria-label="Previous page" disabled={loading || page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))} className="theme-divider theme-text-primary flex h-8 w-8 items-center justify-center rounded-md border disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
        <button type="button" aria-label="Next page" disabled={loading || page >= safeTotalPages} onClick={() => onPageChange(Math.min(safeTotalPages, page + 1))} className="theme-divider theme-text-primary flex h-8 w-8 items-center justify-center rounded-md border disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
      </nav>
    </footer>
  );
}
