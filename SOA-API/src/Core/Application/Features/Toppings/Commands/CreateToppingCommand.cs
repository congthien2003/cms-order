using MapsterMapper;
using MediatR;
using Application.Features.Toppings.Models;
using Application.Models.Common;
using Domain.Entities;
using Domain.Repositories;

namespace Application.Features.Toppings.Commands;

public record CreateToppingCommand(CreateToppingRequest Request) : IRequest<Result<ToppingResponse>>;

public class CreateToppingCommandHandler : IRequestHandler<CreateToppingCommand, Result<ToppingResponse>>
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public CreateToppingCommandHandler(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<Result<ToppingResponse>> Handle(CreateToppingCommand request, CancellationToken cancellationToken)
    {
        var topping = _mapper.Map<Topping>(request.Request);

        await _repositoryManager.Topping.AddAsync(topping);
        await _repositoryManager.SaveAsync(cancellationToken);

        var response = _mapper.Map<ToppingResponse>(topping);
        return Result<ToppingResponse>.Success("Topping created successfully", response);
    }
}
