using AutoMapper;
using MediatR;
using Application.Exceptions;
using Application.Features.Toppings.Models;
using Application.Models.Common;
using Domain.Repositories;

namespace Application.Features.Toppings.Queries;

public record GetToppingByIdQuery(Guid Id) : IRequest<Result<ToppingResponse>>;

public class GetToppingByIdQueryHandler : IRequestHandler<GetToppingByIdQuery, Result<ToppingResponse>>
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public GetToppingByIdQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<Result<ToppingResponse>> Handle(GetToppingByIdQuery request, CancellationToken cancellationToken)
    {
        var toppings = await _repositoryManager.Topping.FindByConditionAsync(
            t => t.Id == request.Id,
            trackChanges: false,
            cancellationToken
        );

        var topping = toppings.FirstOrDefault();

        if (topping == null)
        {
            throw new NotFoundException($"Topping with ID {request.Id} not found", "TOPPING_NOT_FOUND");
        }

        var response = _mapper.Map<ToppingResponse>(topping);
        return Result<ToppingResponse>.Success(null, response);
    }
}
