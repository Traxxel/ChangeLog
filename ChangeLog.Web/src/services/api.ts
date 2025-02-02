import axios from "axios";
import {
  Tool,
  ChangelogEntry,
  CreateToolRequest,
  UpdateToolRequest,
  CreateChangelogEntryRequest,
} from "../types/api";

const API_BASE_URL = "http://localhost:5037/api"; // Angepasst an den tatsächlichen Port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const toolsApi = {
  getAll: () => api.get<Tool[]>("/tools"),
  getById: (id: string) => api.get<Tool>(`/tools/${id}`),
  create: (tool: CreateToolRequest) => api.post<Tool>("/tools", tool),
  update: (id: string, tool: CreateToolRequest) => {
    const updateData: UpdateToolRequest = {
      id,
      ...tool,
    };
    return api.put<Tool>(`/tools/${id}`, updateData);
  },
  delete: (id: string) => api.delete<void>(`/tools/${id}`),
};

export const changelogEntriesApi = {
  getAll: () => api.get<ChangelogEntry[]>("/changelogentries"),
  getById: (id: string) => api.get<ChangelogEntry>(`/changelogentries/${id}`),
  getByToolId: (toolId: string) =>
    api.get<ChangelogEntry[]>(`/changelogentries/tool/${toolId}`),
  create: (entry: CreateChangelogEntryRequest) =>
    api.post<ChangelogEntry>("/changelogentries", entry),
  update: (id: string, entry: ChangelogEntry) =>
    api.put<void>(`/changelogentries/${id}`, entry),
  delete: (id: string) => api.delete<void>(`/changelogentries/${id}`),
};
