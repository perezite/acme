namespace Acme.Server.Data;

public sealed class CustomerEntity
{
    public Guid Id { get; set; }
    public int SortOrder { get; set; }
    public string Name { get; set; } = "";
    public string Industry { get; set; } = "";
    public Guid? OwnerResourceId { get; set; }
    public string Status { get; set; } = "";
    public string UpdatedText { get; set; } = "";
    public string AnnualRevenue { get; set; } = "";
}

public sealed class ProjectEntity
{
    public Guid Id { get; set; }
    public int SortOrder { get; set; }
    public string Name { get; set; } = "";
    public string Code { get; set; } = "";
    public Guid? CustomerId { get; set; }
    public Guid? OwnerResourceId { get; set; }
    public string Status { get; set; } = "";
    public string UpdatedText { get; set; } = "";
    public string Progress { get; set; } = "";
}

public sealed class OfferEntity
{
    public Guid Id { get; set; }
    public int SortOrder { get; set; }
    public string Name { get; set; } = "";
    public string OfferNumber { get; set; } = "";
    public Guid? CustomerId { get; set; }
    public Guid? OwnerResourceId { get; set; }
    public string Status { get; set; } = "";
    public string UpdatedText { get; set; } = "";
    public string Amount { get; set; } = "";
}

public sealed class ContractEntity
{
    public Guid Id { get; set; }
    public int SortOrder { get; set; }
    public string Name { get; set; } = "";
    public string ContractNumber { get; set; } = "";
    public Guid? CustomerId { get; set; }
    public Guid? OwnerResourceId { get; set; }
    public string Status { get; set; } = "";
    public string UpdatedText { get; set; } = "";
    public string Amount { get; set; } = "";
}

public sealed class ActivityEntity
{
    public Guid Id { get; set; }
    public int SortOrder { get; set; }
    public string Name { get; set; } = "";
    public Guid? CustomerId { get; set; }
    public string TimeDescription { get; set; } = "";
    public Guid? OwnerResourceId { get; set; }
    public string Status { get; set; } = "";
    public string UpdatedText { get; set; } = "";
    public string Duration { get; set; } = "";
}

public sealed class TaskEntity
{
    public Guid Id { get; set; }
    public int SortOrder { get; set; }
    public string Name { get; set; } = "";
    public Guid? ProjectId { get; set; }
    public Guid? OwnerResourceId { get; set; }
    public string Status { get; set; } = "";
    public string DueDescription { get; set; } = "";
    public string Priority { get; set; } = "";
}

public sealed class ResourceEntity
{
    public Guid Id { get; set; }
    public int SortOrder { get; set; }
    public string Name { get; set; } = "";
    public string Role { get; set; } = "";
    public string Team { get; set; } = "";
    public string Status { get; set; } = "";
    public string UpdatedText { get; set; } = "";
    public string Utilization { get; set; } = "";
}

public sealed class TimeEntryEntity
{
    public Guid Id { get; set; }
    public int SortOrder { get; set; }
    public Guid? ProjectId { get; set; }
    public string EntryDescription { get; set; } = "";
    public Guid? OwnerResourceId { get; set; }
    public string Status { get; set; } = "";
    public string UpdatedText { get; set; } = "";
    public string Hours { get; set; } = "";
}

public sealed class InvoiceEntity
{
    public Guid Id { get; set; }
    public int SortOrder { get; set; }
    public string Name { get; set; } = "";
    public Guid? CustomerId { get; set; }
    public string DueDescription { get; set; } = "";
    public Guid? OwnerResourceId { get; set; }
    public string Status { get; set; } = "";
    public string UpdatedText { get; set; } = "";
    public string Amount { get; set; } = "";
}

public sealed class ExpenseEntity
{
    public Guid Id { get; set; }
    public int SortOrder { get; set; }
    public string Name { get; set; } = "";
    public string Category { get; set; } = "";
    public string Details { get; set; } = "";
    public Guid? OwnerResourceId { get; set; }
    public string Status { get; set; } = "";
    public string UpdatedText { get; set; } = "";
    public string Amount { get; set; } = "";
}

public sealed class BudgetEntity
{
    public Guid Id { get; set; }
    public int SortOrder { get; set; }
    public string Name { get; set; } = "";
    public string Department { get; set; } = "";
    public string Period { get; set; } = "";
    public Guid? OwnerResourceId { get; set; }
    public string Status { get; set; } = "";
    public string UpdatedText { get; set; } = "";
    public string Utilization { get; set; } = "";
}

public sealed class ReportEntity
{
    public Guid Id { get; set; }
    public int SortOrder { get; set; }
    public string Name { get; set; } = "";
    public string Department { get; set; } = "";
    public string Schedule { get; set; } = "";
    public Guid? OwnerResourceId { get; set; }
    public string Status { get; set; } = "";
    public string UpdatedText { get; set; } = "";
    public string Period { get; set; } = "";
}
