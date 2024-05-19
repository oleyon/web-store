﻿using System.ComponentModel.DataAnnotations;

namespace WebApi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }

        public virtual ICollection<Category> Categories { get; set; }
    }
}