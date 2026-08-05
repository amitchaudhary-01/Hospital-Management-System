import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import AOSProvider from "./components/AOSProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AOSProvider>
        <AuthProvider>
          <Toaster position="top-right" />
          <App />
        </AuthProvider>
      </AOSProvider>
    </BrowserRouter>
  </React.StrictMode>
);