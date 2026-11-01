using Acme.Server.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Acme.Server.Data.Migrations;

[DbContext(typeof(AcmeDbContext))]
[Migration("202611010001_SeparateBusinessTables")]
public sealed class SeparateBusinessTables : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("""CREATE TABLE "Resources" ("Id" TEXT NOT NULL CONSTRAINT "PK_Resources" PRIMARY KEY, "SortOrder" INTEGER NOT NULL DEFAULT 0, "Name" TEXT NOT NULL, "Role" TEXT NOT NULL, "Team" TEXT NOT NULL, "Status" TEXT NOT NULL, "UpdatedText" TEXT NOT NULL, "Utilization" TEXT NOT NULL);""");
        migrationBuilder.Sql("""CREATE TABLE "Customers" ("Id" TEXT NOT NULL CONSTRAINT "PK_Customers" PRIMARY KEY, "SortOrder" INTEGER NOT NULL DEFAULT 0, "Name" TEXT NOT NULL, "Industry" TEXT NOT NULL, "OwnerResourceId" TEXT NULL, "Status" TEXT NOT NULL, "UpdatedText" TEXT NOT NULL, "AnnualRevenue" TEXT NOT NULL, CONSTRAINT "FK_Customers_Resources_OwnerResourceId" FOREIGN KEY ("OwnerResourceId") REFERENCES "Resources" ("Id") ON DELETE SET NULL);""");
        migrationBuilder.Sql("""CREATE TABLE "Projects" ("Id" TEXT NOT NULL CONSTRAINT "PK_Projects" PRIMARY KEY, "SortOrder" INTEGER NOT NULL DEFAULT 0, "Name" TEXT NOT NULL, "Code" TEXT NOT NULL, "CustomerId" TEXT NULL, "OwnerResourceId" TEXT NULL, "Status" TEXT NOT NULL, "UpdatedText" TEXT NOT NULL, "Progress" TEXT NOT NULL, CONSTRAINT "FK_Projects_Customers_CustomerId" FOREIGN KEY ("CustomerId") REFERENCES "Customers" ("Id") ON DELETE SET NULL, CONSTRAINT "FK_Projects_Resources_OwnerResourceId" FOREIGN KEY ("OwnerResourceId") REFERENCES "Resources" ("Id") ON DELETE SET NULL);""");
        migrationBuilder.Sql("""CREATE TABLE "Offers" ("Id" TEXT NOT NULL CONSTRAINT "PK_Offers" PRIMARY KEY, "SortOrder" INTEGER NOT NULL DEFAULT 0, "Name" TEXT NOT NULL, "OfferNumber" TEXT NOT NULL, "CustomerId" TEXT NULL, "OwnerResourceId" TEXT NULL, "Status" TEXT NOT NULL, "UpdatedText" TEXT NOT NULL, "Amount" TEXT NOT NULL, CONSTRAINT "FK_Offers_Customers_CustomerId" FOREIGN KEY ("CustomerId") REFERENCES "Customers" ("Id") ON DELETE SET NULL, CONSTRAINT "FK_Offers_Resources_OwnerResourceId" FOREIGN KEY ("OwnerResourceId") REFERENCES "Resources" ("Id") ON DELETE SET NULL);""");
        migrationBuilder.Sql("""CREATE TABLE "Contracts" ("Id" TEXT NOT NULL CONSTRAINT "PK_Contracts" PRIMARY KEY, "SortOrder" INTEGER NOT NULL DEFAULT 0, "Name" TEXT NOT NULL, "ContractNumber" TEXT NOT NULL, "CustomerId" TEXT NULL, "OwnerResourceId" TEXT NULL, "Status" TEXT NOT NULL, "UpdatedText" TEXT NOT NULL, "Amount" TEXT NOT NULL, CONSTRAINT "FK_Contracts_Customers_CustomerId" FOREIGN KEY ("CustomerId") REFERENCES "Customers" ("Id") ON DELETE SET NULL, CONSTRAINT "FK_Contracts_Resources_OwnerResourceId" FOREIGN KEY ("OwnerResourceId") REFERENCES "Resources" ("Id") ON DELETE SET NULL);""");
        migrationBuilder.Sql("""CREATE TABLE "Activities" ("Id" TEXT NOT NULL CONSTRAINT "PK_Activities" PRIMARY KEY, "SortOrder" INTEGER NOT NULL DEFAULT 0, "Name" TEXT NOT NULL, "CustomerId" TEXT NULL, "TimeDescription" TEXT NOT NULL, "OwnerResourceId" TEXT NULL, "Status" TEXT NOT NULL, "UpdatedText" TEXT NOT NULL, "Duration" TEXT NOT NULL, CONSTRAINT "FK_Activities_Customers_CustomerId" FOREIGN KEY ("CustomerId") REFERENCES "Customers" ("Id") ON DELETE SET NULL, CONSTRAINT "FK_Activities_Resources_OwnerResourceId" FOREIGN KEY ("OwnerResourceId") REFERENCES "Resources" ("Id") ON DELETE SET NULL);""");
        migrationBuilder.Sql("""CREATE TABLE "Tasks" ("Id" TEXT NOT NULL CONSTRAINT "PK_Tasks" PRIMARY KEY, "SortOrder" INTEGER NOT NULL DEFAULT 0, "Name" TEXT NOT NULL, "ProjectId" TEXT NULL, "OwnerResourceId" TEXT NULL, "Status" TEXT NOT NULL, "DueDescription" TEXT NOT NULL, "Priority" TEXT NOT NULL, CONSTRAINT "FK_Tasks_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES "Projects" ("Id") ON DELETE SET NULL, CONSTRAINT "FK_Tasks_Resources_OwnerResourceId" FOREIGN KEY ("OwnerResourceId") REFERENCES "Resources" ("Id") ON DELETE SET NULL);""");
        migrationBuilder.Sql("""CREATE TABLE "TimeEntries" ("Id" TEXT NOT NULL CONSTRAINT "PK_TimeEntries" PRIMARY KEY, "SortOrder" INTEGER NOT NULL DEFAULT 0, "ProjectId" TEXT NULL, "EntryDescription" TEXT NOT NULL, "OwnerResourceId" TEXT NULL, "Status" TEXT NOT NULL, "UpdatedText" TEXT NOT NULL, "Hours" TEXT NOT NULL, CONSTRAINT "FK_TimeEntries_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES "Projects" ("Id") ON DELETE SET NULL, CONSTRAINT "FK_TimeEntries_Resources_OwnerResourceId" FOREIGN KEY ("OwnerResourceId") REFERENCES "Resources" ("Id") ON DELETE SET NULL);""");
        migrationBuilder.Sql("""CREATE TABLE "Invoices" ("Id" TEXT NOT NULL CONSTRAINT "PK_Invoices" PRIMARY KEY, "SortOrder" INTEGER NOT NULL DEFAULT 0, "Name" TEXT NOT NULL, "CustomerId" TEXT NULL, "DueDescription" TEXT NOT NULL, "OwnerResourceId" TEXT NULL, "Status" TEXT NOT NULL, "UpdatedText" TEXT NOT NULL, "Amount" TEXT NOT NULL, CONSTRAINT "FK_Invoices_Customers_CustomerId" FOREIGN KEY ("CustomerId") REFERENCES "Customers" ("Id") ON DELETE SET NULL, CONSTRAINT "FK_Invoices_Resources_OwnerResourceId" FOREIGN KEY ("OwnerResourceId") REFERENCES "Resources" ("Id") ON DELETE SET NULL);""");
        migrationBuilder.Sql("""CREATE TABLE "Expenses" ("Id" TEXT NOT NULL CONSTRAINT "PK_Expenses" PRIMARY KEY, "SortOrder" INTEGER NOT NULL DEFAULT 0, "Name" TEXT NOT NULL, "Category" TEXT NOT NULL, "Details" TEXT NOT NULL, "OwnerResourceId" TEXT NULL, "Status" TEXT NOT NULL, "UpdatedText" TEXT NOT NULL, "Amount" TEXT NOT NULL, CONSTRAINT "FK_Expenses_Resources_OwnerResourceId" FOREIGN KEY ("OwnerResourceId") REFERENCES "Resources" ("Id") ON DELETE SET NULL);""");
        migrationBuilder.Sql("""CREATE TABLE "Budgets" ("Id" TEXT NOT NULL CONSTRAINT "PK_Budgets" PRIMARY KEY, "SortOrder" INTEGER NOT NULL DEFAULT 0, "Name" TEXT NOT NULL, "Department" TEXT NOT NULL, "Period" TEXT NOT NULL, "OwnerResourceId" TEXT NULL, "Status" TEXT NOT NULL, "UpdatedText" TEXT NOT NULL, "Utilization" TEXT NOT NULL, CONSTRAINT "FK_Budgets_Resources_OwnerResourceId" FOREIGN KEY ("OwnerResourceId") REFERENCES "Resources" ("Id") ON DELETE SET NULL);""");
        migrationBuilder.Sql("""CREATE TABLE "Reports" ("Id" TEXT NOT NULL CONSTRAINT "PK_Reports" PRIMARY KEY, "SortOrder" INTEGER NOT NULL DEFAULT 0, "Name" TEXT NOT NULL, "Department" TEXT NOT NULL, "Schedule" TEXT NOT NULL, "OwnerResourceId" TEXT NULL, "Status" TEXT NOT NULL, "UpdatedText" TEXT NOT NULL, "Period" TEXT NOT NULL, CONSTRAINT "FK_Reports_Resources_OwnerResourceId" FOREIGN KEY ("OwnerResourceId") REFERENCES "Resources" ("Id") ON DELETE SET NULL);""");

        migrationBuilder.Sql("""CREATE INDEX "IX_Customers_OwnerResourceId" ON "Customers" ("OwnerResourceId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_Projects_CustomerId" ON "Projects" ("CustomerId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_Projects_OwnerResourceId" ON "Projects" ("OwnerResourceId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_Offers_CustomerId" ON "Offers" ("CustomerId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_Offers_OwnerResourceId" ON "Offers" ("OwnerResourceId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_Contracts_CustomerId" ON "Contracts" ("CustomerId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_Contracts_OwnerResourceId" ON "Contracts" ("OwnerResourceId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_Activities_CustomerId" ON "Activities" ("CustomerId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_Activities_OwnerResourceId" ON "Activities" ("OwnerResourceId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_Tasks_ProjectId" ON "Tasks" ("ProjectId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_Tasks_OwnerResourceId" ON "Tasks" ("OwnerResourceId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_TimeEntries_ProjectId" ON "TimeEntries" ("ProjectId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_TimeEntries_OwnerResourceId" ON "TimeEntries" ("OwnerResourceId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_Invoices_CustomerId" ON "Invoices" ("CustomerId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_Invoices_OwnerResourceId" ON "Invoices" ("OwnerResourceId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_Expenses_OwnerResourceId" ON "Expenses" ("OwnerResourceId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_Budgets_OwnerResourceId" ON "Budgets" ("OwnerResourceId");""");
        migrationBuilder.Sql("""CREATE INDEX "IX_Reports_OwnerResourceId" ON "Reports" ("OwnerResourceId");""");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("DROP TABLE IF EXISTS \"Reports\"; DROP TABLE IF EXISTS \"Budgets\"; DROP TABLE IF EXISTS \"Expenses\"; DROP TABLE IF EXISTS \"Invoices\"; DROP TABLE IF EXISTS \"TimeEntries\"; DROP TABLE IF EXISTS \"Tasks\"; DROP TABLE IF EXISTS \"Activities\"; DROP TABLE IF EXISTS \"Contracts\"; DROP TABLE IF EXISTS \"Offers\"; DROP TABLE IF EXISTS \"Projects\"; DROP TABLE IF EXISTS \"Customers\"; DROP TABLE IF EXISTS \"Resources\";");
    }
}
