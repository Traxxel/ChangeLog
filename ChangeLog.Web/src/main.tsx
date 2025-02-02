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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
