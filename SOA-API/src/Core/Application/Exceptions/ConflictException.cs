using System.Net;
using System.Runtime.CompilerServices;

namespace Application.Exceptions
{
    public class ConflictException : BaseException
    {
        public ConflictException(string message, string messageKey, LoggingEvents loggingEvents = LoggingEvents.GeneralLog, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = 0)
            : base(message, messageKey, HttpStatusCode.Conflict, loggingEvents, memberName, lineNumber)
        {
        }

        public ConflictException(string message, string messageKey, Exception innerException, LoggingEvents loggingEvents = LoggingEvents.GeneralLog, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = 0)
            : base(message, messageKey, HttpStatusCode.Conflict, loggingEvents, innerException, memberName, lineNumber)
        {
        }
    }
} 