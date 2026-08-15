import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Builds a compact page list with ellipses, e.g. [1, "...", 4, 5, 6, "...", 12]
function getPageNumbers(currentPage, totalPages) {
  const delta = 1;
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    }
  }

  const pagesWithDots = [];
  let previous;
  for (const page of pages) {
    if (previous !== undefined) {
      if (page - previous === 2) {
        pagesWithDots.push(previous + 1);
      } else if (page - previous > 2) {
        pagesWithDots.push("...");
      }
    }
    pagesWithDots.push(page);
    previous = page;
  }

  return pagesWithDots;
}

const Pagination = ({ currentPage, totalPages, onPageChange, disabled }) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Paginare rezultate"
      className="flex items-center justify-center gap-1 my-12 flex-wrap"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        aria-label="Pagina anterioară"
        className="flex items-center justify-center w-10 h-10 rounded-full text-text_grey_darker hover:bg-background_green_light disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`dots-${idx}`}
            className="min-w-10 h-10 px-1 flex items-center justify-center text-text_grey_darker select-none"
          >
            …
          </span>
        ) : (
          <button
            type="button"
            key={page}
            onClick={() => onPageChange(page)}
            disabled={disabled}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "min-w-10 h-10 px-2 rounded-full text-sm font-medium transition-colors disabled:pointer-events-none",
              page === currentPage
                ? "bg-background_green text-white"
                : "text-text_grey_darker hover:bg-background_green_light"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        aria-label="Pagina următoare"
        className="flex items-center justify-center w-10 h-10 rounded-full text-text_grey_darker hover:bg-background_green_light disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default Pagination;
