export interface Tool {
  id: string;
  nameKurz: string;
  nameLang: string;
  changelogEntries?: ChangelogEntry[];
}

export interface ChangelogEntry {
  id: string;
  toolId: string;
  datum: string;
  version: string;
  beschreibung: string;
  tool?: Tool;
}

export interface CreateToolRequest {
  nameKurz: string;
  nameLang: string;
}

export interface CreateChangelogEntryRequest {
  toolId: string;
  version: string;
  beschreibung: string;
  datum?: string;
}
