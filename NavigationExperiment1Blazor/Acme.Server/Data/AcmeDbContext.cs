using Microsoft.EntityFrameworkCore;

namespace Acme.Server.Data;

public sealed class AcmeDbContext(DbContextOptions<AcmeDbContext> options) : DbContext(options)
{
    public DbSet<CustomerEntity> Customers => Set<CustomerEntity>();
    public DbSet<ProjectEntity> Projects => Set<ProjectEntity>();
    public DbSet<OfferEntity> Offers => Set<OfferEntity>();
    public DbSet<ContractEntity> Contracts => Set<ContractEntity>();
    public DbSet<ActivityEntity> Activities => Set<ActivityEntity>();
    public DbSet<TaskEntity> Tasks => Set<TaskEntity>();
    public DbSet<ResourceEntity> Resources => Set<ResourceEntity>();
    public DbSet<TimeEntryEntity> TimeEntries => Set<TimeEntryEntity>();
    public DbSet<InvoiceEntity> Invoices => Set<InvoiceEntity>();
    public DbSet<ExpenseEntity> Expenses => Set<ExpenseEntity>();
    public DbSet<BudgetEntity> Budgets => Set<BudgetEntity>();
    public DbSet<ReportEntity> Reports => Set<ReportEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        Configure(modelBuilder.Entity<CustomerEntity>(), "Customers");
        modelBuilder.Entity<CustomerEntity>(entity =>
        {
            entity.Property(item => item.Industry).HasMaxLength(160).IsRequired();
            entity.Property(item => item.AnnualRevenue).HasMaxLength(80).IsRequired();
            entity.HasOne<ResourceEntity>().WithMany().HasForeignKey(item => item.OwnerResourceId).OnDelete(DeleteBehavior.SetNull);
        });

        Configure(modelBuilder.Entity<ProjectEntity>(), "Projects");
        modelBuilder.Entity<ProjectEntity>(entity =>
        {
            entity.Property(item => item.Code).HasMaxLength(80).IsRequired();
            entity.Property(item => item.Progress).HasMaxLength(80).IsRequired();
            entity.HasOne<CustomerEntity>().WithMany().HasForeignKey(item => item.CustomerId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne<ResourceEntity>().WithMany().HasForeignKey(item => item.OwnerResourceId).OnDelete(DeleteBehavior.SetNull);
        });

        Configure(modelBuilder.Entity<OfferEntity>(), "Offers");
        modelBuilder.Entity<OfferEntity>(entity =>
        {
            entity.Property(item => item.OfferNumber).HasMaxLength(80).IsRequired();
            entity.Property(item => item.Amount).HasMaxLength(80).IsRequired();
            entity.HasOne<CustomerEntity>().WithMany().HasForeignKey(item => item.CustomerId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne<ResourceEntity>().WithMany().HasForeignKey(item => item.OwnerResourceId).OnDelete(DeleteBehavior.SetNull);
        });

        Configure(modelBuilder.Entity<ContractEntity>(), "Contracts");
        modelBuilder.Entity<ContractEntity>(entity =>
        {
            entity.Property(item => item.ContractNumber).HasMaxLength(80).IsRequired();
            entity.Property(item => item.Amount).HasMaxLength(80).IsRequired();
            entity.HasOne<CustomerEntity>().WithMany().HasForeignKey(item => item.CustomerId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne<ResourceEntity>().WithMany().HasForeignKey(item => item.OwnerResourceId).OnDelete(DeleteBehavior.SetNull);
        });

        Configure(modelBuilder.Entity<ActivityEntity>(), "Activities");
        modelBuilder.Entity<ActivityEntity>(entity =>
        {
            entity.Property(item => item.TimeDescription).HasMaxLength(180).IsRequired();
            entity.Property(item => item.Duration).HasMaxLength(80).IsRequired();
            entity.HasOne<CustomerEntity>().WithMany().HasForeignKey(item => item.CustomerId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne<ResourceEntity>().WithMany().HasForeignKey(item => item.OwnerResourceId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<TaskEntity>(entity =>
        {
            entity.ToTable("Tasks");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Name).HasMaxLength(200).IsRequired();
            entity.Property(item => item.Status).HasMaxLength(80).IsRequired();
            entity.Property(item => item.DueDescription).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Priority).HasMaxLength(80).IsRequired();
            entity.HasOne<ProjectEntity>().WithMany().HasForeignKey(item => item.ProjectId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne<ResourceEntity>().WithMany().HasForeignKey(item => item.OwnerResourceId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<ResourceEntity>(entity =>
        {
            entity.ToTable("Resources");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Name).HasMaxLength(200).IsRequired();
            entity.Property(item => item.Role).HasMaxLength(160).IsRequired();
            entity.Property(item => item.Team).HasMaxLength(160).IsRequired();
            entity.Property(item => item.Status).HasMaxLength(80).IsRequired();
            entity.Property(item => item.UpdatedText).HasMaxLength(80).IsRequired();
            entity.Property(item => item.Utilization).HasMaxLength(80).IsRequired();
        });

        modelBuilder.Entity<TimeEntryEntity>(entity =>
        {
            entity.ToTable("TimeEntries");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.EntryDescription).HasMaxLength(180).IsRequired();
            entity.Property(item => item.Status).HasMaxLength(80).IsRequired();
            entity.Property(item => item.UpdatedText).HasMaxLength(80).IsRequired();
            entity.Property(item => item.Hours).HasMaxLength(80).IsRequired();
            entity.HasOne<ProjectEntity>().WithMany().HasForeignKey(item => item.ProjectId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne<ResourceEntity>().WithMany().HasForeignKey(item => item.OwnerResourceId).OnDelete(DeleteBehavior.SetNull);
        });

        Configure(modelBuilder.Entity<InvoiceEntity>(), "Invoices");
        modelBuilder.Entity<InvoiceEntity>(entity =>
        {
            entity.Property(item => item.DueDescription).HasMaxLength(180).IsRequired();
            entity.Property(item => item.Amount).HasMaxLength(80).IsRequired();
            entity.HasOne<CustomerEntity>().WithMany().HasForeignKey(item => item.CustomerId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne<ResourceEntity>().WithMany().HasForeignKey(item => item.OwnerResourceId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<ExpenseEntity>(entity =>
        {
            entity.ToTable("Expenses");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Name).HasMaxLength(200).IsRequired();
            entity.Property(item => item.Category).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Details).HasMaxLength(180).IsRequired();
            entity.Property(item => item.Status).HasMaxLength(80).IsRequired();
            entity.Property(item => item.UpdatedText).HasMaxLength(80).IsRequired();
            entity.Property(item => item.Amount).HasMaxLength(80).IsRequired();
            entity.HasOne<ResourceEntity>().WithMany().HasForeignKey(item => item.OwnerResourceId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<BudgetEntity>(entity =>
        {
            entity.ToTable("Budgets");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Name).HasMaxLength(200).IsRequired();
            entity.Property(item => item.Department).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Period).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Status).HasMaxLength(80).IsRequired();
            entity.Property(item => item.UpdatedText).HasMaxLength(80).IsRequired();
            entity.Property(item => item.Utilization).HasMaxLength(80).IsRequired();
            entity.HasOne<ResourceEntity>().WithMany().HasForeignKey(item => item.OwnerResourceId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<ReportEntity>(entity =>
        {
            entity.ToTable("Reports");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Name).HasMaxLength(200).IsRequired();
            entity.Property(item => item.Department).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Schedule).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Status).HasMaxLength(80).IsRequired();
            entity.Property(item => item.UpdatedText).HasMaxLength(80).IsRequired();
            entity.Property(item => item.Period).HasMaxLength(120).IsRequired();
            entity.HasOne<ResourceEntity>().WithMany().HasForeignKey(item => item.OwnerResourceId).OnDelete(DeleteBehavior.SetNull);
        });
    }

    private static void Configure<TEntity>(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<TEntity> entity, string table)
        where TEntity : class
    {
        entity.ToTable(table);
        entity.HasKey("Id");
        entity.Property<int>("SortOrder");
        entity.Property<string>("Name").HasMaxLength(200).IsRequired();
        entity.Property<string>("Status").HasMaxLength(80).IsRequired();
        entity.Property<string>("UpdatedText").HasMaxLength(80).IsRequired();
    }
}
