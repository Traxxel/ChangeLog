import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { toolsApi, changelogEntriesApi } from "../../services/api";
import {
  Tool,
  ChangelogEntry,
  CreateChangelogEntryRequest,
} from "../../types/api";

function ToolDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tool, setTool] = useState<Tool | null>(null);
  const [editedTool, setEditedTool] = useState<Tool | null>(null);
  const [changelogEntries, setChangelogEntries] = useState<ChangelogEntry[]>(
    []
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [newEntry, setNewEntry] = useState<CreateChangelogEntryRequest>({
    toolId: id || "",
    version: "",
    beschreibung: "",
    datum: new Date().toISOString().split("T")[0],
  });

  const loadData = async () => {
    if (!id) return;
    try {
      const toolResponse = await toolsApi.getById(id);
      setTool(toolResponse.data);
      setEditedTool(toolResponse.data);

      const entriesResponse = await changelogEntriesApi.getByToolId(id);
      setChangelogEntries(entriesResponse.data);
    } catch (error) {
      console.error("Fehler beim Laden der Daten:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSave = async () => {
    if (!editedTool || !id) return;
    try {
      await toolsApi.update(id, editedTool);
      await loadData();
    } catch (error) {
      console.error("Fehler beim Speichern des Tools:", error);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (
      window.confirm("Möchten Sie diesen Changelog-Eintrag wirklich löschen?")
    ) {
      try {
        await changelogEntriesApi.delete(entryId);
        await loadData();
      } catch (error) {
        console.error("Fehler beim Löschen des Eintrags:", error);
      }
    }
  };

  const handleCreateEntry = async () => {
    try {
      await changelogEntriesApi.create(newEntry);
      setOpenDialog(false);
      setNewEntry({
        toolId: id || "",
        version: "",
        beschreibung: "",
        datum: new Date().toISOString().split("T")[0],
      });
      await loadData();
    } catch (error) {
      console.error("Fehler beim Erstellen des Eintrags:", error);
    }
  };

  if (!tool || !editedTool) {
    return <Typography>Lädt...</Typography>;
  }

  return (
    <>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Tool bearbeiten
        </Typography>
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
        >
          <TextField
            label="Kurzname"
            value={editedTool.nameKurz}
            onChange={(e) =>
              setEditedTool({ ...editedTool, nameKurz: e.target.value })
            }
          />
          <TextField
            label="Langname"
            value={editedTool.nameLang}
            onChange={(e) =>
              setEditedTool({ ...editedTool, nameLang: e.target.value })
            }
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleSave} sx={{ mr: 1 }}>
              Speichern
            </Button>
            <Button variant="outlined" onClick={() => navigate("/")}>
              Zurück
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5">Changelog-Einträge</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Neuer Eintrag
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Datum</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Beschreibung</TableCell>
                <TableCell>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {changelogEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {new Date(entry.datum).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{entry.version}</TableCell>
                  <TableCell>{entry.beschreibung}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteEntry(entry.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Neuer Changelog-Eintrag</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
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
          <Button onClick={handleCreateEntry} variant="contained">
            Erstellen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ToolDetails;
