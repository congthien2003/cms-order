using MapsterMapper;
using MediatR;
using Application.Features.Toppings.Models;
using Application.Models.Common;
using Domain.Repositories;

namespace Application.Features.Toppings.Queries;

public record GetToppingsListQuery(
    bool? IsActive = null,
    string? SearchTerm = null,
    int PageNumber = 1,
    int PageSize = 50
) : IRequest<Result<PagedList<ToppingResponse>>>;

public class GetToppingsListQueryHandler : IRequestHandler<GetToppingsListQuery, Result<PagedList<ToppingResponse>>>
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public GetToppingsListQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<Result<PagedList<ToppingResponse>>> Handle(GetToppingsListQuery request, CancellationToken cancellationToken)
    {
        var toppings = await _repositoryManager.Topping.GetAllAsync(trackChanges: false, cancellationToken);

        // Filter by active status
        var filteredToppings = toppings.AsQueryable();
        if (request.IsActive.HasValue)
        {
            filteredToppings = filteredToppings.Where(t => t.IsActive == request.IsActive.Value);
        }

        // Search by name
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            filteredToppings = filteredToppings.Where(t => t.Name.ToLower().Contains(request.SearchTerm.ToLower()));
        }

        // Order by sort order then by name
        filteredToppings = filteredToppings.OrderBy(t => t.SortOrder).ThenBy(t => t.Name);

        var totalCount = filteredToppings.Count();
        var pagedToppings = filteredToppings
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        var toppingResponses = _mapper.Map<List<ToppingResponse>>(pagedToppings);

        var pagedList = new PagedList<ToppingResponse>(
            toppingResponses,
            totalCount,
            request.PageNumber,
            request.PageSize
        );

        return Result<PagedList<ToppingResponse>>.Success(null, pagedList);
    }
}
