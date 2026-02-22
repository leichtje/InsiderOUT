using Insider_OUT.Server.Data.Models;
using Insider_OUT.Server.Data.Models.Incidents;
using Insider_OUT.Server.Data.Models.Profiles;
using Insider_OUT.Server.Data.Models.Tokens;
using Microsoft.EntityFrameworkCore;

namespace InsiderOUT.Server.Data
{
    public class DBContext : DbContext
    {
        public DBContext(DbContextOptions<DBContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Token> Tokens { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<Email> Emails { get; set; }
        public DbSet<Incident> Incidents { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Department> Departments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Token -> Document (one-to-one)
            modelBuilder.Entity<Token>()
                .HasOne(t => t.Document)
                .WithOne(d => d.Token)
                .HasForeignKey<Document>(d => d.DocumentTokenId)
                .OnDelete(DeleteBehavior.Cascade);

            // Token -> Email (one-to-one)
            modelBuilder.Entity<Token>()
                .HasOne(t => t.Email)
                .WithOne(e => e.Token)
                .HasForeignKey<Email>(e => e.EmailTokenId)
                .OnDelete(DeleteBehavior.Cascade);

            // Incident relationships
            modelBuilder.Entity<Incident>()
                .HasOne(i => i.AssignedUser)
                .WithMany()
                .HasForeignKey(i => i.IncidentAssignedUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Incident>()
                .HasOne(i => i.TiedSubject)
                .WithMany()
                .HasForeignKey(i => i.IncidentTiedSubjectId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Incident>()
                .HasOne(i => i.Token)
                .WithMany()
                .HasForeignKey(i => i.IncidentTokenId)
                .OnDelete(DeleteBehavior.Restrict);

            // Activity -> User
            modelBuilder.Entity<Activity>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.ActivityUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes (match existing DB)
            modelBuilder.Entity<Incident>()
                .HasIndex(i => i.IncidentTokenId)
                .HasDatabaseName("IX_Incidents_TokenId");

            modelBuilder.Entity<Incident>()
                .HasIndex(i => i.IncidentAssignedUserId)
                .HasDatabaseName("IX_Incidents_AssignedUserId");

            modelBuilder.Entity<Incident>()
                .HasIndex(i => i.IncidentTiedSubjectId)
                .HasDatabaseName("IX_Incidents_TiedSubjectId");

            modelBuilder.Entity<Activity>()
                .HasIndex(a => new { a.ActivityEntityId, a.ActivityEntityType })
                .HasDatabaseName("IX_Activities_Entity");

            modelBuilder.Entity<Token>()
                .HasIndex(t => t.TokenType)
                .HasDatabaseName("IX_Tokens_Type");

            modelBuilder.Entity<Subject>()
                .HasIndex(s => s.SubjectRiskScore)
                .HasDatabaseName("IX_Subjects_RiskScore");

            base.OnModelCreating(modelBuilder);
        }
    }
}

