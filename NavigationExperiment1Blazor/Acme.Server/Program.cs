using Acme.Server.Data;
using Acme.Shared;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var databasePath = Path.Combine(builder.Environment.ContentRootPath, "App_Data", "acme.db");
Directory.CreateDirectory(Path.GetDirectoryName(databasePath)!);
builder.Services.AddDbContext<AcmeDbContext>(options => options.UseSqlite($"Data Source={databasePath}"));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AcmeDbContext>();
    await db.Database.MigrateAsync();
    await PrototypeStateStore.EnsureSeededAsync(db);
}

app.UseBlazorFrameworkFiles();
app.UseStaticFiles();

app.MapGet("/api/prototype/state", async (AcmeDbContext db) =>
{
    return Results.Ok(await PrototypeStateStore.ReadAsync(db));
});

app.MapPut("/api/prototype/state", async (PrototypeStateDto state, AcmeDbContext db) =>
{
    try
    {
        await PrototypeStateStore.SaveAsync(db, state);
        return Results.NoContent();
    }
    catch (Exception exception)
    {
        app.Logger.LogError(exception, "Could not save prototype data to the normalized SQLite tables.");
        return Results.Problem(
            title: "Die Änderungen konnten nicht in SQLite gespeichert werden.",
            detail: app.Environment.IsDevelopment() ? exception.Message : null,
            statusCode: StatusCodes.Status500InternalServerError);
    }
});

app.MapFallbackToFile("index.html");
app.Run();
