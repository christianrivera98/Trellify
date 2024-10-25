import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {  HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./app/App";
import { Store } from "./app/store/Store";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={Store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </StrictMode>
);
