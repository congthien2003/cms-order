import {
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Typography } from '../typography';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';
import Pagination from '../pagination/Pagination';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ColumnDefinition<T> {
  key: string;
  title: string | ReactNode;
  render: (item: T, index: number) => ReactNode | string;
  sortable?: boolean;
  width?: string;
  justify?: 'start' | 'end' | 'center';
  hidden?: boolean;
  colStyle?: React.CSSProperties;
  sticky?: 'left' | 'right';
  stickyShadow?: boolean; // default true
  isEnableSticky?: boolean;
}

export type DataTableProps<T> = {
  dataSource: T[];
  columns: ColumnDefinition<T>[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions: number[];
  onPageChange?: (page: number, size?: number) => void;
  onPageSizeChange?: (size: number) => void;
  onRefresh?: () => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
};

function DataTable<T>(props: DataTableProps<T>) {
  const {
    dataSource,
    columns,
    pageNumber = 1,
    pageSize = 10,
    totalItems = 0,
    pageSizeOptions = [5, 10],
    onPageChange,
    onPageSizeChange,
    onSort,
    sortConfig: externalSortConfig,
  } = props;

  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickyBaseClass = 'sticky right-0 z-30 bg-background ';

  const stickyShadowClass = 'shadow-[-2px_0_0_0_rgba(0,0,0,0.25)]';

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      const canScroll =
        el.scrollWidth > el.clientWidth &&
        el.scrollLeft + el.clientWidth < el.scrollWidth - 1;

      setHasHorizontalScroll(canScroll);
    };

    checkScroll();
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const [pagination, setPagination] = useState<{
    page: number;
    size: number;
  }>({
    page: pageNumber ?? 1,
    size: pageSize ?? 10,
  });
  const [internalSortConfig, setInternalSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Use external sortConfig if provided, otherwise use internal
  const sortConfig = externalSortConfig ?? internalSortConfig;

  // Init when pass pageNumber and pageSize
  useEffect(() => {
    setPagination({ page: pageNumber ?? 1, size: pageSize ?? 10 });
  }, [pageNumber, pageSize]);

  // Function handle sort by column
  const handleSort = (key: string, column: ColumnDefinition<T>) => {
    if (!column.sortable) return;

    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }

    if (onSort) {
      // Server-side sort
      onSort(key, direction);
    } else {
      // Client-side sort (fallback)
      setInternalSortConfig({ key, direction });
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const handlePaginationChange = (page: number, size?: number) => {
    setPagination({ ...pagination, page });
    onPageChange?.(page, size ?? pagination.size);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const renderColumnTitle = (title: string | ReactNode) => {
    if (isValidElement(title)) {
      return title;
    }
    return <Typography variant="body-s-bold">{title}</Typography>;
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="
          relative w-full overflow-x-auto rounded-md
          [scrollbar-gutter:stable]

          after:pointer-events-none
          after:absolute
          after:inset-0
          after:border
          after:border-border
          after:rounded-md
          after:z-50
        "
      >
        <Table className="min-w-[1600px] w-full table-auto">
          <TableHeader className="sticky top-0 bg-background z-40 shadow">
            <TableRow className="hover:bg-muted/30 transition-colors duration-200">
              {columns.map((column) => (
                <TableHead
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key, column)}
                  className={cn(
                    column.sortable && 'cursor-pointer hover:bg-muted/50',
                    column.isEnableSticky && stickyBaseClass,
                    column.isEnableSticky &&
                      hasHorizontalScroll &&
                      stickyShadowClass
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center',
                      column.key === 'action' && 'justify-center abc'
                    )}
                  >
                    {renderColumnTitle(column.title)}
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataSource.length > 0 ? (
              dataSource.map((item, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-muted/30 transition-colors duration-200"
                >
                  {columns.map((column) => (
                    <TableCell
                      style={{ width: column.width }}
                      className={cn(
                        'whitespace-nowrap border-r-0',
                        column.isEnableSticky && stickyBaseClass
                      )}
                    >
                      {column.render(item, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <Pagination
          totalPages={totalPages || 1}
          currentPage={pagination.page || 1}
          onPageChange={handlePaginationChange}
          pageSize={pagination.size || 10}
          totalCount={totalItems || 0}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </>
  );
}

export default DataTable;
