using Microsoft.EntityFrameworkCore;

namespace ChangeLog.DAL
{
    public class ChangeLogContext : DbContext
    {
        public DbSet<Tool> Tools { get; set; }
        public DbSet<ChangelogEntry> ChangelogEntries { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=127.0.0.1;Database=changelog;Username=postgres;Password=postgres");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Konfiguration für Tool
            modelBuilder.Entity<Tool>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.NameKurz)
                    .IsRequired()
                    .HasColumnType("varchar(50)");
                entity.Property(e => e.NameLang)
                    .IsRequired()
                    .HasColumnType("varchar(255)");
            });

            // Konfiguration für ChangelogEntry
            modelBuilder.Entity<ChangelogEntry>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Version)
                    .IsRequired()
                    .HasColumnType("varchar(50)");
                entity.Property(e => e.Beschreibung)
                    .IsRequired()
                    .HasColumnType("text");
                
                // Beziehung zu Tool
                entity.HasOne(e => e.Tool)
                      .WithMany(t => t.ChangelogEntries)
                      .HasForeignKey(e => e.ToolId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
} 