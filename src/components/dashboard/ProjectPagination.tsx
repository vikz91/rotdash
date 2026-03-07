"use client";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function ProjectPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 text-sm font-medium text-[#e5e7eb] bg-[#1f2933] border border-[#374151] rounded-lg hover:border-[#4b5563] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#374151]"
        aria-label="Previous page"
      >
        Previous
      </button>
      <span className="text-sm text-[#9ca3af] px-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 text-sm font-medium text-[#e5e7eb] bg-[#1f2933] border border-[#374151] rounded-lg hover:border-[#4b5563] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#374151]"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}
