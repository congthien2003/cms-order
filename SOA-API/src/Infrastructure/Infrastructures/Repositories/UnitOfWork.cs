using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructures.Repositories
{
    public class UnitOfWork
    {
        private readonly ApplicationDbContext _dbContext;
        private IDbContextTransaction? _currentTransaction;

        public UnitOfWork(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
        {
            // Nếu đã có transaction thì không tạo mới
            if (_currentTransaction != null)
                return;

            _currentTransaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);
        }

        public async Task<int> CommitAsync(CancellationToken cancellationToken = default)
        {
            if (_currentTransaction == null)
            {
                // Không có transaction => chỉ SaveChanges
                return await _dbContext.SaveChangesAsync(cancellationToken);
            }
            else
            {
                // Có transaction => SaveChanges và Commit
                try
                {
                    var result = await _dbContext.SaveChangesAsync(cancellationToken);
                    await _currentTransaction.CommitAsync(cancellationToken);
                    return result;
                }
                finally
                {
                    await _currentTransaction.DisposeAsync();
                    _currentTransaction = null;
                }
            }
        }

        public async Task RollbackAsync(CancellationToken cancellationToken = default)
        {
            if (_currentTransaction == null) return;

            await _currentTransaction.RollbackAsync(cancellationToken);
            await _currentTransaction.DisposeAsync();
            _currentTransaction = null;
        }

        public void Dispose()
        {
            _currentTransaction?.Dispose();
            _dbContext.Dispose();
        }
    }
}
