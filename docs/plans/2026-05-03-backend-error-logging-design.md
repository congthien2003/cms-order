# Backend Error Logging Design (Admin Monitoring)

## Context

Project backend (`SOA-API`) currently has:

- `GlobalExceptionHandler` to map exceptions into API error responses.
- `BaseException` hierarchy carrying useful metadata (`MessageKey`, `StatusCode`, `LoggingEvents`, `MemberName`, `LineNumber`).
- Existing middleware-level request logging, but still minimal.

Goal: implement an internal error monitoring system so admin can track backend failures directly from product UI, without relying on external observability services.

---

## Scope

This design covers **Approach A** only:

1. Structured backend logging using Serilog + ASP.NET logging.
2. Persisting error logs into application database.
3. Exposing admin APIs for listing and inspecting logs.
4. Providing an admin UI page for monitoring and troubleshooting.

Out of scope:

- Third-party logging/alerting tools (Sentry, Datadog, ELK).
- Full APM/distributed tracing.

---

## Objectives

1. Capture actionable backend errors with enough context for investigation.
2. Make errors searchable/filterable by admin users.
3. Keep sensitive data out of logs.
4. Keep implementation incremental and compatible with existing architecture.

Success criteria:

- Unhandled exceptions are persisted with traceable context.
- Admin can filter error logs by time range, severity, endpoint, status code, and user.
- Logs include correlation fields (`traceId`) for debugging request lifecycles.

---

## Architecture

### 1) Request Logging Middleware

Responsibilities:

- Assign/propagate correlation id (`TraceId`) from request to response scope.
- Log request completion event with:
  - `Method`, `Path`, `StatusCode`, `DurationMs`, `TraceId`, `UserId`.
- Avoid logging full request body by default.

Output:

- Structured informational log for all requests.
- Warning log for abnormal latency threshold (optional, configurable).

### 2) Global Exception Handler

Responsibilities:

- Centralize unhandled exception capture.
- Preserve current exception-to-response mapping behavior.
- Emit structured error log including:
  - `ExceptionType`, `Message`, `StackTrace`, `StatusCode`
  - `Path`, `Method`, `TraceId`, `UserId`
  - `MessageKey`, `LoggingEvent`, `MemberName`, `LineNumber` when available from `BaseException`.
- Persist log record to database through a dedicated service.

### 3) Error Log Persistence Service

Introduce service (e.g. `IErrorLogService`) to decouple handler from storage details.

Responsibilities:

- Transform runtime exception context into `ErrorLog` entity.
- Persist asynchronously and fail-safe (logging persistence must not crash response pipeline).
- Support retention policy hooks (cleanup job in later phase).

### 4) Admin Monitoring API

Add secured endpoints (Admin role only), for example:

- `GET /api/v1/error-logs`
  - paging + filters: `from`, `to`, `level`, `statusCode`, `path`, `userId`, `traceId`.
- `GET /api/v1/error-logs/{id}`
  - detail payload with stack trace and context.

### 5) Admin UI (MVP)

A simple page in `SOA-UI`:

- Error table (time, level, message, endpoint, status code, user, trace id).
- Filter controls (time range, level, status code, endpoint/user search).
- Detail drawer/modal for full error context and stack trace.

---

## Data Model

Proposed table: `ErrorLogs`

Required fields:

- `Id` (GUID/long)
- `OccurredAtUtc` (DateTime)
- `Level` (string)
- `Message` (string)
- `MessageKey` (nullable string)
- `ExceptionType` (nullable string)
- `StackTrace` (nullable text)
- `StatusCode` (nullable int)
- `TraceId` (nullable string)
- `LoggingEvent` (nullable string/int)
- `MemberName` (nullable string)
- `LineNumber` (nullable int)
- `RequestMethod` (nullable string)
- `RequestPath` (nullable string)
- `QueryString` (nullable string, sanitized)
- `UserId` (nullable string)
- `UserName` (nullable string)
- `Source` (nullable string; e.g., handler name)
- `Extra` (nullable json/text for extensibility)

Indexes (minimum):

- `OccurredAtUtc DESC`
- `TraceId`
- `StatusCode`
- `RequestPath`
- `UserId`

---

## Logging Rules & Security

### What to log

- Unhandled exceptions (mandatory).
- Business exceptions with warning/error level depending on type.
- Request summary logs for observability.

### What NOT to log

- Passwords, tokens, OTPs, secrets.
- Full sensitive request bodies.
- Payment/card sensitive data.

### Sanitization

- Add a simple redaction utility for common sensitive keys (`password`, `token`, `authorization`, `secret`, etc.).
- Apply before persistence and before returning log detail to UI if needed.

---

## Error Classification

Leverage existing exception model:

- `ValidationException`, `BadRequestException`, `NotFoundException`, `ConflictException`: usually `Warning`.
- `UnauthorizedException`, `ForbiddenException`: `Warning` (or `Information` based on policy).
- Unknown/Unhandled exceptions: `Error`.

`LoggingEvents` from `BaseException` should be persisted to support grouping and analysis by domain event.

---

## API Contract (MVP)

### `GET /api/v1/error-logs`

Query params:

- `page`, `pageSize`
- `fromUtc`, `toUtc`
- `level`
- `statusCode`
- `path`
- `userId`
- `traceId`

Response:

- paged list with summary fields only.

### `GET /api/v1/error-logs/{id}`

Response:

- full detail including stack trace and extended context.

Authorization:

- Admin role only.

---

## Rollout Plan

### Phase 1 — Backend Foundations

1. Upgrade request logging middleware to structured logs with duration and trace id.
2. Upgrade `GlobalExceptionHandler` to structured logs.
3. Add `ErrorLog` entity + EF migration + repository/service.
4. Persist unhandled exception records.

### Phase 2 — Admin Access

1. Add `ErrorLogsController` with list/detail endpoints.
2. Add filtering + pagination.
3. Enforce authorization and payload sanitization.

### Phase 3 — UI Monitoring

1. Add admin error logs page in `SOA-UI`.
2. Add filters and detail drawer.
3. Add lightweight UX improvements (copy trace id, quick filter chips).

### Phase 4 — Retention & Operations

1. Define retention (e.g., 30/60/90 days).
2. Add scheduled cleanup job.
3. Monitor table growth and query performance.

---

## Risks & Mitigations

1. **Database growth too fast**
   - Mitigation: retention policy + index strategy + capped payload size.

2. **Sensitive data leakage**
   - Mitigation: redaction utility + strict logging policy + code review checklist.

3. **Performance impact during exception spikes**
   - Mitigation: async persistence and bounded payload; optional queue-based write in future.

4. **Noise from expected business exceptions**
   - Mitigation: severity mapping and filtering policy by exception type.

---

## Acceptance Checklist

- [ ] Every unhandled exception is persisted with `TraceId`, endpoint, and status code.
- [ ] Admin can list/filter logs and open detail view.
- [ ] Sensitive fields are redacted or excluded.
- [ ] Request logs include duration and status code.
- [ ] Query performance acceptable for recent logs.

---

## Implementation Notes for Current Codebase

Primary integration points identified:

- `SOA-API/src/Presentation/Host/Extensions/GlobalExeptionHandler.cs`
- `SOA-API/src/Presentation/Host/Extensions/LoggerMiddlewareExtensions.cs`
- `SOA-API/src/Presentation/Host/Program.cs`
- `SOA-API/src/Core/Application/Exceptions/BaseException.cs`

This design intentionally reuses existing exception metadata and extends it into a structured persistence + admin visibility pipeline.
