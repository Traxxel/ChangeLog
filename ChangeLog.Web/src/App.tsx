import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Layout from "./components/Layout/Layout";
import ToolList from "./components/Tools/ToolList";
import ToolDetails from "./components/Tools/ToolDetails";
import ChangelogList from "./components/Changelog/ChangelogList";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<ToolList />} />
            <Route path="/tools/:id" element={<ToolDetails />} />
            <Route path="/changelog" element={<ChangelogList />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
