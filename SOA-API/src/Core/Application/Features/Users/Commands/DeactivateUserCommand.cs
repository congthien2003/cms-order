using Application.Models.Common;
using Domain.Repositories;
using MediatR;
using Application.Exceptions;

namespace Application.Features.Users.Commands
{
    public class DeactivateUserCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }

        public DeactivateUserCommand(Guid id)
        {
            Id = id;
        }
    }

    public class DeactivateUserCommandHandler : IRequestHandler<DeactivateUserCommand, Result<bool>>
    {
        private readonly IRepositoryManager _repositoryManager;

        public DeactivateUserCommandHandler(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<bool>> Handle(DeactivateUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _repositoryManager.UserRepository.GetByIdAsync(request.Id, true, cancellationToken);
            if (user == null)
                throw new NotFoundException("User not found", "NOT-FOUND");
            
            user.SetActive(false);
            await _repositoryManager.UserRepository.UpdateAsync(user);
            await _repositoryManager.SaveAsync(cancellationToken);
            return Result<bool>.Success("Deactivate user successful", true);
        }
    }
}
