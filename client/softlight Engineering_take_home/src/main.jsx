import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Callback from "./Callback.jsx";
import "./index.css";

function RouterShim() {
  if (window.location.pathname.startsWith("/callback")) {
    return <Callback />;
  }
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterShim />
  </React.StrictMode>
);