using Application.Exceptions;
using Application.Features.Products.Models;
using Application.Models.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Products.Commands;

/// <summary>
/// Command to bulk update product toppings (replace all toppings)
/// </summary>
public record UpdateProductToppingsCommand(Guid ProductId, UpdateProductToppingsRequest Request) : IRequest<Result<IReadOnlyList<ProductToppingResponse>>>;

public class UpdateProductToppingsCommandHandler : IRequestHandler<UpdateProductToppingsCommand, Result<IReadOnlyList<ProductToppingResponse>>>
{
    private readonly IRepositoryManager _repositoryManager;

    public UpdateProductToppingsCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<IReadOnlyList<ProductToppingResponse>>> Handle(UpdateProductToppingsCommand request, CancellationToken cancellationToken)
    {
        var product = await _repositoryManager.ProductRepository
            .GetWithDetailsAsync(request.ProductId, true, cancellationToken);

        if (product == null)
            throw new NotFoundException($"Product with ID {request.ProductId} not found", "PRODUCT.NOTFOUND");

        // Validate all toppings exist
        var toppingIds = request.Request.Toppings.Select(t => t.ToppingId).Distinct().ToList();
        var toppings = await _repositoryManager.ToppingRepository
            .FindByConditionAsync(t => toppingIds.Contains(t.Id), false, cancellationToken);

        var foundToppingIds = toppings.Select(t => t.Id).ToHashSet();
        var missingToppingIds = toppingIds.Where(id => !foundToppingIds.Contains(id)).ToList();

        if (missingToppingIds.Any())
            throw new NotFoundException($"Toppings with IDs {string.Join(", ", missingToppingIds)} not found", "TOPPING.NOTFOUND");

        // Clear existing toppings
        product.ProductToppings.Clear();

        // Add new toppings
        foreach (var toppingRequest in request.Request.Toppings)
        {
            var productTopping = new ProductTopping(
                request.ProductId,
                toppingRequest.ToppingId,
                toppingRequest.IsDefault
            );
            product.ProductToppings.Add(productTopping);
        }

        await _repositoryManager.SaveAsync(cancellationToken);

        // Build response with topping details
        var toppingDict = toppings.ToDictionary(t => t.Id);
        var response = product.ProductToppings.Select(pt =>
        {
            toppingDict.TryGetValue(pt.ToppingId, out var topping);
            return new ProductToppingResponse
            {
                ToppingId = pt.ToppingId,
                ToppingName = topping?.Name ?? string.Empty,
                Price = topping?.Price ?? 0,
                IsDefault = pt.IsDefault,
                ImageUrl = topping?.ImageUrl
            };
        }).ToList();

        return Result<IReadOnlyList<ProductToppingResponse>>.Success("Product toppings updated successfully", response);
    }
}
