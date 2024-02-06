import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App";
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";
import Projects from "./Pages/Projects";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/log-in",
        element: <LogIn />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<RouterProvider router={router} />);