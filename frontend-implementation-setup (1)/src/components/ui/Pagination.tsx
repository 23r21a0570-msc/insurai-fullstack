import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
}: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (page <= 4) return i + 1;
    if (page >= totalPages - 3) return totalPages - 6 + i;
    return page - 3 + i;
  });

  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>
          {start}–{end} of {total.toLocaleString()} results
        </span>
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="appearance-none bg-white/[0.04] border border-white/[0.08] rounded-md px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-[#10B981]/40 cursor-pointer"
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s} className="bg-[#0F1629]">
                {s} / page
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors',
            page === 1
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-white/[0.06] hover:text-white cursor-pointer'
          )}
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p, i) => (
          <button
            key={`${p}-${i}`}
            onClick={() => onPageChange(p)}
            className={cn(
              'flex h-7 min-w-[28px] items-center justify-center rounded-md px-2 text-xs font-medium transition-colors',
              p === page
                ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                : 'text-gray-500 hover:bg-white/[0.06] hover:text-white cursor-pointer'
            )}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors',
            page === totalPages
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-white/[0.06] hover:text-white cursor-pointer'
          )}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
