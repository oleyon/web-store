using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;
using WebApi.Models;

namespace WebApi.Db
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        private readonly IConfiguration _configuration;

        public AppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        public DbSet<Order> Orders { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            if (!optionsBuilder.IsConfigured)
            {
                string postgresHost = _configuration["POSTGRES_HOST"] ?? "db";
                string postgresPort = _configuration["POSTGRES_PORT"] ?? "25432";
                string postgresDbName = _configuration["POSTGRES_DB"] ?? "your_postgres_db";
                string postgresUser = _configuration["POSTGRES_USER"] ?? "your_postgres_user";
                string postgresPassword = _configuration["POSTGRES_PASSWORD"] ?? "your_postgres_password";

                string connectionString = $"Host={postgresHost};Database={postgresDbName};Username={postgresUser};Password={postgresPassword}";
                optionsBuilder.UseNpgsql(connectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IdentityUserLogin<string>>().HasKey(m => m.UserId);
            modelBuilder.Entity<IdentityUserRole<string>>().HasKey(m => new { m.UserId, m.RoleId });
            modelBuilder.Entity<IdentityUserToken<string>>().HasKey(m => m.UserId);

            modelBuilder.Entity<AppUser>()
                .HasOne(u => u.Cart)
                .WithOne(c => c.User)
                .HasForeignKey<Cart>(c => c.UserId);

            modelBuilder.Entity<CartItem>()
                .HasKey(ci => new { ci.CartId, ci.ProductId });

            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Cart)
                .WithMany(c => c.CartItems)
                .HasForeignKey(ci => ci.CartId);

            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Product)
                .WithMany()
                .HasForeignKey(ci => ci.ProductId);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Product)
                .WithMany()
                .HasForeignKey(o => o.ProductId);

            modelBuilder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithMany(p => p.Categories);
        }
    }
}
