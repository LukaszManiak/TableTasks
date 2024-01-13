import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";
import { TableProvider } from "./contexts/TableContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TableProvider>
      <App />
    </TableProvider>
  </React.StrictMode>
);
