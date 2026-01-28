using Application.Exceptions;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Products.Commands;

/// <summary>
/// Command to delete a product size
/// </summary>
public record DeleteProductSizeCommand(Guid ProductId, Guid SizeId) : IRequest<Result<bool>>;

public class DeleteProductSizeCommandHandler : IRequestHandler<DeleteProductSizeCommand, Result<bool>>
{
    private readonly IRepositoryManager _repositoryManager;

    public DeleteProductSizeCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<bool>> Handle(DeleteProductSizeCommand request, CancellationToken cancellationToken)
    {
        var product = await _repositoryManager.ProductRepository
            .GetWithDetailsAsync(request.ProductId, true, cancellationToken);

        if (product == null)
            throw new NotFoundException($"Product with ID {request.ProductId} not found", "PRODUCT.NOTFOUND");

        var size = product.Sizes.FirstOrDefault(s => s.Id == request.SizeId);
        if (size == null)
            throw new NotFoundException($"Product size with ID {request.SizeId} not found", "PRODUCTSIZE.NOTFOUND");

        // If deleting the default size and there are other sizes, make another one default
        if (size.IsDefault && product.Sizes.Count > 1)
        {
            var newDefault = product.Sizes.FirstOrDefault(s => s.Id != request.SizeId);
            newDefault?.SetAsDefault();
        }

        product.Sizes.Remove(size);
        await _repositoryManager.SaveAsync(cancellationToken);

        return Result<bool>.Success("Product size deleted successfully", true);
    }
}
