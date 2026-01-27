using AutoMapper;
using MediatR;
using Application.Exceptions;
using Application.Features.Toppings.Models;
using Application.Models.Common;
using Domain.Repositories;

namespace Application.Features.Toppings.Commands;

public record UpdateToppingCommand(Guid Id, UpdateToppingRequest Request) : IRequest<Result<ToppingResponse>>;

public class UpdateToppingCommandHandler : IRequestHandler<UpdateToppingCommand, Result<ToppingResponse>>
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public UpdateToppingCommandHandler(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<Result<ToppingResponse>> Handle(UpdateToppingCommand request, CancellationToken cancellationToken)
    {
        var toppings = await _repositoryManager.Topping.FindByConditionAsync(
            t => t.Id == request.Id,
            trackChanges: true,
            cancellationToken
        );

        var topping = toppings.FirstOrDefault();

        if (topping == null)
        {
            throw new NotFoundException($"Topping with ID {request.Id} not found", "TOPPING_NOT_FOUND");
        }

        _mapper.Map(request.Request, topping);
        topping.UpdatedAt = DateTime.UtcNow;

        await _repositoryManager.SaveAsync(cancellationToken);

        var response = _mapper.Map<ToppingResponse>(topping);
        return Result<ToppingResponse>.Success("Topping updated successfully", response);
    }
}
