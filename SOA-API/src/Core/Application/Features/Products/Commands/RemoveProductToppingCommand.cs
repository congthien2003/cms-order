using Application.Exceptions;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Products.Commands;

/// <summary>
/// Command to remove a topping from a product
/// </summary>
public record RemoveProductToppingCommand(Guid ProductId, Guid ToppingId) : IRequest<Result<bool>>;

public class RemoveProductToppingCommandHandler : IRequestHandler<RemoveProductToppingCommand, Result<bool>>
{
    private readonly IRepositoryManager _repositoryManager;

    public RemoveProductToppingCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<bool>> Handle(RemoveProductToppingCommand request, CancellationToken cancellationToken)
    {
        var product = await _repositoryManager.ProductRepository
            .GetWithDetailsAsync(request.ProductId, true, cancellationToken);

        if (product == null)
            throw new NotFoundException($"Product with ID {request.ProductId} not found", "PRODUCT.NOTFOUND");

        var productTopping = product.ProductToppings
            .FirstOrDefault(pt => pt.ToppingId == request.ToppingId);

        if (productTopping == null)
            throw new NotFoundException($"Topping with ID {request.ToppingId} is not assigned to this product", "PRODUCTTOPPING.NOTFOUND");

        product.ProductToppings.Remove(productTopping);
        await _repositoryManager.SaveAsync(cancellationToken);

        return Result<bool>.Success("Topping removed from product successfully", true);
    }
}
