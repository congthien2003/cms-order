using Application.Exceptions;
using Application.Features.Products.Models;
using Application.Models.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Products.Commands;

/// <summary>
/// Command to add a topping to a product
/// </summary>
public record AddProductToppingCommand(Guid ProductId, ProductToppingRequest Request) : IRequest<Result<ProductToppingResponse>>;

public class AddProductToppingCommandHandler : IRequestHandler<AddProductToppingCommand, Result<ProductToppingResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public AddProductToppingCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<ProductToppingResponse>> Handle(AddProductToppingCommand request, CancellationToken cancellationToken)
    {
        var product = await _repositoryManager.ProductRepository
            .GetWithDetailsAsync(request.ProductId, true, cancellationToken);

        if (product == null)
            throw new NotFoundException($"Product with ID {request.ProductId} not found", "PRODUCT.NOTFOUND");

        // Check if topping exists
        var topping = await _repositoryManager.ToppingRepository
            .GetByIdAsync(request.Request.ToppingId, false, cancellationToken);

        if (topping == null)
            throw new NotFoundException($"Topping with ID {request.Request.ToppingId} not found", "TOPPING.NOTFOUND");

        // Check if topping is already assigned to this product
        if (product.ProductToppings.Any(pt => pt.ToppingId == request.Request.ToppingId))
            throw new ConflictException($"Topping '{topping.Name}' is already assigned to this product", "PRODUCTTOPPING.ALREADY_EXISTS");

        var productTopping = new ProductTopping(
            request.ProductId,
            request.Request.ToppingId,
            request.Request.IsDefault
        );

        product.ProductToppings.Add(productTopping);
        await _repositoryManager.SaveAsync(cancellationToken);

        var response = new ProductToppingResponse
        {
            ToppingId = topping.Id,
            ToppingName = topping.Name,
            Price = topping.Price,
            IsDefault = productTopping.IsDefault,
            ImageUrl = topping.ImageUrl
        };

        return Result<ProductToppingResponse>.Success("Topping added to product successfully", response);
    }
}
