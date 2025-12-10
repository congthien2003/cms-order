using Application.Services.Interfaces.Infrastructure.Email;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Mail;

namespace Infrastructures.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;

        public EmailService(ILogger<EmailService> logger)
        {
            _logger = logger;
        }

        public Task SendEmailAsync(string to)
        {
            try
            {
                MailMessage mailMessage = new MailMessage();
                var from = "nhat23891@gmail.com";
                var pass = "zohi sncr hcqk kwwd";
                mailMessage.To.Add(to);
                mailMessage.From = new MailAddress(from);
                mailMessage.Subject = "Welcome to MechKey Shop";

                var messageBody = @"Hello World";
                mailMessage.IsBodyHtml = true;
                mailMessage.Body = messageBody;

                SmtpClient smtp = new SmtpClient("smtp.gmail.com");
                smtp.EnableSsl = true;
                smtp.Port = 587;
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new NetworkCredential(from, pass);

                smtp.Send(mailMessage);
                _logger.LogInformation($"Email sent successfully to {to}");
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                _logger.LogError($"Error sending email: {ex.Message}");
                throw;
            }
        }
    }
}
