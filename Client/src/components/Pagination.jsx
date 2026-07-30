import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasPrevPage, 
  hasNextPage, 
  loading = false 
}) => {
  // Hide if there's only 1 page or invalid totalPages
  if (!totalPages || totalPages <= 1) return null;

  // Fallback boolean checks if backend doesn't explicitly return hasPrevPage / hasNextPage
  const isPrevDisabled = loading || (hasPrevPage !== undefined ? !hasPrevPage : currentPage <= 1);
  const isNextDisabled = loading || (hasNextPage !== undefined ? !hasNextPage : currentPage >= totalPages);

  // Generate page numbers array [1, 2, 3, ...]
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-600">
      <div>
        Showing page <span className="font-semibold text-slate-800">{currentPage}</span> of{' '}
        <span className="font-semibold text-slate-800">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isPrevDisabled}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 sm:active:scale-100"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              disabled={loading}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                currentPage === p
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              } disabled:opacity-50`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isNextDisabled}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 sm:active:scale-100"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;