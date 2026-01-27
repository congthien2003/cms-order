import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../button';
import { useMemo } from 'react';
import { CommonSelect } from '../select/CommonSelect';

type Props = {
  pageSize: number;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  visiblePages?: number;
};

function Pagination({
  pageSize = 10,
  totalCount = 0,
  totalPages = 0,
  currentPage = 1,
  pageSizeOptions = [5, 10],
  onPageChange = () => {},
  onPageSizeChange,
  visiblePages = 5,
}: Props) {
  const pages = useMemo(() => {
    if (totalPages <= visiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const half = Math.floor(visiblePages / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    // If start < 1 => shift to beginning
    if (start < 1) {
      start = 1;
      end = visiblePages;
    }

    // If end > totalPages => shift to end
    if (end > totalPages) {
      end = totalPages;
      start = totalPages - visiblePages + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [totalPages, currentPage, visiblePages]);

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Total */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{startItem}</span> -{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalCount}</span>
          </div>
          {onPageSizeChange && (
            <CommonSelect
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
              groups={[
                {
                  options: pageSizeOptions.map((option) => ({
                    value: option.toString(),
                    label: option.toString(),
                  })),
                },
              ]}
            />
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </Button>
            {pages.map((page) => (
              <Button
                key={page}
                variant="outline"
                size="icon"
                onClick={() => onPageChange(page)}
                disabled={currentPage === page}
                className={`${currentPage === page ? 'bg-primary text-white' : ''}`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Pagination;
