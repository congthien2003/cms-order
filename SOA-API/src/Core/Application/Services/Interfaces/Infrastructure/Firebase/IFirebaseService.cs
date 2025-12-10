using Application.Services.Interfaces.Abstractions;
using Shared.Enums;

namespace Application.Services.Interfaces.Infrastructure.Firebase
{
    public interface IFirebaseService : ITransientService
    {
        Task<bool> SendNotificationAsync(
            string token,
            string title,
            string body,
            Dictionary<string, string>? data = null,
            string? imageUrl = null,
            CancellationToken cancellationToken = default);

        Task<bool> SendNotificationAsync(
            IEnumerable<string> tokens,
            string title,
            string body,
            Dictionary<string, string>? data = null,
            string? imageUrl = null,
            CancellationToken cancellationToken = default);

        Task<bool> SendNotificationToUserWithTranslationAsync(
            Guid userId,
            string notificationKey,
            UserNotificationType type,
            string languageCode = "en-US",
            Dictionary<string, object>? parameters = null,
            Dictionary<string, string>? data = null,
            string? imageUrl = null,
            string? relatedEntityId = null,
            string? relatedEntityType = null,
            CancellationToken cancellationToken = default);

        Task<bool> RegisterDeviceTokenAsync(
            Guid userId,
            string token,
            DevicePlatform platform,
            string? deviceInfo = null,
            CancellationToken cancellationToken = default);

        Task<bool> UnregisterDeviceTokenAsync(
            string token,
            CancellationToken cancellationToken = default);

        Task<bool> ValidateTokenAsync(
            string token,
            CancellationToken cancellationToken = default);
    }
}
