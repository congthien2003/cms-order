using System.Net;
using System.Runtime.CompilerServices;

namespace Application.Exceptions
{
    public class UnauthorizedException : BaseException
    {
        public UnauthorizedException(string message, string messageKey, LoggingEvents loggingEvents = LoggingEvents.GeneralLog, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = 0)
            : base(message, messageKey, HttpStatusCode.Forbidden, loggingEvents, memberName, lineNumber)
        {
        }

        public UnauthorizedException(string message, string messageKey, System.Exception innerException, LoggingEvents loggingEvents = LoggingEvents.GeneralLog, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = 0)
            : base(message, messageKey, HttpStatusCode.Forbidden, loggingEvents, innerException, memberName, lineNumber)
        {
        }
    }
}