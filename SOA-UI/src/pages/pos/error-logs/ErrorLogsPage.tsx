import { useMemo, useState } from 'react';
import Page from '@/components/ui/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DataTable, { type ColumnDefinition } from '@/components/ui/table/data-table';
import { useErrorLog } from '@/features/error-logs/hooks/useErrorLog';
import ErrorLogDetailModal from '@/features/error-logs/components/ErrorLogDetailModal';
import type { ErrorLogSummary } from '@/models/error-log';

export default function ErrorLogsPage() {
  const {
    loading,
    detailLoading,
    error,
    logs,
    query,
    selectedLog,
    fetchLogs,
    openDetail,
    closeDetail,
    changePage,
  } = useErrorLog();

  const [path, setPath] = useState('');
  const [traceId, setTraceId] = useState('');
  const [level, setLevel] = useState('all');
  const [statusCode, setStatusCode] = useState('all');

  const columns: ColumnDefinition<ErrorLogSummary>[] = useMemo(
    () => [
      {
        key: 'occurredAtUtc',
        title: 'Time',
        render: (item) => new Date(item.occurredAtUtc).toLocaleString(),
      },
      { key: 'level', title: 'Level', render: (item) => item.level },
      {
        key: 'message',
        title: 'Message',
        render: (item) => (
          <span className="inline-block max-w-[350px] truncate" title={item.message}>
            {item.message}
          </span>
        ),
      },
      {
        key: 'requestPath',
        title: 'Path',
        render: (item) => (
          <span className="inline-block max-w-[250px] truncate" title={item.requestPath ?? ''}>
            {item.requestPath ?? '-'}
          </span>
        ),
      },
      {
        key: 'statusCode',
        title: 'Status',
        render: (item) => item.statusCode ?? '-',
      },
      {
        key: 'traceId',
        title: 'TraceId',
        render: (item) => (
          <span className="inline-block max-w-[200px] truncate" title={item.traceId ?? ''}>
            {item.traceId ?? '-'}
          </span>
        ),
      },
      {
        key: 'action',
        title: 'Action',
        render: (item) => (
          <Button type="button" variant="outline" size="sm" onClick={() => void openDetail(item)}>
            View detail
          </Button>
        ),
      },
    ],
    [openDetail]
  );

  return (
    <Page title="Error Logs">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Management Error Logs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input value={path} onChange={(e) => setPath(e.target.value)} placeholder="Filter by path" />
              <Input value={traceId} onChange={(e) => setTraceId(e.target.value)} placeholder="Filter by traceId" />
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="Error">Error</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                  <SelectItem value="Information">Information</SelectItem>
                </SelectContent>
              </Select>
              <Input value={statusCode} onChange={(e) => setStatusCode(e.target.value)} placeholder="Status code" />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() =>
                  void fetchLogs({
                    page: 1,
                    path: path || undefined,
                    traceId: traceId || undefined,
                    level: level === 'all' ? undefined : level,
                    statusCode:
                      statusCode && statusCode !== 'all' && !Number.isNaN(Number(statusCode))
                        ? Number(statusCode)
                        : undefined,
                  })
                }
              >
                Apply filters
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPath('');
                  setTraceId('');
                  setLevel('all');
                  setStatusCode('all');
                  void fetchLogs({ page: 1, path: undefined, traceId: undefined, level: undefined, statusCode: undefined });
                }}
              >
                Reset
              </Button>
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <DataTable
              dataSource={logs?.items ?? []}
              columns={columns}
              pageNumber={logs?.page ?? query.page ?? 1}
              pageSize={logs?.pageSize ?? query.pageSize ?? 10}
              totalItems={logs?.totalCount ?? 0}
              pageSizeOptions={[10, 20, 50]}
              onPageChange={(page) => changePage(page)}
            />

            {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}
          </CardContent>
        </Card>
      </div>

      <ErrorLogDetailModal
        open={Boolean(selectedLog) || detailLoading}
        loading={detailLoading}
        detail={selectedLog}
        onOpenChange={(open) => {
          if (!open) closeDetail();
        }}
      />
    </Page>
  );
}
