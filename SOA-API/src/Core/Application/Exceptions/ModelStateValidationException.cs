using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;
using System.Runtime.CompilerServices;

namespace Application.Exceptions
{
    public class ModelStateValidationException : BaseException
    {
        public Dictionary<string, string[]> ValidationErrors { get; }

        public ModelStateValidationException(ModelStateDictionary modelState, LoggingEvents loggingEvents = LoggingEvents.GeneralLog, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = 0)
            : base("Validation failed", "VALIDATION-FAILED", HttpStatusCode.BadRequest, loggingEvents, memberName, lineNumber)
        {
            ValidationErrors = ExtractValidationErrors(modelState);
        }

        public ModelStateValidationException(Dictionary<string, string[]> validationErrors, LoggingEvents loggingEvents = LoggingEvents.GeneralLog, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = 0)
            : base("Validation failed", "VALIDATION-FAILED", HttpStatusCode.BadRequest, loggingEvents, memberName, lineNumber)
        {
            ValidationErrors = validationErrors;
        }

        private static Dictionary<string, string[]> ExtractValidationErrors(ModelStateDictionary modelState)
        {
            var errors = new Dictionary<string, string[]>();
            
            foreach (var kvp in modelState)
            {
                if (kvp.Value.Errors.Count > 0)
                {
                    errors[kvp.Key] = kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray();
                }
            }
            
            return errors;
        }
    }
} 