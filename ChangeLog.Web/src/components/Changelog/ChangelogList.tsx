import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import DataGrid, {
  Column,
  Editing,
  Paging,
  SearchPanel,
  Selection,
  Sorting,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { changelogEntriesApi, toolsApi } from "../../services/api";
import {
  ChangelogEntry,
  Tool,
  CreateChangelogEntryRequest,
} from "../../types/api";
import ChangelogDialog from "./ChangelogDialog";
import "devextreme/dist/css/dx.light.css";

function ChangelogList() {
  const [searchParams] = useSearchParams();
  const toolId = searchParams.get("toolId");
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

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
      }
    } catch (error) {
      console.error("Fehler beim Laden der Tools:", error);
    }
  };

  useEffect(() => {
    loadEntries();
    loadTools();
  }, [toolId]);

  const formatDate = (rowData: any) => {
    const date = new Date(rowData.datum);
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
          text="Neuer Eintrag"
          icon="plus"
          type="default"
          onClick={() => setOpenDialog(true)}
        />
      </Box>

      <DataGrid
        dataSource={entries}
        showBorders={true}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
      >
        <SearchPanel visible={true} width={240} placeholder="Suchen..." />
        <Selection mode="single" />
        <Sorting mode="multiple" />
        <Paging defaultPageSize={10} />

        <Column
          dataField="datum"
          caption="Datum"
          dataType="date"
          calculateCellValue={formatDate}
          sortIndex={0}
          sortOrder="desc"
        />
        <Column
          dataField="tool.nameKurz"
          caption="Tool"
          calculateDisplayValue={(rowData: any) => rowData.tool?.nameKurz}
        />
        <Column dataField="version" caption="Version" />
        <Column dataField="beschreibung" caption="Beschreibung" />
      </DataGrid>

      <ChangelogDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={loadEntries}
        toolId={toolId}
        tools={tools}
      />
    </>
  );
}

export default ChangelogList;
