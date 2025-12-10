using System.Net;
using System.Runtime.CompilerServices;

namespace Application.Exceptions
{
    public class ValidationException : BaseException
    {
        public ValidationException(string message, string messageKey, LoggingEvents loggingEvents = LoggingEvents.GeneralLog, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = 0)
            : base(message, messageKey, HttpStatusCode.BadRequest, loggingEvents, memberName, lineNumber)
        {
        }

        public ValidationException(string message, string messageKey, Exception innerException, LoggingEvents loggingEvents = LoggingEvents.GeneralLog, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = 0)
            : base(message, messageKey, HttpStatusCode.BadRequest, loggingEvents, innerException, memberName, lineNumber)
        {
        }
    }
} 