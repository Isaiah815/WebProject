using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models
{
    public class APIDBContext : DbContext
    {
        public APIDBContext(DbContextOptions<APIDBContext> options) : base(options) { }



        public DbSet<Bank> Banks { get; set; }
        public DbSet<BankAccount> BankAccounts { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BankAccount>()
                .HasIndex(b => new { b.AccountNumber})
                .IsUnique();

            base.OnModelCreating(modelBuilder);
        }

    }
}

