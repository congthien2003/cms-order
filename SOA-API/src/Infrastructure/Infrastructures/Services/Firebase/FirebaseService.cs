using Application.Services.Interfaces.Infrastructure.Firebase;
using Shared.Enums;

namespace Infrastructures.Services.Firebase
{
    public class FirebaseService : IFirebaseService
    {
        public Task<bool> RegisterDeviceTokenAsync(Guid userId, string token, DevicePlatform platform, string? deviceInfo = null, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task<bool> SendNotificationAsync(string token, string title, string body, Dictionary<string, string>? data = null, string? imageUrl = null, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task<bool> SendNotificationAsync(IEnumerable<string> tokens, string title, string body, Dictionary<string, string>? data = null, string? imageUrl = null, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task<bool> SendNotificationToUserWithTranslationAsync(Guid userId, string notificationKey, UserNotificationType type, string languageCode = "en-US", Dictionary<string, object>? parameters = null, Dictionary<string, string>? data = null, string? imageUrl = null, string? relatedEntityId = null, string? relatedEntityType = null, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UnregisterDeviceTokenAsync(string token, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task<bool> ValidateTokenAsync(string token, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
    //    //private readonly FirebaseSettings _settings;
    //    private readonly ILogger<FirebaseService> _logger;
    //    private readonly IAppDbRepository<UserDeviceToken> _deviceTokenRepository;
    //    private readonly IAppDbRepository<UserNotification> _notificationRepository;
    //    private readonly INotificationMessageService _notificationMessageService;
    //    private readonly FirebaseApp _firebaseApp;

    //    public FirebaseService(
    //        IOptions<FirebaseSettings> settings,
    //        ILogger<FirebaseService> logger,
    //        IAppDbRepository<UserDeviceToken> deviceTokenRepository,
    //        IAppDbRepository<UserNotification> notificationRepository,
    //        INotificationMessageService notificationMessageService)
    //    {
    //        _settings = settings.Value;
    //        _logger = logger;
    //        _deviceTokenRepository = deviceTokenRepository;
    //        _notificationRepository = notificationRepository;
    //        _notificationMessageService = notificationMessageService;

    //        // Initialize or get existing FirebaseApp
    //        _firebaseApp = GetOrCreateFirebaseApp();
    //    }

    //    private FirebaseApp GetOrCreateFirebaseApp()
    //    {
    //        try
    //        {
    //            // Check if Firebase app is already initialized
    //            if (FirebaseApp.DefaultInstance != null)
    //            {
    //                return FirebaseApp.DefaultInstance;
    //            }

    //            return InitializeFirebaseApp();
    //        }
    //        catch
    //        {
    //            _logger.LogError("Error getting or creating FirebaseApp instance");
    //            throw;
    //        }
    //    }

    //    private FirebaseApp InitializeFirebaseApp()
    //    {
    //        // Add thread safety for multi-threaded environments
    //        lock (typeof(FirebaseApp))
    //        {
    //            try
    //            {
    //                // Double check if app exists inside lock
    //                if (FirebaseApp.DefaultInstance != null)
    //                {
    //                    return FirebaseApp.DefaultInstance;
    //                }

    //                GoogleCredential credential;

    //                if (!string.IsNullOrEmpty(_settings.ServiceAccountKeyPath) && File.Exists(_settings.ServiceAccountKeyPath))
    //                {
    //                    // Use service account key file
    //                    try
    //                    {
    //                        credential = GoogleCredential.FromFile(_settings.ServiceAccountKeyPath);

    //                        // Ensure credential has proper Firebase scopes
    //                        credential = credential.CreateScoped(
    //                            "https://www.googleapis.com/auth/firebase.messaging",
    //                            "https://www.googleapis.com/auth/cloud-platform");
    //                    }
    //                    catch
    //                    {
    //                        _logger.LogError("Error loading Firebase credentials");
    //                        throw;
    //                    }
    //                }
    //                else
    //                {
    //                    throw new InvalidOperationException(
    //                        "Firebase service account key not configured properly. " +
    //                        "Please provide ServiceAccountKeyPath in firebase.json configuration.");
    //                }

    //                // Configure FCM VAPID keys first before creating app instance
    //                if (!string.IsNullOrEmpty(_settings.VapidPublicKey) && !string.IsNullOrEmpty(_settings.VapidPrivateKey))
    //                {
    //                    // Set FCM specific environment variables
    //                    Environment.SetEnvironmentVariable("FCM_VAPID_KEY_PUBLIC", _settings.VapidPublicKey);
    //                    Environment.SetEnvironmentVariable("FCM_VAPID_KEY_PRIVATE", _settings.VapidPrivateKey);

    //                    // Also try the Firebase Admin specific environment variables 
    //                    Environment.SetEnvironmentVariable("FIREBASE_VAPID_KEY_PUBLIC", _settings.VapidPublicKey);
    //                    Environment.SetEnvironmentVariable("FIREBASE_VAPID_KEY_PRIVATE", _settings.VapidPrivateKey);

    //                    // Set GOOGLE_APPLICATION_CREDENTIALS for extra safety
    //                    if (!string.IsNullOrEmpty(_settings.ServiceAccountKeyPath))
    //                    {
    //                        Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS",
    //                            Path.GetFullPath(_settings.ServiceAccountKeyPath));
    //                    }
    //                }

    //                // Configure app options
    //                var options = new AppOptions()
    //                {
    //                    Credential = credential,
    //                    ProjectId = _settings.ProjectId
    //                };

    //                try
    //                {
    //                    var app = FirebaseApp.Create(options);
    //                    return app;
    //                }
    //                catch (ArgumentException ex) when (ex.Message.Contains("already exists"))
    //                {
    //                    return FirebaseApp.DefaultInstance!;
    //                }
    //            }
    //            catch
    //            {
    //                _logger.LogError("Failed to initialize Firebase app");
    //                throw;
    //            }
    //        }
    //    }

    //    public async Task<bool> SendNotificationAsync(
    //        string token,
    //        string title,
    //        string body,
    //        Dictionary<string, string>? data = null,
    //        string? imageUrl = null,
    //        CancellationToken cancellationToken = default)
    //    {
    //        try
    //        {
    //            var message = new Message()
    //            {
    //                Token = token,
    //                Notification = new Notification()
    //                {
    //                    Title = title,
    //                    Body = body,
    //                    ImageUrl = imageUrl
    //                },
    //                Data = data,
    //                Android = new AndroidConfig()
    //                {
    //                    Priority = Priority.High,
    //                    Notification = new AndroidNotification()
    //                    {
    //                        Title = title,
    //                        Body = body,
    //                        ImageUrl = imageUrl,
    //                        ChannelId = "default",
    //                        Sound = "default"
    //                    }
    //                },
    //                Apns = new ApnsConfig()
    //                {
    //                    Aps = new Aps()
    //                    {
    //                        Alert = new ApsAlert()
    //                        {
    //                            Title = title,
    //                            Body = body
    //                        },
    //                        Sound = "default",
    //                        Badge = 1
    //                    }
    //                }
    //            };

    //            var response = await FirebaseMessaging.DefaultInstance.SendAsync(message, cancellationToken);
    //            return !string.IsNullOrEmpty(response);
    //        }
    //        catch (FirebaseMessagingException ex)
    //        {
    //            _logger.LogError(ex, "Firebase messaging error: {ErrorCode}", ex.MessagingErrorCode);

    //            // Handle invalid token
    //            if (ex.MessagingErrorCode == MessagingErrorCode.Unregistered ||
    //                ex.MessagingErrorCode == MessagingErrorCode.InvalidArgument)
    //            {
    //                await DeactivateTokenAsync(token, cancellationToken);
    //            }

    //            return false;
    //        }
    //        catch
    //        {
    //            _logger.LogError("Failed to send FCM notification");
    //            return false;
    //        }
    //    }

    //    public async Task<bool> SendNotificationAsync(
    //        IEnumerable<string> tokens,
    //        string title,
    //        string body,
    //        Dictionary<string, string>? data = null,
    //        string? imageUrl = null,
    //        CancellationToken cancellationToken = default)
    //    {
    //        var tokenList = tokens.Distinct().ToList();
    //        if (!tokenList.Any())
    //        {
    //            return false;
    //        }

    //        // Firebase has limitations on how many tokens can be sent in one request
    //        // Break into smaller batches if needed
    //        const int batchSize = 100;
    //        if (tokenList.Count > batchSize)
    //        {
    //            var batches = tokenList
    //                .Select((token, index) => new { Token = token, Index = index })
    //                .GroupBy(x => x.Index / batchSize)
    //                .Select(g => g.Select(x => x.Token).ToList())
    //                .ToList();

    //            int successCount = 0;
    //            foreach (var batch in batches)
    //            {
    //                bool success = await SendBatchNotificationAsync(batch, title, body, data, imageUrl, cancellationToken);
    //                if (success) successCount++;
    //            }

    //            return successCount > 0;
    //        }

    //        return await SendBatchNotificationAsync(tokenList, title, body, data, imageUrl, cancellationToken);
    //    }

    //    private async Task<bool> SendBatchNotificationAsync(
    //        List<string> tokenList,
    //        string title,
    //        string body,
    //        Dictionary<string, string>? data = null,
    //        string? imageUrl = null,
    //        CancellationToken cancellationToken = default)
    //    {
    //        try
    //        {
    //            // Configure VAPID key explicitly for this request if available
    //            WebpushConfig webpushConfig = default!;
    //            if (!string.IsNullOrEmpty(_settings.VapidPublicKey) && !string.IsNullOrEmpty(_settings.VapidPrivateKey))
    //            {
    //                webpushConfig = new WebpushConfig
    //                {
    //                    Headers = new Dictionary<string, string>
    //                {
    //                    { "Urgency", "high" }
    //                },
    //                    Data = data,
    //                    Notification = new WebpushNotification
    //                    {
    //                        Title = title,
    //                        Body = body,
    //                        Icon = imageUrl
    //                    }
    //                };
    //            }

    //            // Create a message with full configuration
    //            var message = new MulticastMessage()
    //            {
    //                Tokens = tokenList,
    //                Notification = new Notification()
    //                {
    //                    Title = title,
    //                    Body = body,
    //                    ImageUrl = imageUrl
    //                },
    //                Data = data,
    //                // Configure Android specific options
    //                Android = new AndroidConfig()
    //                {
    //                    Priority = Priority.High,
    //                    Notification = new AndroidNotification()
    //                    {
    //                        Title = title,
    //                        Body = body,
    //                        ImageUrl = imageUrl,
    //                        ChannelId = "default",
    //                        Sound = "default"
    //                    }
    //                },
    //                // Configure Apple specific options
    //                Apns = new ApnsConfig()
    //                {
    //                    Aps = new Aps()
    //                    {
    //                        Alert = new ApsAlert()
    //                        {
    //                            Title = title,
    //                            Body = body
    //                        },
    //                        Sound = "default",
    //                        ContentAvailable = true,
    //                        Badge = 1,
    //                        MutableContent = true
    //                    },
    //                    Headers = new Dictionary<string, string>
    //                {
    //                    { "apns-priority", "10" },
    //                    { "apns-push-type", "alert" }
    //                },
    //                    FcmOptions = new ApnsFcmOptions
    //                    {
    //                        ImageUrl = imageUrl
    //                    }
    //                },
    //                // Configure Web specific options with VAPID
    //                Webpush = webpushConfig
    //            };

    //            // Use SendEachForMulticastAsync for more reliable delivery
    //            var response = await FirebaseMessaging.DefaultInstance.SendEachForMulticastAsync(message, cancellationToken);

    //            // Handle failed tokens
    //            if (response.FailureCount > 0)
    //            {
    //                List<string> tokensToRemove = new List<string>();

    //                for (int i = 0; i < response.Responses.Count; i++)
    //                {
    //                    var singleResponse = response.Responses[i];
    //                    if (!singleResponse.IsSuccess)
    //                    {
    //                        var token = tokenList[i];
    //                        var exception = singleResponse.Exception;

    //                        if (exception is FirebaseMessagingException fcmEx)
    //                        {
    //                            switch (fcmEx.MessagingErrorCode)
    //                            {
    //                                case MessagingErrorCode.Unregistered:
    //                                case MessagingErrorCode.InvalidArgument:
    //                                case MessagingErrorCode.SenderIdMismatch:
    //                                    tokensToRemove.Add(token);
    //                                    break;

    //                                case MessagingErrorCode.ThirdPartyAuthError:
    //                                    // Don't mark for automatic deactivation - we'll try another approach
    //                                    break;
    //                            }
    //                        }
    //                    }
    //                }

    //                // Remove invalid tokens in batch
    //                foreach (var token in tokensToRemove)
    //                {
    //                    await DeactivateTokenAsync(token, cancellationToken);
    //                }

    //                // For tokens that failed with ThirdPartyAuthError, try sending with platform-specific approach
    //                if (response.SuccessCount == 0)
    //                {
    //                    return await SendWithPlatformDetectionAsync(tokenList, title, body, data, imageUrl, cancellationToken);
    //                }
    //            }

    //            return response.SuccessCount > 0;
    //        }
    //        catch (Exception ex)
    //        {
    //            _logger.LogError(ex, "Failed to send multicast FCM notification");

    //            // If we get a 404 error, try sending messages individually as fallback
    //            if (ex.ToString().Contains("404") || ex.ToString().Contains("Not Found") || ex.ToString().Contains("Auth error"))
    //            {
    //                return await SendWithPlatformDetectionAsync(tokenList, title, body, data, imageUrl, cancellationToken);
    //            }

    //            return false;
    //        }
    //    }

    //    private async Task<bool> SendWithPlatformDetectionAsync(
    //        List<string> tokens,
    //        string title,
    //        string body,
    //        Dictionary<string, string>? data,
    //        string? imageUrl,
    //        CancellationToken cancellationToken)
    //    {
    //        int successCount = 0;

    //        foreach (var token in tokens)
    //        {
    //            try
    //            {
    //                // Determine token platform based on prefix or structure
    //                DevicePlatform platform = DetectTokenPlatform(token);

    //                // Create a message with platform-specific configuration only
    //                var message = new Message
    //                {
    //                    Token = token,
    //                    Notification = new Notification
    //                    {
    //                        Title = title,
    //                        Body = body,
    //                        ImageUrl = imageUrl
    //                    },
    //                    Data = data
    //                };

    //                // Apply platform-specific configurations
    //                switch (platform)
    //                {
    //                    case DevicePlatform.Android:
    //                        message.Android = new AndroidConfig
    //                        {
    //                            Priority = Priority.High,
    //                            Notification = new AndroidNotification
    //                            {
    //                                Title = title,
    //                                Body = body,
    //                                ImageUrl = imageUrl,
    //                                ChannelId = "default",
    //                                Sound = "default"
    //                            }
    //                        };
    //                        break;

    //                    case DevicePlatform.iOS:
    //                        message.Apns = new ApnsConfig
    //                        {
    //                            Headers = new Dictionary<string, string>
    //                        {
    //                            { "apns-priority", "10" },
    //                            { "apns-push-type", "alert" }
    //                        },
    //                            Aps = new Aps
    //                            {
    //                                Alert = new ApsAlert
    //                                {
    //                                    Title = title,
    //                                    Body = body
    //                                },
    //                                Sound = "default",
    //                                Badge = 1
    //                            }
    //                        };
    //                        break;

    //                    case DevicePlatform.Web:
    //                        if (!string.IsNullOrEmpty(_settings.VapidPublicKey) && !string.IsNullOrEmpty(_settings.VapidPrivateKey))
    //                        {
    //                            message.Webpush = new WebpushConfig
    //                            {
    //                                Headers = new Dictionary<string, string>
    //                            {
    //                                { "Urgency", "high" }
    //                            },
    //                                Notification = new WebpushNotification
    //                                {
    //                                    Title = title,
    //                                    Body = body,
    //                                    Icon = imageUrl
    //                                }
    //                            };
    //                        }
    //                        break;
    //                }

    //                var response = await FirebaseMessaging.DefaultInstance.SendAsync(message, cancellationToken);
    //                if (!string.IsNullOrEmpty(response))
    //                {
    //                    successCount++;
    //                }
    //            }
    //            catch (FirebaseMessagingException fcmEx)
    //            {
    //                if (fcmEx.MessagingErrorCode == MessagingErrorCode.Unregistered ||
    //                    fcmEx.MessagingErrorCode == MessagingErrorCode.InvalidArgument ||
    //                    fcmEx.MessagingErrorCode == MessagingErrorCode.SenderIdMismatch)
    //                {
    //                    await DeactivateTokenAsync(token, cancellationToken);
    //                }
    //            }
    //            catch
    //            {
    //                _logger.LogError("Error sending individual message to token {Token}", token);
    //            }
    //        }

    //        return successCount > 0;
    //    }

    //    private DevicePlatform DetectTokenPlatform(string token)
    //    {
    //        // FCM token format detection based on characteristics
    //        if (token.Contains(":"))
    //        {
    //            // Most Android tokens have a colon
    //            return DevicePlatform.Android;
    //        }
    //        else if (token.Length > 140)
    //        {
    //            // iOS APNs tokens are typically very long
    //            return DevicePlatform.iOS;
    //        }
    //        else
    //        {
    //            // Default to web for other formats
    //            return DevicePlatform.Web;
    //        }
    //    }

    //    public async Task<bool> SendNotificationToUserWithTranslationAsync(
    //        Guid userId,
    //        string notificationKey,
    //        UserNotificationType type,
    //        string languageCode = "en-US",
    //        Dictionary<string, object>? parameters = null,
    //        Dictionary<string, string>? data = null,
    //        string? imageUrl = null,
    //        string? relatedEntityId = null,
    //        string? relatedEntityType = null,
    //        CancellationToken cancellationToken = default)
    //    {
    //        try
    //        {
    //            // Get translated title and body
    //            var (title, body) = await _notificationMessageService.GetTranslatedNotificationAsync(
    //                notificationKey, languageCode, parameters, cancellationToken);

    //            // Get notification message template to get translation keys
    //            var notificationMessage = await _notificationMessageService.GetNotificationMessageAsync(notificationKey, cancellationToken);

    //            // Serialize translation parameters for storage 
    //            string? serializedParameters = null;
    //            if (parameters != null && parameters.Any())
    //            {
    //                serializedParameters = JsonSerializer.Serialize(parameters);
    //            }

    //            // Create notification with translation information
    //            var notification = new UserNotification(
    //                userId,
    //                title,
    //                body,
    //                type,
    //                data != null ? JsonSerializer.Serialize(data) : null,
    //                imageUrl,
    //                relatedEntityId,
    //                relatedEntityType,
    //                notificationKey,
    //                notificationMessage?.TitleTranslationKey,
    //                notificationMessage?.BodyTranslationKey,
    //                serializedParameters);

    //            await _notificationRepository.AddAsync(notification, cancellationToken);

    //            // Get active device tokens for user
    //            var userTokens = await _deviceTokenRepository.ListAsync(
    //                new GetActiveDeviceTokensByUserIdSpec(userId), cancellationToken);

    //            if (!userTokens.Any())
    //            {
    //                return true; // Still consider success since notification was saved
    //            }

    //            var tokens = userTokens.Select(t => t.Token).ToList();

    //            // Prepare notification data for client including translation info
    //            var notificationData = data ?? new Dictionary<string, string>();
    //            notificationData["notificationId"] = notification.Id.ToString();
    //            notificationData["type"] = type.ToString();
    //            notificationData["notificationKey"] = notificationKey;
    //            notificationData["languageCode"] = languageCode;

    //            if (notificationMessage != null)
    //            {
    //                notificationData["translationTitleKey"] = notificationMessage.TitleTranslationKey ?? string.Empty;
    //                notificationData["translationBodyKey"] = notificationMessage.BodyTranslationKey ?? string.Empty;
    //            }

    //            // Add original parameters for client re-translation
    //            if (!string.IsNullOrEmpty(serializedParameters))
    //                notificationData["translationParameters"] = serializedParameters;

    //            return await SendNotificationAsync(tokens, title, body, notificationData, imageUrl, cancellationToken);
    //        }
    //        catch (Exception ex)
    //        {
    //            _logger.LogError(ex, "Failed to send notification with translation to user: {UserId}, notificationKey: {NotificationKey}",
    //                userId, notificationKey);
    //            return false;
    //        }
    //    }

    //    public async Task<bool> RegisterDeviceTokenAsync(
    //        Guid userId,
    //        string token,
    //        DevicePlatform platform,
    //        string? deviceInfo = null,
    //        CancellationToken cancellationToken = default)
    //    {
    //        try
    //        {
    //            // Check if token already exists
    //            var existingToken = await _deviceTokenRepository.FirstOrDefaultAsync(
    //                new GetDeviceTokenByTokenSpec(token), cancellationToken);

    //            if (existingToken != null)
    //            {
    //                // Update existing token
    //                if (existingToken.UserId != userId)
    //                {
    //                    await _deviceTokenRepository.DeleteAsync(existingToken, cancellationToken);

    //                    var newToken = new UserDeviceToken(userId, token, platform, deviceInfo);
    //                    await _deviceTokenRepository.AddAsync(newToken, cancellationToken);
    //                }
    //            }
    //            else
    //            {
    //                // Create new token
    //                var deviceToken = new UserDeviceToken(userId, token, platform, deviceInfo);
    //                await _deviceTokenRepository.AddAsync(deviceToken, cancellationToken);
    //            }

    //            return true;
    //        }
    //        catch
    //        {
    //            _logger.LogError("Failed to register device token for user: {UserId}", userId);
    //            return false;
    //        }
    //    }

    //    public async Task<bool> UnregisterDeviceTokenAsync(
    //        string token,
    //        CancellationToken cancellationToken = default)
    //    {
    //        try
    //        {
    //            var deviceToken = await _deviceTokenRepository.FirstOrDefaultAsync(
    //                new GetDeviceTokenByTokenSpec(token), cancellationToken);

    //            if (deviceToken != null)
    //            {
    //                await _deviceTokenRepository.DeleteAsync(deviceToken, cancellationToken);
    //            }

    //            return true;
    //        }
    //        catch
    //        {
    //            _logger.LogError("Failed to unregister device token");
    //            return false;
    //        }
    //    }

    //    public async Task<bool> ValidateTokenAsync(
    //        string token,
    //        CancellationToken cancellationToken = default)
    //    {
    //        try
    //        {
    //            // Check if token format is valid
    //            if (string.IsNullOrEmpty(token) || token.Length < 10)
    //            {
    //                await DeactivateTokenAsync(token, cancellationToken);
    //                return false;
    //            }

    //            // Create a minimal message with just data payload
    //            var message = new Message()
    //            {
    //                Token = token,
    //                Data = new Dictionary<string, string>
    //            {
    //                { "type", "validation" },
    //                { "timestamp", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString() }
    //            },
    //            };

    //            // Add appropriate config based on token format
    //            var platform = DetectTokenPlatform(token);
    //            switch (platform)
    //            {
    //                case DevicePlatform.Android:
    //                    message.Android = new AndroidConfig
    //                    {
    //                        Priority = Priority.High,
    //                        DirectBootOk = true,
    //                        // Use data-only message for validation
    //                        Notification = null
    //                    };
    //                    break;
    //                case DevicePlatform.iOS:
    //                    message.Apns = new ApnsConfig
    //                    {
    //                        Headers = new Dictionary<string, string>
    //                    {
    //                        { "apns-priority", "5" },
    //                        { "apns-push-type", "background" }
    //                    },
    //                        Aps = new Aps
    //                        {
    //                            ContentAvailable = true
    //                        }
    //                    };
    //                    break;
    //                case DevicePlatform.Web:
    //                    if (!string.IsNullOrEmpty(_settings.VapidPublicKey) && !string.IsNullOrEmpty(_settings.VapidPrivateKey))
    //                    {
    //                        message.Webpush = new WebpushConfig
    //                        {
    //                            Headers = new Dictionary<string, string>
    //                        {
    //                            { "Urgency", "high" },
    //                            { "TTL", "86400" }
    //                        }
    //                        };
    //                    }
    //                    break;
    //            }

    //            try
    //            {
    //                var response = await FirebaseMessaging.DefaultInstance.SendAsync(message, cancellationToken);
    //                return true;
    //            }
    //            catch (FirebaseMessagingException ex)
    //            {
    //                if (ex.MessagingErrorCode == MessagingErrorCode.Unregistered ||
    //                    ex.MessagingErrorCode == MessagingErrorCode.InvalidArgument ||
    //                    ex.MessagingErrorCode == MessagingErrorCode.SenderIdMismatch ||
    //                    ex.MessagingErrorCode == MessagingErrorCode.ThirdPartyAuthError)
    //                {
    //                    await DeactivateTokenAsync(token, cancellationToken);
    //                }
    //                return false;
    //            }
    //        }
    //        catch
    //        {
    //            _logger.LogError("Error validating token");
    //            return false;
    //        }
    //    }

    //    private async Task DeactivateTokenAsync(string token, CancellationToken cancellationToken = default)
    //    {
    //        try
    //        {
    //            var deviceToken = await _deviceTokenRepository.FirstOrDefaultAsync(
    //                new GetDeviceTokenByTokenSpec(token), cancellationToken);

    //            if (deviceToken != null)
    //            {
    //                await _deviceTokenRepository.DeleteAsync(deviceToken, cancellationToken);
    //            }
    //        }
    //        catch
    //        {
    //            _logger.LogError("Failed to deactivate device token");
    //        }
    //    }
    //}
