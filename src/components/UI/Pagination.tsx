import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
  total: number;
  start: number;
  end: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage, totalPages, onPageChange,
  hasNext, hasPrev, total, start, end,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    if (currentPage <= 3) return pages.slice(0, 5);
    if (currentPage >= totalPages - 2) return pages.slice(totalPages - 5);
    return pages.slice(currentPage - 3, currentPage + 2);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-[#8b899a]">
      <p className="text-xs">
        Showing <span className="font-medium text-[#f2f1f5]">{start}–{end}</span> of{' '}
        <span className="font-medium text-[#f2f1f5]">{total}</span> results
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className="p-1.5 rounded-lg hover:bg-[#1a1820] text-[#8b899a] hover:text-[#f2f1f5] disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {currentPage > 3 && totalPages > 5 && (
          <>
            <button onClick={() => onPageChange(1)} className={pageBtnClass(false)}>1</button>
            <span className="text-[#6f6d7a] px-1 text-xs">…</span>
          </>
        )}

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={pageBtnClass(page === currentPage)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages - 2 && totalPages > 5 && (
          <>
            <span className="text-[#6f6d7a] px-1 text-xs">…</span>
            <button onClick={() => onPageChange(totalPages)} className={pageBtnClass(false)}>{totalPages}</button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="p-1.5 rounded-lg hover:bg-[#1a1820] text-[#8b899a] hover:text-[#f2f1f5] disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

function pageBtnClass(isActive: boolean) {
  return clsx(
    'min-w-[28px] h-7 px-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer',
    isActive
      ? 'bg-[#c94dff] text-[#0c0b10] font-semibold'
      : 'hover:bg-[#1a1820] text-[#8b899a] hover:text-[#f2f1f5]'
  );
}
