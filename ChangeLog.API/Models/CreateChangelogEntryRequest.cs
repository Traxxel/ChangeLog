using System;

namespace ChangeLog.API.Models
{
    public class CreateChangelogEntryRequest
    {
        public Guid ToolId { get; set; }
        public string Version { get; set; } = string.Empty;
        public string Beschreibung { get; set; } = string.Empty;
        public DateTime? Datum { get; set; }
    }
} 