import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Admin from "./pages/Admin.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/admin", element: <Admin /> },
]);

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
