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
  Box,
  Link,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { toolsApi } from "../../services/api";
import { Tool, CreateToolRequest } from "../../types/api";
import ToolDialog from "./ToolDialog";

function ToolList() {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTool, setNewTool] = useState<CreateToolRequest>({
    nameKurz: "",
    nameLang: "",
    beschreibung: "",
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
      setNewTool({ nameKurz: "", nameLang: "", beschreibung: "" });
      await loadTools();
    } catch (error) {
      console.error("Fehler beim Erstellen des Tools:", error);
    }
  };

  const handleToolClick = (toolId: string) => {
    navigate(`/changelog?toolId=${toolId}`);
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
        <Typography variant="h4">Tools</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Neues Tool
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kurzname</TableCell>
              <TableCell>Langname</TableCell>
              <TableCell>Beschreibung</TableCell>
              <TableCell>Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell>
                  <Link
                    component="button"
                    onClick={() => handleToolClick(tool.id)}
                    sx={{ textDecoration: "none" }}
                  >
                    {tool.nameKurz}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    component="button"
                    onClick={() => handleToolClick(tool.id)}
                    sx={{ textDecoration: "none" }}
                  >
                    {tool.nameLang}
                  </Link>
                </TableCell>
                <TableCell>{tool.beschreibung}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(tool.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ToolDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={loadTools}
      />
    </>
  );
}

export default ToolList;
