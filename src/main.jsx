import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Admin from "./pages/Admin.jsx";
import Reserve from "./pages/Reserve.jsx";
import "./style.css";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/reserve", element: <Reserve /> },
  { path: "/admin", element: <Admin /> }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
