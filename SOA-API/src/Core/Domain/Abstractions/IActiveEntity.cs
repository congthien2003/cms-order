using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Abstractions
{
    /// <summary>
    /// Interface provide to manage user activity staus
    /// - True: Active
    /// - False: Blocked
    /// </summary>
    public interface IActiveEntity
    {
        public bool IsActive { get; }
        void SetActive(bool isActive);
    }
}
