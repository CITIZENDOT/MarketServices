import React from "react";
import ReactDOM from "react-dom";
import { ProvideAuth } from "./use-auth.js";
import { BrowserRouter } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ProvideAuth>
        <App />
      </ProvideAuth>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
