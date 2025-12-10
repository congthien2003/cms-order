using System.Net;
using System.Runtime.CompilerServices;

namespace Application.Exceptions
{
    public class ForbiddenException : BaseException
    {
        public ForbiddenException(string message, string messageKey, LoggingEvents loggingEvents = LoggingEvents.GeneralLog, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = 0)
            : base(message, messageKey, HttpStatusCode.Forbidden, loggingEvents, memberName, lineNumber)
        {
        }

        public ForbiddenException(string message, string messageKey, Exception innerException, LoggingEvents loggingEvents = LoggingEvents.GeneralLog, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = 0)
            : base(message, messageKey, HttpStatusCode.Forbidden, loggingEvents, innerException, memberName, lineNumber)
        {
        }
    }
} 