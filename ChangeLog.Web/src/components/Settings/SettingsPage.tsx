import { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { List } from "devextreme-react/list";
import { Button } from "devextreme-react/button";
import { DataGrid, Column } from "devextreme-react/data-grid";
import { Chart, Series, Legend } from "devextreme-react/chart";
import { TreeView } from "devextreme-react/tree-view";
import { Accordion } from "devextreme-react/accordion";
import notify from "devextreme/ui/notify";
import { themes, Theme } from "../../App";

interface SettingsPageProps {
  onThemeChange: (theme: string) => void;
}

// Demo-Daten
const demoData = [
  { year: 2020, value: 50 },
  { year: 2021, value: 75 },
  { year: 2022, value: 90 },
  { year: 2023, value: 120 },
];

const treeData = [
  {
    id: "1",
    text: "Kategorien",
    expanded: true,
    items: [
      {
        id: "1_1",
        text: "Entwicklung",
        items: [
          {
            id: "1_1_1",
            text: "Frontend",
          },
          {
            id: "1_1_2",
            text: "Backend",
          },
        ],
      },
      {
        id: "1_2",
        text: "Design",
        items: [
          {
            id: "1_2_1",
            text: "UI",
          },
          {
            id: "1_2_2",
            text: "UX",
          },
        ],
      },
    ],
  },
];

function SettingsPage({ onThemeChange }: SettingsPageProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>(
    localStorage.getItem("dx-theme") || "material.blue.light"
  );

  // Gruppiere Themes nach ihrer Gruppe
  const groupedThemes = useMemo(() => {
    return Object.entries(
      themes.reduce((acc, theme) => {
        if (!acc[theme.group]) {
          acc[theme.group] = [];
        }
        acc[theme.group].push(theme);
        return acc;
      }, {} as Record<string, Theme[]>)
    ).map(([group, items]) => ({
      ID: group,
      title: `${group} Themes`,
      items: items.map((theme) => ({
        ...theme,
        icon: theme.isDark ? "moon" : "sun",
        selected: theme.key === selectedTheme,
      })),
    }));
  }, [selectedTheme]);

  const handleThemeChange = (e: any) => {
    if (!e.itemData) return;
    const newTheme = e.itemData.key;
    if (!newTheme || typeof newTheme !== "string") return;
    setSelectedTheme(newTheme);
    onThemeChange(newTheme);
  };

  const handleSave = () => {
    localStorage.setItem("dx-theme", selectedTheme);
    notify("Theme wurde gespeichert", "success", 3000);
  };

  const renderThemeGroup = (group: any) => {
    return (
      <List
        dataSource={group.items}
        displayExpr="name"
        keyExpr="key"
        selectedItemKeys={[selectedTheme]}
        selectionMode="single"
        onSelectionChanged={(e) => {
          if (e.addedItems && e.addedItems.length > 0) {
            handleThemeChange({ itemData: e.addedItems[0] });
          }
        }}
        itemRender={(item: any) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 0",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor:
                  item.primaryColor || (item.isDark ? "#424242" : "#f5f5f5"),
                border: `2px solid ${
                  item.primaryColor || (item.isDark ? "#fff" : "#000")
                }`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className={`dx-icon-${item.icon}`}
                style={{
                  color: item.isDark ? "#fff" : "#000",
                  fontSize: "14px",
                }}
              />
            </div>
            <span
              style={{
                color: item.selected ? item.primaryColor : "inherit",
                fontWeight: item.selected ? "bold" : "normal",
              }}
            >
              {item.name}
            </span>
          </div>
        )}
      />
    );
  };

  return (
    <div>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Einstellungen</Typography>
        <Button
          text="Speichern"
          type="success"
          onClick={handleSave}
          width={120}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Linke Spalte: Theme-Auswahl */}
        <Box sx={{ width: "300px" }}>
          <Typography variant="h6" gutterBottom>
            Theme auswählen
          </Typography>
          <Accordion
            dataSource={groupedThemes}
            itemTitleRender={(item) => (
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                {item.title}
              </Typography>
            )}
            itemRender={renderThemeGroup}
            collapsible={true}
            multiple={true}
            selectedItems={groupedThemes}
          />
        </Box>

        {/* Rechte Spalte: Demo-Komponenten */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Vorschau der Komponenten
          </Typography>

          {/* DataGrid Demo */}
          <Box sx={{ mb: 4 }}>
            <DataGrid
              dataSource={demoData}
              showBorders={true}
              columnAutoWidth={true}
            >
              <Column dataField="year" caption="Jahr" />
              <Column dataField="value" caption="Wert" />
            </DataGrid>
          </Box>

          {/* Chart Demo */}
          <Box sx={{ mb: 4 }}>
            <Chart dataSource={demoData}>
              <Series valueField="value" argumentField="year" type="bar" />
              <Legend visible={false} />
            </Chart>
          </Box>

          {/* TreeView Demo */}
          <Box sx={{ mb: 4 }}>
            <TreeView items={treeData} width={300} searchEnabled={true} />
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default SettingsPage;
