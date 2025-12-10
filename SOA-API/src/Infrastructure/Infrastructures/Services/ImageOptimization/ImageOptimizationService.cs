using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.PixelFormats;
using Application.Services.Interfaces.Infrastructure.ImageOpimization;

namespace Infrastructures.Services.ImageOptimization
{
    public class ImageOptimizationService : IImageOptimizationService
    {
        public async Task<Stream> OptimizeImageAsync(IFormFile file, int maxWidth = 1920, int maxHeight = 1080, int quality = 75)
        {
            using var inputStream = file.OpenReadStream();
            return await OptimizeImageAsync(inputStream, file.FileName, maxWidth, maxHeight, quality);
        }

        public async Task<Stream> OptimizeImageAsync(Stream imageStream, string fileName, int maxWidth = 1920, int maxHeight = 1080, int quality = 75)
        {
            var outputStream = new MemoryStream();

            try
            {
                using var image = await Image.LoadAsync(imageStream);
                
                // Apply optimizations before saving
                ApplyOptimizations(image, maxWidth, maxHeight);

                // Determine the best format and quality based on image characteristics
                var optimizationResult = DetermineOptimalFormat(image, fileName, quality);
                
                // Save with optimal settings
                await SaveOptimizedImage(image, outputStream, optimizationResult);

                outputStream.Position = 0;
                return outputStream;
            }
            catch (Exception ex)
            {
                outputStream.Dispose();
                throw new InvalidOperationException($"Failed to optimize image: {ex.Message}", ex);
            }
        }

        private void ApplyOptimizations(Image image, int maxWidth, int maxHeight)
        {
            // Resize if needed (maintains aspect ratio)
            if (image.Width > maxWidth || image.Height > maxHeight)
            {
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new Size(maxWidth, maxHeight),
                    Mode = ResizeMode.Max,
                    Sampler = KnownResamplers.Lanczos3 // High quality resampling
                }));
            }

            // Apply additional optimizations
            image.Mutate(x => x
                .AutoOrient() // Fix orientation based on EXIF data
            );
        }

        private OptimizationResult DetermineOptimalFormat(Image image, string fileName, int baseQuality)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            var hasTransparency = HasTransparency(image);
            var imageSize = image.Width * image.Height;

            // For images with transparency, prefer WebP or keep PNG
            if (hasTransparency)
            {
                return new OptimizationResult
                {
                    Format = ImageFormat.WebP,
                    Quality = Math.Max(baseQuality + 5, 80), // Slightly higher quality for transparency
                    Extension = ".webp",
                    ContentType = "image/webp"
                };
            }

            // For large images, use more aggressive compression
            var qualityAdjustment = imageSize > 1000000 ? -10 : 0; // 1MP threshold
            var adjustedQuality = Math.Max(baseQuality + qualityAdjustment, 65);

            // Choose format based on original and optimization goals
            return extension switch
            {
                ".png" => new OptimizationResult
                {
                    Format = ImageFormat.WebP,
                    Quality = adjustedQuality,
                    Extension = ".webp",
                    ContentType = "image/webp"
                },
                ".webp" => new OptimizationResult
                {
                    Format = ImageFormat.WebP,
                    Quality = adjustedQuality,
                    Extension = ".webp",
                    ContentType = "image/webp"
                },
                _ => new OptimizationResult // JPEG and others
                {
                    Format = ImageFormat.JPEG,
                    Quality = adjustedQuality,
                    Extension = ".jpg",
                    ContentType = "image/jpeg"
                }
            };
        }

        private async Task SaveOptimizedImage(Image image, Stream outputStream, OptimizationResult result)
        {
            switch (result.Format)
            {
                case ImageFormat.WebP:
                    await image.SaveAsync(outputStream, new WebpEncoder
                    {
                        Quality = result.Quality,
                        Method = WebpEncodingMethod.BestQuality,
                        NearLossless = false // For maximum compression
                    });
                    break;

                case ImageFormat.JPEG:
                    await image.SaveAsync(outputStream, new JpegEncoder
                    {
                        Quality = result.Quality
                    });
                    break;

                case ImageFormat.PNG:
                    await image.SaveAsync(outputStream, new PngEncoder
                    {
                        CompressionLevel = PngCompressionLevel.BestCompression,
                        TransparentColorMode = PngTransparentColorMode.Preserve
                    });
                    break;
            }
        }

        private bool HasTransparency(Image image)
        {
            try
            {
                // Check if the image format supports transparency
                var extension = Path.GetExtension(image.Metadata.DecodedImageFormat?.Name ?? "").ToLowerInvariant();
                
                // Only PNG and WebP commonly have transparency in our use case
                if (extension != "png" && extension != "webp")
                {
                    return false;
                }

                // Check if image has alpha channel
                return image.PixelType.AlphaRepresentation != PixelAlphaRepresentation.None;
            }
            catch
            {
                // If we can't determine transparency, assume false for safety
                return false;
            }
        }

        private class OptimizationResult
        {
            public ImageFormat Format { get; set; }
            public int Quality { get; set; }
            public string Extension { get; set; } = "";
            public string ContentType { get; set; } = "";
        }

        private enum ImageFormat
        {
            JPEG,
            WebP,
            PNG
        }
    }
} 