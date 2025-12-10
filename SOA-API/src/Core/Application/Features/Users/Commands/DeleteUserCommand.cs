using Application.Models.Common;
using Domain.Repositories;
using MediatR;
using Application.Exceptions;

namespace Application.Features.Users.Commands
{
    public class DeleteUserCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }

        public DeleteUserCommand(Guid id)
        {
            Id = id;
        }
    }

    public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Result<bool>>
    {
        private readonly IRepositoryManager _repositoryManager;

        public DeleteUserCommandHandler(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<bool>> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _repositoryManager.UserRepository.GetByIdAsync(request.Id, true, cancellationToken);
            if (user == null)
                throw new NotFoundException("User not found", "NOT-FOUND");

            await _repositoryManager.UserRepository.DeleteAsync(user);
            await _repositoryManager.SaveAsync(cancellationToken);
            return Result<bool>.Success("Delete user successful", true);
        }
    }
}
