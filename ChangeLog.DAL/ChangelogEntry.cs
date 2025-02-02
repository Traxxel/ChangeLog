using System;

namespace ChangeLog.DAL
{
    public class ChangelogEntry
    {
        public Guid Id { get; set; }
        public Guid ToolId { get; set; }  // Fremdschlüssel
        public DateTime Datum { get; set; }
        public string Version { get; set; } = string.Empty;
        public string Beschreibung { get; set; } = string.Empty;

        // Navigation Property für die n:1 Beziehung
        public virtual Tool Tool { get; set; } = null!;
    }
} 