export interface ErrorLogSummary {
  id: string;
  occurredAtUtc: string;
  level: string;
  message: string;
  statusCode?: number | null;
  requestPath?: string | null;
  requestMethod?: string | null;
  userId?: string | null;
  userName?: string | null;
  traceId?: string | null;
}

export interface ErrorLogDetail extends ErrorLogSummary {
  messageKey?: string | null;
  exceptionType?: string | null;
  stackTrace?: string | null;
  loggingEvent?: string | null;
  memberName?: string | null;
  lineNumber?: number | null;
  queryString?: string | null;
  source?: string | null;
  extra?: string | null;
}

export interface ErrorLogQueryParams {
  page?: number;
  pageSize?: number;
  fromUtc?: string;
  toUtc?: string;
  level?: string;
  statusCode?: number;
  path?: string;
  userId?: string;
  traceId?: string;
}

export interface ErrorLogPagedResponse {
  items: ErrorLogSummary[];
  page: number;
  pageSize: number;
  totalCount: number;
}
