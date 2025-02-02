import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Tool, CreateToolRequest } from "../../types/api";
import { toolsApi } from "../../services/api";

interface ToolDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  tool?: Tool | null;
}

function ToolDialog({ open, onClose, onSave, tool }: ToolDialogProps) {
  const [formData, setFormData] = useState<CreateToolRequest>({
    nameKurz: "",
    nameLang: "",
  });

  useEffect(() => {
    if (tool) {
      setFormData({
        nameKurz: tool.nameKurz,
        nameLang: tool.nameLang,
      });
    } else {
      setFormData({
        nameKurz: "",
        nameLang: "",
      });
    }
  }, [tool]);

  const handleSubmit = async () => {
    try {
      // Validierung
      if (!formData.nameKurz || !formData.nameLang) {
        alert("Bitte füllen Sie alle Pflichtfelder aus.");
        return;
      }

      const toolData: CreateToolRequest = {
        nameKurz: formData.nameKurz.trim(),
        nameLang: formData.nameLang.trim(),
      };

      if (tool) {
        await toolsApi.update(tool.id, toolData);
      } else {
        await toolsApi.create(toolData);
      }
      onSave();
      onClose();
    } catch (error: any) {
      console.error("Fehler beim Speichern des Tools:", error);
      let errorMessage = "Fehler beim Speichern des Tools";
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          errorMessage = Object.values(error.response.data.errors).join("\n");
        }
      }
      alert(errorMessage);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{tool ? "Tool bearbeiten" : "Neues Tool"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Kurzname"
          fullWidth
          value={formData.nameKurz}
          onChange={(e) =>
            setFormData({ ...formData, nameKurz: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Langname"
          fullWidth
          value={formData.nameLang}
          onChange={(e) =>
            setFormData({ ...formData, nameLang: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {tool ? "Speichern" : "Erstellen"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ToolDialog;
