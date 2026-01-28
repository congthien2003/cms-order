using Application.Exceptions;
using Application.Features.Products.Models;
using Application.Models.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Products.Commands;

/// <summary>
/// Command to create a new product
/// </summary>
public record CreateProductCommand(CreateProductRequest Request) : IRequest<Result<ProductDetailResponse>>;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Result<ProductDetailResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public CreateProductCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<ProductDetailResponse>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        // Check if category exists
        var category = await _repositoryManager.CategoryRepository
            .GetByIdAsync(request.Request.CategoryId, false, cancellationToken);

        if (category == null)
            throw new NotFoundException($"Category with ID {request.Request.CategoryId} not found", "CATEGORY.NOTFOUND");

        // Check if product name already exists
        var existsByName = await _repositoryManager.ProductRepository
            .ExistsByNameAsync(request.Request.Name, null, cancellationToken);

        if (existsByName)
            throw new ConflictException($"Product with name '{request.Request.Name}' already exists", "PRODUCT.NAME_EXISTS");

        // Create product
        var product = new Product(
            request.Request.CategoryId,
            request.Request.Name,
            request.Request.BasePrice,
            request.Request.Description,
            request.Request.ImageUrl,
            request.Request.SortOrder
        );

        await _repositoryManager.ProductRepository.AddAsync(product);

        // Create sizes if provided
        if (request.Request.Sizes != null && request.Request.Sizes.Any())
        {
            // Ensure at least one default size
            var hasDefault = request.Request.Sizes.Any(s => s.IsDefault);
            var isFirst = true;

            foreach (var sizeRequest in request.Request.Sizes)
            {
                var size = new ProductSize(
                    product.Id,
                    sizeRequest.SizeName,
                    sizeRequest.PriceAdjustment,
                    hasDefault ? sizeRequest.IsDefault : isFirst // Make first one default if none specified
                );

                product.Sizes.Add(size);
                isFirst = false;
            }
        }

        await _repositoryManager.SaveAsync(cancellationToken);

        // Load the created product with details
        var createdProduct = await _repositoryManager.ProductRepository
            .GetWithDetailsAsync(product.Id, false, cancellationToken);

        var response = new ProductDetailResponse
        {
            Id = createdProduct!.Id,
            CategoryId = createdProduct.CategoryId,
            CategoryName = category.Name,
            Name = createdProduct.Name,
            Description = createdProduct.Description,
            ImageUrl = createdProduct.ImageUrl,
            BasePrice = createdProduct.BasePrice,
            IsActive = createdProduct.IsActive,
            SortOrder = createdProduct.SortOrder,
            CreatedDate = createdProduct.CreatedAt,
            ModifiedDate = createdProduct.UpdatedAt,
            Sizes = createdProduct.Sizes.Select(s => new ProductSizeResponse
            {
                Id = s.Id,
                SizeName = s.SizeName,
                PriceAdjustment = s.PriceAdjustment,
                IsDefault = s.IsDefault,
                IsActive = s.IsActive
            }).ToList(),
            AvailableToppings = new List<ProductToppingResponse>()
        };

        return Result<ProductDetailResponse>.Success("Product created successfully", response);
    }
}
