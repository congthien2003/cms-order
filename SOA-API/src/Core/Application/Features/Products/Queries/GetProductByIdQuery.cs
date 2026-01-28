using Application.Exceptions;
using Application.Features.Products.Models;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Products.Queries;

/// <summary>
/// Query to retrieve a product by ID with all details (sizes, toppings)
/// </summary>
public record GetProductByIdQuery(Guid Id) : IRequest<Result<ProductDetailResponse>>;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, Result<ProductDetailResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public GetProductByIdQueryHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<ProductDetailResponse>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _repositoryManager.ProductRepository
            .GetWithDetailsAsync(request.Id, false, cancellationToken);

        if (product == null)
            throw new NotFoundException($"Product with ID {request.Id} not found", "PRODUCT.NOTFOUND");

        var response = new ProductDetailResponse
        {
            Id = product.Id,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name ?? string.Empty,
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

        return Result<ProductDetailResponse>.Success("Product retrieved successfully", response);
    }
}
