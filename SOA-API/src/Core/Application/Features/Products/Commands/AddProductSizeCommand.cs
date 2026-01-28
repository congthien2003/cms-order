using Application.Exceptions;
using Application.Features.Products.Models;
using Application.Models.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Products.Commands;

/// <summary>
/// Command to add a size to a product
/// </summary>
public record AddProductSizeCommand(Guid ProductId, CreateProductSizeRequest Request) : IRequest<Result<ProductSizeResponse>>;

public class AddProductSizeCommandHandler : IRequestHandler<AddProductSizeCommand, Result<ProductSizeResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public AddProductSizeCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<ProductSizeResponse>> Handle(AddProductSizeCommand request, CancellationToken cancellationToken)
    {
        var product = await _repositoryManager.ProductRepository
            .GetWithDetailsAsync(request.ProductId, true, cancellationToken);

        if (product == null)
            throw new NotFoundException($"Product with ID {request.ProductId} not found", "PRODUCT.NOTFOUND");

        // Check if size name already exists for this product
        if (product.Sizes.Any(s => s.SizeName.Equals(request.Request.SizeName, StringComparison.OrdinalIgnoreCase)))
            throw new ConflictException($"Size '{request.Request.SizeName}' already exists for this product", "PRODUCTSIZE.NAME_EXISTS");

        // If this is the first size or marked as default, handle default flag
        var isDefault = request.Request.IsDefault || !product.Sizes.Any();
        
        if (isDefault)
        {
            // Unset any existing default
            foreach (var existingSize in product.Sizes.Where(s => s.IsDefault))
            {
                existingSize.UnsetDefault();
            }
        }

        var size = new ProductSize(
            request.ProductId,
            request.Request.SizeName,
            request.Request.PriceAdjustment,
            isDefault
        );

        product.Sizes.Add(size);
        await _repositoryManager.SaveAsync(cancellationToken);

        var response = new ProductSizeResponse
        {
            Id = size.Id,
            SizeName = size.SizeName,
            PriceAdjustment = size.PriceAdjustment,
            IsDefault = size.IsDefault,
            IsActive = size.IsActive
        };

        return Result<ProductSizeResponse>.Success("Product size added successfully", response);
    }
}
