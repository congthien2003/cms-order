using Application.Exceptions;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Products.Commands;

/// <summary>
/// Command to toggle the active status of a product
/// </summary>
public record ToggleProductStatusCommand(Guid Id) : IRequest<Result<bool>>;

public class ToggleProductStatusCommandHandler : IRequestHandler<ToggleProductStatusCommand, Result<bool>>
{
    private readonly IRepositoryManager _repositoryManager;

    public ToggleProductStatusCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<bool>> Handle(ToggleProductStatusCommand request, CancellationToken cancellationToken)
    {
        var product = await _repositoryManager.ProductRepository
            .GetByIdAsync(request.Id, true, cancellationToken);

        if (product == null)
            throw new NotFoundException($"Product with ID {request.Id} not found", "PRODUCT.NOTFOUND");

        product.ToggleStatus();

        await _repositoryManager.SaveAsync(cancellationToken);

        var statusText = product.IsActive ? "activated" : "deactivated";
        return Result<bool>.Success($"Product {statusText} successfully", product.IsActive);
    }
}
