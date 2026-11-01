using System.Data;
using System.Security.Cryptography;
using System.Text;
using Acme.Shared;
using Microsoft.EntityFrameworkCore;

namespace Acme.Server.Data;

public static class PrototypeStateStore
{
    private static readonly string[] ObjectIds = ["kunden", "projekte", "angebote", "vertraege", "aktivitaeten", "aufgaben", "ressourcen", "zeiterfassung", "rechnungen", "kosten", "budgets", "berichte"];

    public static async Task EnsureSeededAsync(AcmeDbContext db)
    {
        var existingCount = await db.Customers.CountAsync() + await db.Projects.CountAsync() + await db.Offers.CountAsync()
            + await db.Contracts.CountAsync() + await db.Activities.CountAsync() + await db.Tasks.CountAsync()
            + await db.Resources.CountAsync() + await db.TimeEntries.CountAsync() + await db.Invoices.CountAsync()
            + await db.Expenses.CountAsync() + await db.Budgets.CountAsync() + await db.Reports.CountAsync();
        if (existingCount > 0) return;

        var legacyRows = await ReadLegacyRowsAsync(db);
        var state = legacyRows.Count > 0 ? FromLegacyRows(legacyRows) : FromCatalog();
        await SaveAsync(db, state);
    }

    public static async Task<PrototypeStateDto> ReadAsync(AcmeDbContext db)
    {
        var state = EmptyState();
        var resources = await db.Resources.AsNoTracking().OrderBy(item => item.SortOrder).ToListAsync();
        var customers = await db.Customers.AsNoTracking().OrderBy(item => item.SortOrder).ToListAsync();
        var projects = await db.Projects.AsNoTracking().OrderBy(item => item.SortOrder).ToListAsync();
        var offers = await db.Offers.AsNoTracking().OrderBy(item => item.SortOrder).ToListAsync();
        var contracts = await db.Contracts.AsNoTracking().OrderBy(item => item.SortOrder).ToListAsync();
        var activities = await db.Activities.AsNoTracking().OrderBy(item => item.SortOrder).ToListAsync();
        var tasks = await db.Tasks.AsNoTracking().OrderBy(item => item.SortOrder).ToListAsync();
        var timeEntries = await db.TimeEntries.AsNoTracking().OrderBy(item => item.SortOrder).ToListAsync();
        var invoices = await db.Invoices.AsNoTracking().OrderBy(item => item.SortOrder).ToListAsync();
        var expenses = await db.Expenses.AsNoTracking().OrderBy(item => item.SortOrder).ToListAsync();
        var budgets = await db.Budgets.AsNoTracking().OrderBy(item => item.SortOrder).ToListAsync();
        var reports = await db.Reports.AsNoTracking().OrderBy(item => item.SortOrder).ToListAsync();

        var resourceNames = resources.ToDictionary(item => item.Id, item => item.Name);
        var customerNames = customers.ToDictionary(item => item.Id, item => item.Name);
        var projectNames = projects.ToDictionary(item => item.Id, item => item.Name);

        state.Modules["kunden"] = customers.Select(item => Row(item.Id, item.Name, item.Industry, NameOf(resourceNames, item.OwnerResourceId), item.Status, item.UpdatedText, item.AnnualRevenue)).ToList();
        state.Modules["projekte"] = projects.Select(item => Row(item.Id, item.Name, Joined(NameOf(customerNames, item.CustomerId), item.Code), NameOf(resourceNames, item.OwnerResourceId), item.Status, item.UpdatedText, item.Progress)).ToList();
        state.Modules["angebote"] = offers.Select(item => Row(item.Id, item.Name, Joined(NameOf(customerNames, item.CustomerId), item.OfferNumber), NameOf(resourceNames, item.OwnerResourceId), item.Status, item.UpdatedText, item.Amount)).ToList();
        state.Modules["vertraege"] = contracts.Select(item => Row(item.Id, item.Name, Joined(NameOf(customerNames, item.CustomerId), item.ContractNumber), NameOf(resourceNames, item.OwnerResourceId), item.Status, item.UpdatedText, item.Amount)).ToList();
        state.Modules["aktivitaeten"] = activities.Select(item => Row(item.Id, item.Name, Joined(NameOf(customerNames, item.CustomerId), item.TimeDescription), NameOf(resourceNames, item.OwnerResourceId), item.Status, item.UpdatedText, item.Duration)).ToList();
        state.Modules["aufgaben"] = tasks.Select(item => Row(item.Id, item.Name, NameOf(projectNames, item.ProjectId), NameOf(resourceNames, item.OwnerResourceId), item.Status, item.DueDescription, item.Priority)).ToList();
        state.Modules["ressourcen"] = resources.Select(item => Row(item.Id, item.Name, item.Role, item.Team, item.Status, item.UpdatedText, item.Utilization)).ToList();
        state.Modules["zeiterfassung"] = timeEntries.Select(item => Row(item.Id, NameOf(projectNames, item.ProjectId), Joined(NameOf(resourceNames, item.OwnerResourceId), item.EntryDescription), NameOf(resourceNames, item.OwnerResourceId), item.Status, item.UpdatedText, item.Hours)).ToList();
        state.Modules["rechnungen"] = invoices.Select(item => Row(item.Id, item.Name, Joined(NameOf(customerNames, item.CustomerId), item.DueDescription), NameOf(resourceNames, item.OwnerResourceId), item.Status, item.UpdatedText, item.Amount)).ToList();
        state.Modules["kosten"] = expenses.Select(item => Row(item.Id, item.Name, Joined(item.Category, item.Details), NameOf(resourceNames, item.OwnerResourceId), item.Status, item.UpdatedText, item.Amount)).ToList();
        state.Modules["budgets"] = budgets.Select(item => Row(item.Id, item.Name, Joined(item.Department, item.Period), NameOf(resourceNames, item.OwnerResourceId), item.Status, item.UpdatedText, item.Utilization)).ToList();
        state.Modules["berichte"] = reports.Select(item => Row(item.Id, item.Name, Joined(item.Department, item.Schedule), NameOf(resourceNames, item.OwnerResourceId), item.Status, item.UpdatedText, item.Period)).ToList();

        foreach (var item in customers) AddRelation(state, "kunden", item.Id, "ressourcen", item.OwnerResourceId);
        foreach (var item in projects) { AddRelation(state, "projekte", item.Id, "kunden", item.CustomerId); AddRelation(state, "projekte", item.Id, "ressourcen", item.OwnerResourceId); }
        foreach (var item in offers) { AddRelation(state, "angebote", item.Id, "kunden", item.CustomerId); AddRelation(state, "angebote", item.Id, "ressourcen", item.OwnerResourceId); }
        foreach (var item in contracts) { AddRelation(state, "vertraege", item.Id, "kunden", item.CustomerId); AddRelation(state, "vertraege", item.Id, "ressourcen", item.OwnerResourceId); }
        foreach (var item in activities) { AddRelation(state, "aktivitaeten", item.Id, "kunden", item.CustomerId); AddRelation(state, "aktivitaeten", item.Id, "ressourcen", item.OwnerResourceId); }
        foreach (var item in tasks) { AddRelation(state, "aufgaben", item.Id, "projekte", item.ProjectId); AddRelation(state, "aufgaben", item.Id, "ressourcen", item.OwnerResourceId); }
        foreach (var item in timeEntries) { AddRelation(state, "zeiterfassung", item.Id, "projekte", item.ProjectId); AddRelation(state, "zeiterfassung", item.Id, "ressourcen", item.OwnerResourceId); }
        foreach (var item in invoices) { AddRelation(state, "rechnungen", item.Id, "kunden", item.CustomerId); AddRelation(state, "rechnungen", item.Id, "ressourcen", item.OwnerResourceId); }
        foreach (var item in expenses) AddRelation(state, "kosten", item.Id, "ressourcen", item.OwnerResourceId);
        foreach (var item in budgets) AddRelation(state, "budgets", item.Id, "ressourcen", item.OwnerResourceId);
        foreach (var item in reports) AddRelation(state, "berichte", item.Id, "ressourcen", item.OwnerResourceId);
        return state;
    }

    public static async Task SaveAsync(AcmeDbContext db, PrototypeStateDto incoming)
    {
        var state = Normalize(incoming);
        var transaction = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable);
        try
        {
            db.ChangeTracker.Clear();
            await db.Reports.ExecuteDeleteAsync();
            await db.Budgets.ExecuteDeleteAsync();
            await db.Expenses.ExecuteDeleteAsync();
            await db.Invoices.ExecuteDeleteAsync();
            await db.TimeEntries.ExecuteDeleteAsync();
            await db.Tasks.ExecuteDeleteAsync();
            await db.Activities.ExecuteDeleteAsync();
            await db.Contracts.ExecuteDeleteAsync();
            await db.Offers.ExecuteDeleteAsync();
            await db.Projects.ExecuteDeleteAsync();
            await db.Customers.ExecuteDeleteAsync();
            await db.Resources.ExecuteDeleteAsync();

            var resourceRows = state.Modules["ressourcen"];
            db.Resources.AddRange(resourceRows.Select((row, index) => new ResourceEntity
            {
                Id = Id(row), SortOrder = index, Name = Field(row, 0), Role = Field(row, 1), Team = Field(row, 2),
                Status = Field(row, 3), UpdatedText = Field(row, 4), Utilization = Field(row, 5)
            }));
            await db.SaveChangesAsync();

            var customerRows = state.Modules["kunden"];
            db.Customers.AddRange(customerRows.Select((row, index) => new CustomerEntity
            {
                Id = Id(row), SortOrder = index, Name = Field(row, 0), Industry = Field(row, 1),
                OwnerResourceId = RelationId(state, "kunden", row, "ressourcen"), Status = Field(row, 3), UpdatedText = Field(row, 4), AnnualRevenue = Field(row, 5)
            }));
            await db.SaveChangesAsync();

            var projectRows = state.Modules["projekte"];
            db.Projects.AddRange(projectRows.Select((row, index) => new ProjectEntity
            {
                Id = Id(row), SortOrder = index, Name = Field(row, 0), Code = Remainder(Field(row, 1)),
                CustomerId = ResolveRelationId(state, "projekte", row, "kunden", 1), OwnerResourceId = RelationId(state, "projekte", row, "ressourcen"),
                Status = Field(row, 3), UpdatedText = Field(row, 4), Progress = Field(row, 5)
            }));
            await db.SaveChangesAsync();

            db.Offers.AddRange(state.Modules["angebote"].Select((row, index) => new OfferEntity
            {
                Id = Id(row), SortOrder = index, Name = Field(row, 0), OfferNumber = Remainder(Field(row, 1)),
                CustomerId = ResolveRelationId(state, "angebote", row, "kunden", 1), OwnerResourceId = RelationId(state, "angebote", row, "ressourcen"),
                Status = Field(row, 3), UpdatedText = Field(row, 4), Amount = Field(row, 5)
            }));
            db.Contracts.AddRange(state.Modules["vertraege"].Select((row, index) => new ContractEntity
            {
                Id = Id(row), SortOrder = index, Name = Field(row, 0), ContractNumber = Remainder(Field(row, 1)),
                CustomerId = ResolveRelationId(state, "vertraege", row, "kunden", 1), OwnerResourceId = RelationId(state, "vertraege", row, "ressourcen"),
                Status = Field(row, 3), UpdatedText = Field(row, 4), Amount = Field(row, 5)
            }));
            db.Activities.AddRange(state.Modules["aktivitaeten"].Select((row, index) => new ActivityEntity
            {
                Id = Id(row), SortOrder = index, Name = Field(row, 0), CustomerId = ResolveRelationId(state, "aktivitaeten", row, "kunden", 1),
                TimeDescription = Remainder(Field(row, 1)), OwnerResourceId = RelationId(state, "aktivitaeten", row, "ressourcen"),
                Status = Field(row, 3), UpdatedText = Field(row, 4), Duration = Field(row, 5)
            }));
            db.Tasks.AddRange(state.Modules["aufgaben"].Select((row, index) => new TaskEntity
            {
                Id = Id(row), SortOrder = index, Name = Field(row, 0), ProjectId = ResolveRelationId(state, "aufgaben", row, "projekte", 1),
                OwnerResourceId = RelationId(state, "aufgaben", row, "ressourcen"), Status = Field(row, 3), DueDescription = Field(row, 4), Priority = Field(row, 5)
            }));
            db.TimeEntries.AddRange(state.Modules["zeiterfassung"].Select((row, index) => new TimeEntryEntity
            {
                Id = Id(row), SortOrder = index, ProjectId = ResolveRelationId(state, "zeiterfassung", row, "projekte", 0),
                EntryDescription = Remainder(Field(row, 1)), OwnerResourceId = RelationId(state, "zeiterfassung", row, "ressourcen"),
                Status = Field(row, 3), UpdatedText = Field(row, 4), Hours = Field(row, 5)
            }));
            db.Invoices.AddRange(state.Modules["rechnungen"].Select((row, index) => new InvoiceEntity
            {
                Id = Id(row), SortOrder = index, Name = Field(row, 0), CustomerId = ResolveRelationId(state, "rechnungen", row, "kunden", 1),
                DueDescription = Remainder(Field(row, 1)), OwnerResourceId = RelationId(state, "rechnungen", row, "ressourcen"),
                Status = Field(row, 3), UpdatedText = Field(row, 4), Amount = Field(row, 5)
            }));
            db.Expenses.AddRange(state.Modules["kosten"].Select((row, index) => new ExpenseEntity
            {
                Id = Id(row), SortOrder = index, Name = Field(row, 0), Category = FirstPart(Field(row, 1)), Details = Remainder(Field(row, 1)),
                OwnerResourceId = RelationId(state, "kosten", row, "ressourcen"), Status = Field(row, 3), UpdatedText = Field(row, 4), Amount = Field(row, 5)
            }));
            db.Budgets.AddRange(state.Modules["budgets"].Select((row, index) => new BudgetEntity
            {
                Id = Id(row), SortOrder = index, Name = Field(row, 0), Department = FirstPart(Field(row, 1)), Period = Remainder(Field(row, 1)),
                OwnerResourceId = RelationId(state, "budgets", row, "ressourcen"), Status = Field(row, 3), UpdatedText = Field(row, 4), Utilization = Field(row, 5)
            }));
            db.Reports.AddRange(state.Modules["berichte"].Select((row, index) => new ReportEntity
            {
                Id = Id(row), SortOrder = index, Name = Field(row, 0), Department = FirstPart(Field(row, 1)), Schedule = Remainder(Field(row, 1)),
                OwnerResourceId = RelationId(state, "berichte", row, "ressourcen"), Status = Field(row, 3), UpdatedText = Field(row, 4), Period = Field(row, 5)
            }));
            await db.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private static PrototypeStateDto FromCatalog()
    {
        var state = EmptyState();
        foreach (var module in ModuleCatalog.All)
        {
            var rows = state.Modules[module.Id];
            foreach (var seed in module.Seeds)
                rows.Add(Row(StableId(module.Id, rows.Count.ToString()), seed.Name, seed.Related, seed.Owner, seed.Status, seed.Updated, seed.Value));
        }
        return AddImplicitRelations(state);
    }

    private static PrototypeStateDto FromLegacyRows(List<LegacyRecord> records)
    {
        var state = EmptyState();
        foreach (var legacy in records.Where(item => ObjectIds.Contains(item.ModuleId, StringComparer.OrdinalIgnoreCase)).OrderBy(item => item.Id))
        {
            state.Modules[legacy.ModuleId].Add(Row(StableId(legacy.ModuleId, legacy.Id.ToString()), legacy.Name, legacy.Related, legacy.Owner, legacy.Status, legacy.Updated, legacy.Value));
        }
        foreach (var module in ModuleCatalog.All)
        {
            if (state.Modules[module.Id].Count > 0) continue;
            foreach (var seed in module.Seeds)
                state.Modules[module.Id].Add(Row(StableId(module.Id, state.Modules[module.Id].Count.ToString()), seed.Name, seed.Related, seed.Owner, seed.Status, seed.Updated, seed.Value));
        }
        return AddImplicitRelations(state);
    }

    private static async Task<List<LegacyRecord>> ReadLegacyRowsAsync(AcmeDbContext db)
    {
        var connection = db.Database.GetDbConnection();
        var openedHere = connection.State != ConnectionState.Open;
        if (openedHere) await connection.OpenAsync();
        try
        {
            await using var exists = connection.CreateCommand();
            exists.CommandText = "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'Records' LIMIT 1";
            if (await exists.ExecuteScalarAsync() is null) return [];

            await using var command = connection.CreateCommand();
            command.CommandText = "SELECT Id, ModuleId, Name, Related, Owner, Status, Updated, Value FROM Records ORDER BY Id";
            await using var reader = await command.ExecuteReaderAsync();
            var rows = new List<LegacyRecord>();
            while (await reader.ReadAsync())
            {
                rows.Add(new LegacyRecord(reader.GetInt32(0), reader.GetString(1), reader.GetString(2), reader.GetString(3),
                    reader.GetString(4), reader.GetString(5), reader.GetString(6), reader.GetString(7)));
            }
            return rows;
        }
        catch (Exception exception) when (exception.Message.Contains("no such column", StringComparison.OrdinalIgnoreCase))
        {
            return [];
        }
        finally
        {
            if (openedHere) await connection.CloseAsync();
        }
    }

    private static PrototypeStateDto AddImplicitRelations(PrototypeStateDto state)
    {
        AddMatched(state, "projekte", "kunden", 1, (value, name) => value == name || value.StartsWith(name + " ·", StringComparison.OrdinalIgnoreCase));
        foreach (var source in new[] { "angebote", "vertraege", "aktivitaeten", "rechnungen" })
            AddMatched(state, source, "kunden", 1, (value, name) => value.Contains(name, StringComparison.OrdinalIgnoreCase));
        AddMatched(state, "aufgaben", "projekte", 1, (value, name) => value.Equals(name, StringComparison.OrdinalIgnoreCase));
        AddMatched(state, "zeiterfassung", "projekte", 0, (value, name) => value.Equals(name, StringComparison.OrdinalIgnoreCase));
        foreach (var source in ObjectIds.Where(item => item != "ressourcen"))
            AddMatched(state, source, "ressourcen", 2, (value, name) => value.Equals(name, StringComparison.OrdinalIgnoreCase));
        return state;
    }

    private static void AddMatched(PrototypeStateDto state, string source, string target, int column, Func<string, string, bool> match)
    {
        foreach (var row in state.Modules[source])
        {
            var value = Field(row, column);
            var targetRow = state.Modules[target].FirstOrDefault(item => match(value, Field(item, 0)));
            if (targetRow is not null) AddRelation(state, source, Id(row), target, Id(targetRow));
        }
    }

    private static PrototypeStateDto Normalize(PrototypeStateDto incoming)
    {
        var state = EmptyState();
        foreach (var id in ObjectIds)
        {
            if (!incoming.Modules.TryGetValue(id, out var rows)) continue;
            state.Modules[id] = rows.Where(row => Guid.TryParse(row.Id, out _) && !string.IsNullOrWhiteSpace(Field(row, 0)))
                .Select(row => Row(Id(row), Enumerable.Range(0, 6).Select(index => Field(row, index)).ToArray())).ToList();
        }
        foreach (var relation in incoming.Relations)
        {
            if (!ObjectIds.Contains(relation.From.Object, StringComparer.OrdinalIgnoreCase) || !ObjectIds.Contains(relation.To.Object, StringComparer.OrdinalIgnoreCase)) continue;
            if (!Guid.TryParse(relation.From.Id, out _) || !Guid.TryParse(relation.To.Id, out _)) continue;
            if (!state.Modules[relation.From.Object].Any(row => row.Id.Equals(relation.From.Id, StringComparison.OrdinalIgnoreCase))) continue;
            if (!state.Modules[relation.To.Object].Any(row => row.Id.Equals(relation.To.Id, StringComparison.OrdinalIgnoreCase))) continue;
            AddRelation(state, relation.From.Object, relation.From.Id, relation.To.Object, relation.To.Id);
        }
        return state;
    }

    private static Guid? ResolveRelationId(PrototypeStateDto state, string source, PrototypeRecordDto row, string target, int referenceColumn)
    {
        var explicitId = RelationId(state, source, row, target);
        if (explicitId is not null) return explicitId;
        var value = Field(row, referenceColumn);
        var name = state.Modules[target].FirstOrDefault(candidate => value.Equals(Field(candidate, 0), StringComparison.OrdinalIgnoreCase)
            || value.StartsWith(Field(candidate, 0) + " ·", StringComparison.OrdinalIgnoreCase)
            || value.Contains(Field(candidate, 0), StringComparison.OrdinalIgnoreCase));
        return name is not null && Guid.TryParse(name.Id, out var parsed) ? parsed : null;
    }

    private static Guid? RelationId(PrototypeStateDto state, string source, PrototypeRecordDto row, string target)
    {
        foreach (var relation in state.Relations)
        {
            if (relation.From.Object.Equals(source, StringComparison.OrdinalIgnoreCase) && relation.From.Id.Equals(row.Id, StringComparison.OrdinalIgnoreCase)
                && relation.To.Object.Equals(target, StringComparison.OrdinalIgnoreCase) && Guid.TryParse(relation.To.Id, out var to)) return to;
            if (relation.To.Object.Equals(source, StringComparison.OrdinalIgnoreCase) && relation.To.Id.Equals(row.Id, StringComparison.OrdinalIgnoreCase)
                && relation.From.Object.Equals(target, StringComparison.OrdinalIgnoreCase) && Guid.TryParse(relation.From.Id, out var from)) return from;
        }
        if (target == "ressourcen")
        {
            var owner = state.Modules[target].FirstOrDefault(candidate => Field(candidate, 0).Equals(Field(row, 2), StringComparison.OrdinalIgnoreCase));
            if (owner is not null && Guid.TryParse(owner.Id, out var resourceId)) return resourceId;
        }
        return null;
    }

    private static PrototypeStateDto EmptyState()
    {
        var state = new PrototypeStateDto();
        foreach (var id in ObjectIds) state.Modules[id] = [];
        return state;
    }

    private static PrototypeRecordDto Row(Guid id, params string[] fields) => new()
    {
        Id = id.ToString("D"),
        Fields = Enumerable.Range(0, 6).Select(index => index < fields.Length ? fields[index] ?? "" : "").ToList()
    };

    private static void AddRelation(PrototypeStateDto state, string source, Guid sourceId, string target, Guid? targetId)
    {
        if (targetId is null) return;
        AddRelation(state, source, sourceId.ToString("D"), target, targetId.Value.ToString("D"));
    }

    private static void AddRelation(PrototypeStateDto state, string source, string sourceId, string target, string targetId)
    {
        if (state.Relations.Any(item => item.From.Object == source && item.From.Id == sourceId && item.To.Object == target && item.To.Id == targetId)) return;
        state.Relations.Add(new PrototypeRelationDto { From = new() { Object = source, Id = sourceId }, To = new() { Object = target, Id = targetId } });
    }

    private static Guid Id(PrototypeRecordDto row) => Guid.Parse(row.Id);
    private static string Field(PrototypeRecordDto row, int index) => row.Fields.Count > index ? row.Fields[index] ?? "" : "";
    private static string NameOf(IReadOnlyDictionary<Guid, string> names, Guid? id) => id is not null && names.TryGetValue(id.Value, out var name) ? name : "";
    private static string Joined(string left, string right) => string.IsNullOrWhiteSpace(left) ? right : string.IsNullOrWhiteSpace(right) ? left : $"{left} · {right}";
    private static string FirstPart(string value) => value.Split(" · ", 2, StringSplitOptions.None)[0];
    private static string Remainder(string value) => value.Split(" · ", 2, StringSplitOptions.None).ElementAtOrDefault(1) ?? "";
    private static Guid StableId(string moduleId, string key)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes($"acme:{moduleId}:{key}"));
        return new Guid(bytes.AsSpan(0, 16));
    }

    private sealed record LegacyRecord(int Id, string ModuleId, string Name, string Related, string Owner, string Status, string Updated, string Value);
}
