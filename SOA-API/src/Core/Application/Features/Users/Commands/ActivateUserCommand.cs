using Application.Models.Common;
using Domain.Repositories;
using MediatR;
using Application.Exceptions;

namespace Application.Features.Users.Commands
{
    public class ActivateUserCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }

        public ActivateUserCommand(Guid id)
        {
            Id = id;
        }
    }

    public class ActivateUserCommandHandler : IRequestHandler<ActivateUserCommand, Result<bool>>
    {
        private readonly IRepositoryManager _repositoryManager;

        public ActivateUserCommandHandler(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<bool>> Handle(ActivateUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _repositoryManager.UserRepository.GetByIdAsync(request.Id, true, cancellationToken);
            if (user == null)
                throw new NotFoundException("User not found", "NOT-FOUND");
            
            user.SetActive(true);
            await _repositoryManager.UserRepository.UpdateAsync(user);
            await _repositoryManager.SaveAsync(cancellationToken);
            return Result<bool>.Success("Activate user successful", true);
        }
    }
}
