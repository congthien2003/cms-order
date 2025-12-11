using Domain.Abstractions;
using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    /// <summary>
    /// Category entity representing a product category in the domain.
    /// Follows DDD principles with business logic encapsulation.
    /// </summary>
    public class Category : BaseEntity
    {
        /// <summary>
        /// Gets the category name.
        /// </summary>
        public string Name { get; private set; }

        /// <summary>
        /// Gets the category description.
        /// </summary>
        public string Description { get; private set; }

        /// <summary>
        /// Gets the display order for UI sorting.
        /// </summary>
        public int DisplayOrder { get; private set; }

        /// <summary>
        /// Navigation property for related products.
        /// </summary>
        //public ICollection<Product> Products { get; private set; } = new List<Product>();

        /// <summary>
        /// Initializes a new instance of the Category class.
        /// </summary>
        /// <param name="name">The category name (required, max 100 chars)</param>
        /// <param name="description">The category description (optional, max 500 chars)</param>
        /// <param name="displayOrder">The display order (must be non-negative)</param>
        /// <exception cref="ArgumentException">Thrown when validation fails</exception>
        public Category(string name, string description, int displayOrder)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Category name is required", nameof(name));

            if (name.Length > 100)
                throw new ArgumentException("Category name cannot exceed 100 characters", nameof(name));

            if (!string.IsNullOrEmpty(description) && description.Length > 500)
                throw new ArgumentException("Description cannot exceed 500 characters", nameof(description));

            if (displayOrder < 0)
                throw new ArgumentException("Display order cannot be negative", nameof(displayOrder));

            Name = name;
            Description = description ?? string.Empty;
            DisplayOrder = displayOrder;
        }

        /// <summary>
        /// Parameterless constructor for Entity Framework Core.
        /// </summary>
        private Category() { }

        /// <summary>
        /// Updates the category name with validation.
        /// </summary>
        /// <param name="newName">The new category name</param>
        /// <exception cref="ArgumentException">Thrown when validation fails</exception>
        public void UpdateName(string newName)
        {
            if (string.IsNullOrWhiteSpace(newName))
                throw new ArgumentException("Category name cannot be empty", nameof(newName));

            if (newName.Length > 100)
                throw new ArgumentException("Category name cannot exceed 100 characters", nameof(newName));

            if (Name == newName)
                return;

            Name = newName;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Updates the category description with validation.
        /// </summary>
        /// <param name="newDescription">The new category description</param>
        /// <exception cref="ArgumentException">Thrown when validation fails</exception>
        public void UpdateDescription(string newDescription)
        {
            if (!string.IsNullOrEmpty(newDescription) && newDescription.Length > 500)
                throw new ArgumentException("Description cannot exceed 500 characters", nameof(newDescription));

            Description = newDescription ?? string.Empty;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Updates the display order with validation.
        /// </summary>
        /// <param name="newOrder">The new display order</param>
        /// <exception cref="ArgumentException">Thrown when validation fails</exception>
        public void UpdateDisplayOrder(int newOrder)
        {
            if (newOrder < 0)
                throw new ArgumentException("Display order cannot be negative", nameof(newOrder));

            if (DisplayOrder == newOrder)
                return;

            DisplayOrder = newOrder;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}

