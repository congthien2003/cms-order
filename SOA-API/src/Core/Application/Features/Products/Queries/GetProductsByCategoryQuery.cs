using Application.Features.Products.Models;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Products.Queries;

/// <summary>
/// Query to retrieve products by category ID
/// </summary>
public record GetProductsByCategoryQuery(Guid CategoryId, int Page = 1, int PageSize = 20, string? SearchTerm = null) 
    : IRequest<Result<PagedResult<ProductResponse>>>;

public class GetProductsByCategoryQueryHandler : IRequestHandler<GetProductsByCategoryQuery, Result<PagedResult<ProductResponse>>>
{
    private readonly IRepositoryManager _repositoryManager;

    public GetProductsByCategoryQueryHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<PagedResult<ProductResponse>>> Handle(GetProductsByCategoryQuery request, CancellationToken cancellationToken)
    {
        var (products, totalCount) = await _repositoryManager.ProductRepository.GetByCategoryAsync(
            request.CategoryId,
            request.Page,
            request.PageSize,
            request.SearchTerm,
            false,
            cancellationToken);

        var mappedProducts = products.Select(p => new ProductResponse
        {
            Id = p.Id,
            CategoryId = p.CategoryId,
            CategoryName = p.Category?.Name ?? string.Empty,
            Name = p.Name,
            Description = p.Description,
            ImageUrl = p.ImageUrl,
            BasePrice = p.BasePrice,
            IsActive = p.IsActive,
            SortOrder = p.SortOrder,
            CreatedDate = p.CreatedAt,
            ModifiedDate = p.UpdatedAt
        }).ToList();

        var result = new PagedResult<ProductResponse>(
            mappedProducts,
            totalCount,
            request.Page,
            request.PageSize,
            (int)Math.Ceiling(totalCount / (double)request.PageSize)
        );

        return Result<PagedResult<ProductResponse>>.Success("Products retrieved successfully", result);
    }
}
