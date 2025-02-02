import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { toolsApi } from "../../services/api";
import { CreateToolRequest } from "../../types/api";

interface ToolDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

function ToolDialog({ open, onClose, onSave }: ToolDialogProps) {
  const [newTool, setNewTool] = useState<CreateToolRequest>({
    nameKurz: "",
    nameLang: "",
    beschreibung: "",
  });

  const handleCreate = async () => {
    try {
      await toolsApi.create(newTool);
      setNewTool({
        nameKurz: "",
        nameLang: "",
        beschreibung: "",
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Fehler beim Erstellen des Tools:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Neues Tool erstellen</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Kurzname"
          fullWidth
          value={newTool.nameKurz}
          onChange={(e) => setNewTool({ ...newTool, nameKurz: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Langname"
          fullWidth
          value={newTool.nameLang}
          onChange={(e) => setNewTool({ ...newTool, nameLang: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Beschreibung"
          fullWidth
          multiline
          rows={4}
          value={newTool.beschreibung}
          onChange={(e) =>
            setNewTool({ ...newTool, beschreibung: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={handleCreate} variant="contained">
          Erstellen
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ToolDialog;
