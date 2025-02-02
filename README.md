# ChangeLog

Eine Anwendung zur Verwaltung von Changelog-Einträgen für verschiedene Tools.

## Projektstruktur

- **ChangeLog.DAL**: Data Access Layer mit Entity Framework Core und PostgreSQL
- **ChangeLog.API**: WebAPI für CRUD-Operationen
- **ChangeLog.Web**: React-TypeScript Frontend (in Entwicklung)

## Voraussetzungen

- .NET 8.0 SDK
- PostgreSQL (Docker oder lokal)
- Node.js und npm (für das Frontend)

## Installation

1. Klonen Sie das Repository:

   ```bash
   git clone https://github.com/Traxxel/ChangeLog.git
   cd ChangeLog
   ```

2. Stellen Sie sicher, dass PostgreSQL läuft und die Verbindungszeichenfolge in `ChangeLog.DAL/ChangeLogContext.cs` korrekt ist.

3. Führen Sie die Datenbankmigrationen aus:

   ```bash
   cd ChangeLog.DAL
   dotnet ef database update
   ```

4. Starten Sie die WebAPI:

   ```bash
   cd ../ChangeLog.API
   dotnet run
   ```

5. Die API ist nun unter https://localhost:7xxx verfügbar (der genaue Port wird beim Start angezeigt).
   Die Swagger-Dokumentation finden Sie unter https://localhost:7xxx/swagger

## API-Endpunkte

### Tools

- GET `/api/Tools` - Liste aller Tools
- GET `/api/Tools/{id}` - Details eines Tools
- POST `/api/Tools` - Neues Tool erstellen
- PUT `/api/Tools/{id}` - Tool aktualisieren
- DELETE `/api/Tools/{id}` - Tool löschen

### Changelog-Einträge

- GET `/api/ChangelogEntries` - Liste aller Einträge
- GET `/api/ChangelogEntries/{id}` - Details eines Eintrags
- GET `/api/ChangelogEntries/tool/{toolId}` - Einträge eines Tools
- POST `/api/ChangelogEntries` - Neuen Eintrag erstellen
- PUT `/api/ChangelogEntries/{id}` - Eintrag aktualisieren
- DELETE `/api/ChangelogEntries/{id}` - Eintrag löschen
