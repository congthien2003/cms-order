using System.Net;
using System.Runtime.CompilerServices;

namespace Application.Exceptions
{
    public class NotFoundException : BaseException
    {
        public NotFoundException(string message, string messageKey, LoggingEvents loggingEvents = LoggingEvents.GeneralLog, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = 0)
            : base(message, messageKey, HttpStatusCode.NotFound, loggingEvents, memberName, lineNumber)
        {
        }

        public NotFoundException(string message, string messageKey, Exception innerException, LoggingEvents loggingEvents = LoggingEvents.GeneralLog, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = 0)
            : base(message, messageKey, HttpStatusCode.NotFound, loggingEvents, innerException, memberName, lineNumber)
        {
        }
    }
}