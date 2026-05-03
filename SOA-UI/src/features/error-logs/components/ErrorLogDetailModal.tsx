import { Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ErrorLogDetail } from '@/models/error-log';

interface ErrorLogDetailModalProps {
  open: boolean;
  loading: boolean;
  detail: ErrorLogDetail | null;
  onOpenChange: (open: boolean) => void;
}

const row = (label: string, value?: string | number | null) => (
  <div className="grid grid-cols-12 gap-3 text-sm">
    <div className="col-span-4 text-muted-foreground">{label}</div>
    <div className="col-span-8 break-all">{value ?? '-'}</div>
  </div>
);

export default function ErrorLogDetailModal({
  open,
  loading,
  detail,
  onOpenChange,
}: ErrorLogDetailModalProps) {
  const handleCopyTrace = async () => {
    if (!detail?.traceId) return;
    await navigator.clipboard.writeText(detail.traceId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Error detail</DialogTitle>
          <DialogDescription>
            Full backend error context for troubleshooting.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading detail...
          </div>
        ) : !detail ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No detail found.
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="rounded border p-3 space-y-2">
              {row('Occurred at', new Date(detail.occurredAtUtc).toLocaleString())}
              {row('Level', detail.level)}
              {row('Status code', detail.statusCode ?? '-')}
              {row('Message', detail.message)}
              {row('Message key', detail.messageKey)}
            </div>

            <div className="rounded border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">Request</p>
                <Button type="button" variant="outline" size="sm" onClick={handleCopyTrace}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy TraceId
                </Button>
              </div>
              {row('Method', detail.requestMethod)}
              {row('Path', detail.requestPath)}
              {row('Query', detail.queryString)}
              {row('TraceId', detail.traceId)}
            </div>

            <div className="rounded border p-3 space-y-2">
              <p className="font-medium text-sm">Exception</p>
              {row('Type', detail.exceptionType)}
              {row('Logging event', detail.loggingEvent)}
              {row('Member', detail.memberName)}
              {row('Line', detail.lineNumber ?? '-')}
              {row('Source', detail.source)}
            </div>

            <div className="rounded border p-3 space-y-2">
              <p className="font-medium text-sm">Stack trace</p>
              <pre className="text-xs whitespace-pre-wrap break-words bg-muted p-3 rounded max-h-64 overflow-auto">
                {detail.stackTrace || '-'}
              </pre>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
