using Application.Features.Products.Models;
using Application.Models.Common;
using Domain.Repositories;
using MapsterMapper;
using MediatR;

namespace Application.Features.Products.Queries;

/// <summary>
/// Query parameters for getting products list
/// </summary>
public class GetProductsListParameters : GetListParameters
{
    public Guid? CategoryId { get; set; }
    public bool? IsActive { get; set; }
}

/// <summary>
/// Query to retrieve a paginated list of products
/// </summary>
public record GetProductsListQuery(GetProductsListParameters Parameters) : IRequest<Result<PagedResult<ProductResponse>>>;

public class GetProductsListQueryHandler : IRequestHandler<GetProductsListQuery, Result<PagedResult<ProductResponse>>>
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public GetProductsListQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<Result<PagedResult<ProductResponse>>> Handle(GetProductsListQuery request, CancellationToken cancellationToken)
    {
        var (products, totalCount) = await _repositoryManager.ProductRepository.GetListAsync(
            request.Parameters.Page,
            request.Parameters.PageSize,
            request.Parameters.SearchTerm,
            request.Parameters.CategoryId,
            request.Parameters.IsActive,
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
            request.Parameters.Page,
            request.Parameters.PageSize,
            (int)Math.Ceiling(totalCount / (double)request.Parameters.PageSize)
        );

        return Result<PagedResult<ProductResponse>>.Success("Products retrieved successfully", result);
    }
}
