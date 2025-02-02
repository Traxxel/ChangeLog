import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { toolsApi } from "../../services/api";
import { Tool, CreateToolRequest } from "../../types/api";

function ToolList() {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTool, setNewTool] = useState<CreateToolRequest>({
    nameKurz: "",
    nameLang: "",
  });

  const loadTools = async () => {
    try {
      const response = await toolsApi.getAll();
      setTools(response.data);
    } catch (error) {
      console.error("Fehler beim Laden der Tools:", error);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Möchten Sie dieses Tool wirklich löschen?")) {
      try {
        await toolsApi.delete(id);
        await loadTools();
      } catch (error) {
        console.error("Fehler beim Löschen des Tools:", error);
      }
    }
  };

  const handleCreate = async () => {
    try {
      await toolsApi.create(newTool);
      setOpenDialog(false);
      setNewTool({ nameKurz: "", nameLang: "" });
      await loadTools();
    } catch (error) {
      console.error("Fehler beim Erstellen des Tools:", error);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Tools
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 2 }}
      >
        Neues Tool
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kurzname</TableCell>
              <TableCell>Langname</TableCell>
              <TableCell>Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell>{tool.nameKurz}</TableCell>
                <TableCell>{tool.nameLang}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/tools/${tool.id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(tool.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Neues Tool erstellen</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Kurzname"
            fullWidth
            value={newTool.nameKurz}
            onChange={(e) =>
              setNewTool({ ...newTool, nameKurz: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Langname"
            fullWidth
            value={newTool.nameLang}
            onChange={(e) =>
              setNewTool({ ...newTool, nameLang: e.target.value })
            }
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

export default ToolList;
