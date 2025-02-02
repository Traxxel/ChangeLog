import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { licenseKey } from "./devextreme-license";
import config from "devextreme/core/config";
import "devextreme/dist/css/dx.light.css";

// DevExpress Lizenzschlüssel setzen
config({
  licenseKey: licenseKey,
});

// Lade das gespeicherte Theme oder verwende das Standard-Theme
const savedTheme = localStorage.getItem("dx-theme") || "material.blue.light";
const link = document.createElement("link");
link.id = "dx-theme";
link.rel = "stylesheet";
link.href = `https://cdn3.devexpress.com/jslib/24.2.3/css/dx.${savedTheme}.css`;
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
