namespace Application.Services.Interfaces.Infrastructure.Email
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to); 
    }
}
