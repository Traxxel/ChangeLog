import { useState } from "react";
import { Dialog } from "@mui/material";
import { TextBox } from "devextreme-react/text-box";
import { SelectBox } from "devextreme-react/select-box";
import { DateBox } from "devextreme-react/date-box";
import { Button } from "devextreme-react/button";
import { changelogEntriesApi } from "../../services/api";
import { Tool, CreateChangelogEntryRequest } from "../../types/api";
import "devextreme/dist/css/dx.light.css";

interface ChangelogDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  toolId?: string | null;
  tools: Tool[];
}

function ChangelogDialog({
  open,
  onClose,
  onSave,
  toolId,
  tools,
}: ChangelogDialogProps) {
  const [newEntry, setNewEntry] = useState<CreateChangelogEntryRequest>({
    toolId: toolId || "",
    version: "",
    beschreibung: "",
    datum: new Date().toISOString(),
  });

  const handleCreate = async () => {
    try {
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

      const entryToSend = {
        ...newEntry,
        datum: newEntry.datum
          ? new Date(newEntry.datum).toISOString()
          : new Date().toISOString(),
      };

      await changelogEntriesApi.create(entryToSend);
      onSave();
      onClose();
      setNewEntry({
        toolId: toolId || "",
        version: "",
        beschreibung: "",
        datum: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Fehler beim Erstellen des Eintrags:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div style={{ padding: "20px" }}>
        <h2 style={{ marginTop: 0 }}>Neuer Changelog-Eintrag</h2>

        <div style={{ marginBottom: "15px" }}>
          <SelectBox
            dataSource={tools}
            displayExpr={(item) =>
              item ? `${item.nameKurz} - ${item.nameLang}` : ""
            }
            valueExpr="id"
            placeholder="Tool auswählen"
            value={newEntry.toolId}
            onValueChanged={(e) =>
              setNewEntry({ ...newEntry, toolId: e.value || "" })
            }
            disabled={!!toolId}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <TextBox
            placeholder="Version"
            value={newEntry.version}
            onValueChanged={(e) =>
              setNewEntry({ ...newEntry, version: e.value || "" })
            }
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <TextBox
            placeholder="Beschreibung"
            value={newEntry.beschreibung}
            onValueChanged={(e) =>
              setNewEntry({ ...newEntry, beschreibung: e.value || "" })
            }
            height={100}
            mode="text"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <DateBox
            type="date"
            value={newEntry.datum ? new Date(newEntry.datum) : new Date()}
            onValueChanged={(e) =>
              setNewEntry({
                ...newEntry,
                datum: e.value
                  ? e.value.toISOString()
                  : new Date().toISOString(),
              })
            }
          />
        </div>

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <Button text="Abbrechen" onClick={onClose} />
          <Button text="Erstellen" type="default" onClick={handleCreate} />
        </div>
      </div>
    </Dialog>
  );
}

export default ChangelogDialog;
