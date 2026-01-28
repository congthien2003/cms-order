using Application.Exceptions;
using Application.Features.Products.Models;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Products.Commands;

/// <summary>
/// Command to update a product size
/// </summary>
public record UpdateProductSizeCommand(Guid ProductId, Guid SizeId, UpdateProductSizeRequest Request) : IRequest<Result<ProductSizeResponse>>;

public class UpdateProductSizeCommandHandler : IRequestHandler<UpdateProductSizeCommand, Result<ProductSizeResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public UpdateProductSizeCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<ProductSizeResponse>> Handle(UpdateProductSizeCommand request, CancellationToken cancellationToken)
    {
        var product = await _repositoryManager.ProductRepository
            .GetWithDetailsAsync(request.ProductId, true, cancellationToken);

        if (product == null)
            throw new NotFoundException($"Product with ID {request.ProductId} not found", "PRODUCT.NOTFOUND");

        var size = product.Sizes.FirstOrDefault(s => s.Id == request.SizeId);
        if (size == null)
            throw new NotFoundException($"Product size with ID {request.SizeId} not found", "PRODUCTSIZE.NOTFOUND");

        // Check if another size with the same name exists (excluding current)
        if (product.Sizes.Any(s => s.Id != request.SizeId && 
            s.SizeName.Equals(request.Request.SizeName, StringComparison.OrdinalIgnoreCase)))
            throw new ConflictException($"Size '{request.Request.SizeName}' already exists for this product", "PRODUCTSIZE.NAME_EXISTS");

        // Handle default flag changes
        if (request.Request.IsDefault && !size.IsDefault)
        {
            // Unset any existing default
            foreach (var existingSize in product.Sizes.Where(s => s.IsDefault))
            {
                existingSize.UnsetDefault();
            }
        }

        // Update size details
        size.UpdateDetails(
            request.Request.SizeName,
            request.Request.PriceAdjustment,
            request.Request.IsDefault
        );

        await _repositoryManager.SaveAsync(cancellationToken);

        var response = new ProductSizeResponse
        {
            Id = size.Id,
            SizeName = size.SizeName,
            PriceAdjustment = size.PriceAdjustment,
            IsDefault = size.IsDefault,
            IsActive = size.IsActive
        };

        return Result<ProductSizeResponse>.Success("Product size updated successfully", response);
    }
}
