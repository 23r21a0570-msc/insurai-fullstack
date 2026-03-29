import { ReactNode, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface Column<T> {
  key: string;
  header: string;
  accessor?: keyof T;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  rowClassName?: (item: T, index: number) => string;
  keyExtractor?: (item: T, index: number) => string;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  isLoading,
  emptyMessage = 'No data available',
  emptyIcon,
  rowClassName,
  keyExtractor,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'));
      if (sortDir === 'desc') setSortKey(null);
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.accessor) return 0;
    const av = a[col.accessor];
    const bv = b[col.accessor];
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const getSortIcon = (col: Column<T>) => {
    if (!col.sortable) return null;
    if (sortKey !== col.key) return <ChevronsUpDown size={12} className="opacity-30" />;
    if (sortDir === 'asc') return <ChevronUp size={12} className="text-[#10B981]" />;
    if (sortDir === 'desc') return <ChevronDown size={12} className="text-[#10B981]" />;
    return <ChevronsUpDown size={12} className="opacity-30" />;
  };

  if (isLoading) {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left">
                  <div className="h-3 w-20 rounded bg-white/[0.06] animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-white/[0.04]">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5">
                    <div
                      className="h-4 rounded bg-white/[0.04] animate-pulse"
                      style={{ width: `${40 + Math.random() * 40}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {emptyIcon && <div className="mb-4 text-gray-600">{emptyIcon}</div>}
          <p className="text-sm text-gray-500 font-medium">{emptyMessage}</p>
          <p className="text-xs text-gray-700 mt-1">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="table" aria-label="Data table">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]" role="row">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={cn(
                    'px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 whitespace-nowrap',
                    col.sortable && 'cursor-pointer select-none hover:text-gray-300 transition-colors focus-visible:outline-none focus-visible:text-gray-300',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.headerClassName
                  )}
                  onClick={() => handleSort(col)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSort(col)}
                  tabIndex={col.sortable ? 0 : -1}
                  role="columnheader"
                  aria-sort={
                    col.sortable
                      ? sortKey === col.key
                        ? sortDir === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                      : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {getSortIcon(col)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]" role="rowgroup">
            {sortedData.map((item, idx) => (
              <tr
                key={keyExtractor ? keyExtractor(item, idx) : idx}
                onClick={() => onRowClick?.(item)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onRowClick?.(item)}
                tabIndex={onRowClick ? 0 : -1}
                className={cn(
                  'group transition-colors duration-100',
                  'hover:bg-white/[0.03]',
                  onRowClick && 'cursor-pointer focus-visible:outline-none focus-visible:bg-white/[0.04] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#10B981]/30',
                  rowClassName?.(item, idx)
                )}
                role="row"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3.5 text-sm text-gray-300 whitespace-nowrap',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right',
                      col.className
                    )}
                    role="cell"
                  >
                    {col.render
                      ? col.render(item, idx)
                      : col.accessor
                      ? String(item[col.accessor] ?? '')
                      : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
