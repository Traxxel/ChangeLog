using ChangeLog.DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ChangeLogContext>();

// CORS-Konfiguration für die React-Anwendung
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite Dev Server Port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Konfiguriere JSON-Serialisierung für Zeitstempel
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Swagger/OpenAPI Konfiguration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "ChangeLog API",
        Description = "Eine WebAPI zur Verwaltung von Changelog-Einträgen für verschiedene Tools",
        Contact = new OpenApiContact
        {
            Name = "GitHub Repository",
            Url = new Uri("https://github.com/Traxxel/ChangeLog")
        }
    });

    // Aktiviere XML-Kommentare für Swagger
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "ChangeLog API v1");
        options.RoutePrefix = "swagger";
        options.DocumentTitle = "ChangeLog API Documentation";
    });
}

// CORS vor den anderen Middleware-Komponenten aktivieren
app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
