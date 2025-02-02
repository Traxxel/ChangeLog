import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { changelogEntriesApi, toolsApi } from "../../services/api";
import {
  ChangelogEntry,
  Tool,
  CreateChangelogEntryRequest,
} from "../../types/api";

function ChangelogList() {
  const [searchParams] = useSearchParams();
  const toolId = searchParams.get("toolId");
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEntry, setNewEntry] = useState<CreateChangelogEntryRequest>({
    toolId: toolId || "",
    version: "",
    beschreibung: "",
    datum: new Date().toISOString().split("T")[0],
  });

  const loadEntries = async () => {
    try {
      const response = await changelogEntriesApi.getAll();
      let filteredEntries = response.data;
      if (toolId) {
        filteredEntries = filteredEntries.filter(
          (entry) => entry.tool?.id === toolId
        );
      }
      setEntries(filteredEntries);
    } catch (error) {
      console.error("Fehler beim Laden der Changelog-Einträge:", error);
    }
  };

  const loadTools = async () => {
    try {
      const response = await toolsApi.getAll();
      setTools(response.data);
      if (toolId) {
        const tool = response.data.find((t) => t.id === toolId);
        setSelectedTool(tool || null);
        if (tool) {
          setNewEntry((prev) => ({ ...prev, toolId: tool.id }));
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der Tools:", error);
    }
  };

  useEffect(() => {
    loadEntries();
    loadTools();
  }, [toolId]);

  const handleCreate = async () => {
    try {
      // Validiere die Eingaben
      if (!newEntry.toolId) {
        console.error("Kein Tool ausgewählt");
        return;
      }
      if (!newEntry.version) {
        console.error("Keine Version angegeben");
        return;
      }
      if (!newEntry.beschreibung) {
        console.error("Keine Beschreibung angegeben");
        return;
      }

      // Formatiere das Datum korrekt für die API
      const entryToSend = {
        toolId: newEntry.toolId,
        version: newEntry.version,
        beschreibung: newEntry.beschreibung,
        datum: newEntry.datum
          ? new Date(newEntry.datum).toISOString()
          : new Date().toISOString(),
      };

      console.log("Sende Changelog-Eintrag:", entryToSend);
      const response = await changelogEntriesApi.create(entryToSend);
      console.log("API-Antwort:", response);

      setOpenDialog(false);
      setNewEntry({
        toolId: "",
        version: "",
        beschreibung: "",
        datum: new Date().toISOString().split("T")[0],
      });
      await loadEntries();
    } catch (error: any) {
      console.error("Fehler beim Erstellen des Eintrags:", error);
      if (error.response) {
        console.error("Fehler-Status:", error.response.status);
        console.error("Fehler-Details:", error.response.data);
      }
    }
  };

  // Funktion zur Formatierung des Datums
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4">
            Changelog
            {selectedTool && (
              <Typography variant="h5" sx={{ mt: 1, color: "text.secondary" }}>
                für {selectedTool.nameKurz} - {selectedTool.nameLang}
              </Typography>
            )}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Neuer Eintrag
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Datum</TableCell>
              <TableCell>Tool</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Beschreibung</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...entries]
              .sort(
                (a, b) =>
                  new Date(b.datum).getTime() - new Date(a.datum).getTime()
              )
              .map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatDate(entry.datum)}</TableCell>
                  <TableCell>{entry.tool?.nameKurz}</TableCell>
                  <TableCell>{entry.version}</TableCell>
                  <TableCell>{entry.beschreibung}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Neuer Changelog-Eintrag</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Tool"
            fullWidth
            value={newEntry.toolId}
            onChange={(e) =>
              setNewEntry({ ...newEntry, toolId: e.target.value })
            }
            disabled={!!toolId}
          >
            {tools.map((tool) => (
              <MenuItem key={tool.id} value={tool.id}>
                {tool.nameKurz} - {tool.nameLang}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Version"
            fullWidth
            value={newEntry.version}
            onChange={(e) =>
              setNewEntry({ ...newEntry, version: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Beschreibung"
            fullWidth
            multiline
            rows={4}
            value={newEntry.beschreibung}
            onChange={(e) =>
              setNewEntry({ ...newEntry, beschreibung: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Datum"
            type="date"
            fullWidth
            value={newEntry.datum}
            onChange={(e) =>
              setNewEntry({ ...newEntry, datum: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Abbrechen</Button>
          <Button onClick={handleCreate} variant="contained">
            Erstellen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ChangelogList;
