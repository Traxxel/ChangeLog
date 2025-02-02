import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import ChangelogList from "./components/Changelog/ChangelogList";
import ToolList from "./components/Tools/ToolList";
import ToolDetails from "./components/Tools/ToolDetails";
import SettingsPage from "./components/Settings/SettingsPage";

// Theme-Definitionen
export interface Theme {
  key: string;
  name: string;
  isDark: boolean;
  primaryColor?: string;
  group: "Material" | "Fluent" | "Generic";
}

export const themes: Theme[] = [
  // Material Themes
  {
    key: "material.blue.light",
    name: "Material Blau (Hell)",
    isDark: false,
    primaryColor: "#2196f3",
    group: "Material",
  },
  {
    key: "material.blue.dark",
    name: "Material Blau (Dunkel)",
    isDark: true,
    primaryColor: "#2196f3",
    group: "Material",
  },
  {
    key: "material.orange.light",
    name: "Material Orange (Hell)",
    isDark: false,
    primaryColor: "#ff5722",
    group: "Material",
  },
  {
    key: "material.orange.dark",
    name: "Material Orange (Dunkel)",
    isDark: true,
    primaryColor: "#ff5722",
    group: "Material",
  },
  {
    key: "material.lime.light",
    name: "Material Lime (Hell)",
    isDark: false,
    primaryColor: "#cddc39",
    group: "Material",
  },
  {
    key: "material.lime.dark",
    name: "Material Lime (Dunkel)",
    isDark: true,
    primaryColor: "#cddc39",
    group: "Material",
  },
  {
    key: "material.purple.light",
    name: "Material Lila (Hell)",
    isDark: false,
    primaryColor: "#9c27b0",
    group: "Material",
  },
  {
    key: "material.purple.dark",
    name: "Material Lila (Dunkel)",
    isDark: true,
    primaryColor: "#9c27b0",
    group: "Material",
  },
  {
    key: "material.teal.light",
    name: "Material Türkis (Hell)",
    isDark: false,
    primaryColor: "#009688",
    group: "Material",
  },
  {
    key: "material.teal.dark",
    name: "Material Türkis (Dunkel)",
    isDark: true,
    primaryColor: "#009688",
    group: "Material",
  },

  // Fluent Themes
  {
    key: "fluent.light",
    name: "Fluent (Hell)",
    isDark: false,
    group: "Fluent",
  },
  {
    key: "fluent.dark",
    name: "Fluent (Dunkel)",
    isDark: true,
    group: "Fluent",
  },

  // Generic Themes
  {
    key: "generic.light",
    name: "Generic (Hell)",
    isDark: false,
    group: "Generic",
  },
  {
    key: "generic.dark",
    name: "Generic (Dunkel)",
    isDark: true,
    group: "Generic",
  },
  {
    key: "generic.contrast",
    name: "Generic (Hoher Kontrast)",
    isDark: true,
    group: "Generic",
  },
  {
    key: "generic.carmine",
    name: "Generic Carmine",
    isDark: false,
    primaryColor: "#f05b41",
    group: "Generic",
  },
  {
    key: "generic.darkmoon",
    name: "Generic Dark Moon",
    isDark: true,
    primaryColor: "#3debd3",
    group: "Generic",
  },
  {
    key: "generic.darkviolet",
    name: "Generic Dark Violet",
    isDark: true,
    primaryColor: "#9c63ff",
    group: "Generic",
  },
  {
    key: "generic.greenmist",
    name: "Generic Green Mist",
    isDark: false,
    primaryColor: "#3cbab2",
    group: "Generic",
  },
  {
    key: "generic.softblue",
    name: "Generic Soft Blue",
    isDark: false,
    primaryColor: "#7ab8eb",
    group: "Generic",
  },
];

function App() {
  const [selectedTheme, setSelectedTheme] = useState<string>(
    localStorage.getItem("dx-theme") || "material.blue.light"
  );

  // MUI Theme erstellen basierend auf Hell/Dunkel und Primärfarbe
  const currentTheme = themes.find((t) => t.key === selectedTheme);
  const muiTheme = createTheme({
    palette: {
      mode: currentTheme?.isDark ? "dark" : "light",
      primary: {
        main:
          currentTheme?.primaryColor ||
          (currentTheme?.isDark ? "#90caf9" : "#1976d2"),
      },
      background: {
        default: currentTheme?.isDark ? "#303030" : "#f5f5f5",
        paper: currentTheme?.isDark ? "#424242" : "#fff",
      },
      text: {
        primary: currentTheme?.isDark ? "#fff" : "#000",
        secondary: currentTheme?.isDark
          ? "rgba(255, 255, 255, 0.7)"
          : "rgba(0, 0, 0, 0.6)",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor:
              currentTheme?.primaryColor ||
              (currentTheme?.isDark ? "#424242" : "#1976d2"),
          },
        },
      },
    },
  });

  useEffect(() => {
    // Entferne das alte Theme-Stylesheet
    const oldLink = document.getElementById("dx-theme");
    if (oldLink) {
      oldLink.remove();
    }

    // Füge das neue Theme-Stylesheet hinzu
    const head = document.head;
    const link = document.createElement("link");
    link.id = "dx-theme";
    link.rel = "stylesheet";
    link.href = `https://cdn3.devexpress.com/jslib/24.2.3/css/dx.${selectedTheme}.css`;
    head.appendChild(link);
  }, [selectedTheme]);

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <Router>
        <div
          style={{
            backgroundColor: muiTheme.palette.background.default,
            color: muiTheme.palette.text.primary,
            minHeight: "100vh",
          }}
        >
          <AppBar position="static">
            <Toolbar>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  flexGrow: 1,
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": {
                    color: "rgba(255, 255, 255, 0.8)",
                  },
                }}
              >
                Changelog Manager
              </Typography>
              <Button color="inherit" component={Link} to="/tools">
                Tools
              </Button>
              <Button color="inherit" component={Link} to="/changelog">
                Changelog
              </Button>
              <Button color="inherit" component={Link} to="/settings">
                Einstellungen
              </Button>
            </Toolbar>
          </AppBar>

          <Container sx={{ mt: 4 }}>
            <Routes>
              <Route path="/tools" element={<ToolList />} />
              <Route path="/tools/:id" element={<ToolDetails />} />
              <Route path="/changelog" element={<ChangelogList />} />
              <Route
                path="/settings"
                element={<SettingsPage onThemeChange={handleThemeChange} />}
              />
              <Route path="/" element={<ToolList />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
