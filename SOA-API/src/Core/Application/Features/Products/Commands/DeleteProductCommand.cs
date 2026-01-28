using Application.Exceptions;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Products.Commands;

/// <summary>
/// Command to delete a product (soft delete)
/// </summary>
public record DeleteProductCommand(Guid Id) : IRequest<Result<bool>>;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, Result<bool>>
{
    private readonly IRepositoryManager _repositoryManager;

    public DeleteProductCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<bool>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _repositoryManager.ProductRepository
            .GetByIdAsync(request.Id, true, cancellationToken);

        if (product == null)
            throw new NotFoundException($"Product with ID {request.Id} not found", "PRODUCT.NOTFOUND");

        await _repositoryManager.ProductRepository.DeleteAsync(product);
        await _repositoryManager.SaveAsync(cancellationToken);

        return Result<bool>.Success("Product deleted successfully", true);
    }
}
