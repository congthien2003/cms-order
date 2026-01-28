using Application.Exceptions;
using Application.Features.Products.Models;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Products.Commands;

/// <summary>
/// Command to update an existing product
/// </summary>
public record UpdateProductCommand(Guid Id, UpdateProductRequest Request) : IRequest<Result<ProductDetailResponse>>;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, Result<ProductDetailResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public UpdateProductCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<ProductDetailResponse>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        // Get product with tracking
        var product = await _repositoryManager.ProductRepository
            .GetWithDetailsAsync(request.Id, true, cancellationToken);

        if (product == null)
            throw new NotFoundException($"Product with ID {request.Id} not found", "PRODUCT.NOTFOUND");

        // Check if category exists
        var category = await _repositoryManager.CategoryRepository
            .GetByIdAsync(request.Request.CategoryId, false, cancellationToken);

        if (category == null)
            throw new NotFoundException($"Category with ID {request.Request.CategoryId} not found", "CATEGORY.NOTFOUND");

        // Check if product name already exists (excluding current product)
        var existsByName = await _repositoryManager.ProductRepository
            .ExistsByNameAsync(request.Request.Name, request.Id, cancellationToken);

        if (existsByName)
            throw new ConflictException($"Product with name '{request.Request.Name}' already exists", "PRODUCT.NAME_EXISTS");

        // Update product details
        product.UpdateDetails(
            request.Request.Name,
            request.Request.BasePrice,
            request.Request.Description,
            request.Request.ImageUrl,
            request.Request.SortOrder
        );

        // Update category if changed
        if (product.CategoryId != request.Request.CategoryId)
        {
            product.ChangeCategory(request.Request.CategoryId);
        }

        await _repositoryManager.SaveAsync(cancellationToken);

        var response = new ProductDetailResponse
        {
            Id = product.Id,
            CategoryId = product.CategoryId,
            CategoryName = category.Name,
            Name = product.Name,
            Description = product.Description,
            ImageUrl = product.ImageUrl,
            BasePrice = product.BasePrice,
            IsActive = product.IsActive,
            SortOrder = product.SortOrder,
            CreatedDate = product.CreatedAt,
            ModifiedDate = product.UpdatedAt,
            Sizes = product.Sizes.Select(s => new ProductSizeResponse
            {
                Id = s.Id,
                SizeName = s.SizeName,
                PriceAdjustment = s.PriceAdjustment,
                IsDefault = s.IsDefault,
                IsActive = s.IsActive
            }).ToList(),
            AvailableToppings = product.ProductToppings.Select(pt => new ProductToppingResponse
            {
                ToppingId = pt.ToppingId,
                ToppingName = pt.Topping?.Name ?? string.Empty,
                Price = pt.Topping?.Price ?? 0,
                IsDefault = pt.IsDefault,
                ImageUrl = pt.Topping?.ImageUrl
            }).ToList()
        };

        return Result<ProductDetailResponse>.Success("Product updated successfully", response);
    }
}
