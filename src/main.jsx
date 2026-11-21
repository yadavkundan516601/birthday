import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/quicksand";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/dancing-script";
import "./index.css";
import config from "./config";
import App from "./App.jsx";

document.title = `Happy Birthday ${config.birthdayPerson} 🎀`;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
