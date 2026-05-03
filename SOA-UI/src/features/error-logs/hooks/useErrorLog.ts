import { useCallback, useEffect, useState } from 'react';
import errorLogService from '@/services/errorLogService';
import type {
  ErrorLogDetail,
  ErrorLogPagedResponse,
  ErrorLogQueryParams,
  ErrorLogSummary,
} from '@/models/error-log';

const DEFAULT_PAGE_SIZE = 10;

export const useErrorLog = () => {
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<ErrorLogPagedResponse | null>(null);
  const [selectedLog, setSelectedLog] = useState<ErrorLogDetail | null>(null);
  const [query, setQuery] = useState<ErrorLogQueryParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const fetchLogs = useCallback(async (params?: ErrorLogQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const merged = {
        page: params?.page ?? query.page ?? 1,
        pageSize: params?.pageSize ?? query.pageSize ?? DEFAULT_PAGE_SIZE,
        fromUtc: params?.fromUtc ?? query.fromUtc,
        toUtc: params?.toUtc ?? query.toUtc,
        level: params?.level ?? query.level,
        statusCode: params?.statusCode ?? query.statusCode,
        path: params?.path ?? query.path,
        userId: params?.userId ?? query.userId,
        traceId: params?.traceId ?? query.traceId,
      };

      const response = await errorLogService.getList(merged);
      if ((response.isSuccess || response.success) && response.data) {
        setLogs(response.data);
      }
      setQuery(merged);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch error logs');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void fetchLogs({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    setError(null);
    try {
      const response = await errorLogService.getById(id);
      if ((response.isSuccess || response.success) && response.data) {
        setSelectedLog(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch error detail');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const openDetail = useCallback(async (log: ErrorLogSummary) => {
    setSelectedLog(null);
    await fetchDetail(log.id);
  }, [fetchDetail]);

  const closeDetail = useCallback(() => {
    setSelectedLog(null);
  }, []);

  const changePage = useCallback((page: number) => {
    void fetchLogs({ page });
  }, [fetchLogs]);

  return {
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
  };
};
