using Application.Exceptions;
using System.Net;
using System.Runtime.CompilerServices;

namespace Application.Exceptions
{
    public abstract class BaseException : System.Exception
    {
        public string MemberName { get; }
        public int LineNumber { get; }
        public LoggingEvents LoggingEvents { get; }
        public HttpStatusCode StatusCode { get; }
        public string MessageKey { get; }

        protected BaseException(string message, string messageKey, HttpStatusCode statusCode = HttpStatusCode.InternalServerError, LoggingEvents loggingEvents = LoggingEvents.GeneralLog, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = 0)
            : base(message)
        {
            this.MessageKey = messageKey;
            this.LoggingEvents = loggingEvents;
            this.MemberName = memberName;
            this.LineNumber = lineNumber;
            this.StatusCode = statusCode;
        }

        protected BaseException(string message, string messageKey, HttpStatusCode statusCode = HttpStatusCode.InternalServerError, LoggingEvents loggingEvents = LoggingEvents.GeneralLog, System.Exception innerException = null, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = 0)
            : base(message, innerException)
        {
            this.MessageKey = messageKey;
            this.LoggingEvents = loggingEvents;
            this.MemberName = memberName;
            this.LineNumber = lineNumber;
            this.StatusCode = statusCode;
        }
    }
}