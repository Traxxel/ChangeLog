import { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { changelogEntriesApi } from "../../services/api";
import { ChangelogEntry } from "../../types/api";

function ChangelogList() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const response = await changelogEntriesApi.getAll();
        setEntries(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Changelog-Einträge:", error);
      }
    };

    loadEntries();
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Changelog
      </Typography>
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
            {entries
              .sort(
                (a, b) =>
                  new Date(b.datum).getTime() - new Date(a.datum).getTime()
              )
              .map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {new Date(entry.datum).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{entry.tool?.nameKurz}</TableCell>
                  <TableCell>{entry.version}</TableCell>
                  <TableCell>{entry.beschreibung}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ChangelogList;
