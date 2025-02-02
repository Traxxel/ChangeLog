using System;
using System.Collections.Generic;

namespace ChangeLog.DAL
{
    public class Tool
    {
        public Guid Id { get; set; }
        public string NameKurz { get; set; } = string.Empty;
        public string NameLang { get; set; } = string.Empty;

        // Navigation Property für die 1:n Beziehung
        public virtual ICollection<ChangelogEntry> ChangelogEntries { get; set; } = new List<ChangelogEntry>();
    }
} 