using Application.Exceptions;
using Application.Features.Products.Models;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Products.Queries;

/// <summary>
/// Query to get available toppings for a product
/// </summary>
public record GetProductToppingsQuery(Guid ProductId) : IRequest<Result<IReadOnlyList<ProductToppingResponse>>>;

public class GetProductToppingsQueryHandler : IRequestHandler<GetProductToppingsQuery, Result<IReadOnlyList<ProductToppingResponse>>>
{
    private readonly IRepositoryManager _repositoryManager;

    public GetProductToppingsQueryHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<IReadOnlyList<ProductToppingResponse>>> Handle(GetProductToppingsQuery request, CancellationToken cancellationToken)
    {
        var product = await _repositoryManager.ProductRepository
            .GetWithDetailsAsync(request.ProductId, false, cancellationToken);

        if (product == null)
            throw new NotFoundException($"Product with ID {request.ProductId} not found", "PRODUCT.NOTFOUND");

        var toppings = product.ProductToppings.Select(pt => new ProductToppingResponse
        {
            ToppingId = pt.ToppingId,
            ToppingName = pt.Topping?.Name ?? string.Empty,
            Price = pt.Topping?.Price ?? 0,
            IsDefault = pt.IsDefault,
            ImageUrl = pt.Topping?.ImageUrl
        }).ToList();

        return Result<IReadOnlyList<ProductToppingResponse>>.Success("Product toppings retrieved successfully", toppings);
    }
}
