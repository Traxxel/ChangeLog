export interface Tool {
  id: string;
  nameKurz: string;
  nameLang: string;
}

export interface CreateToolRequest {
  nameKurz: string;
  nameLang: string;
}

export interface UpdateToolRequest extends CreateToolRequest {
  id: string;
}

export interface ChangelogEntry {
  id: string;
  toolId: string;
  version: string;
  datum: string;
  beschreibung: string;
}

export interface CreateChangelogEntryRequest {
  toolId: string;
  version: string;
  datum: string;
  beschreibung: string;
}
