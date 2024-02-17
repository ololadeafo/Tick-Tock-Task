import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App";
import './index.css';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";
import Projects from "./Pages/Projects";
import Profile from "./Pages/Profile";
import axios from 'axios';

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
      {
        path: "/profile",
        element: <Profile />,
        loader: async () => {

          const token = localStorage.getItem("token");
          if(token) {
            try {
              const response = await axios.get("http://localhost:3025/auth/profile", {headers: {Authorization: `Bearer ${token}` }});
            return response.data;
          } catch (error) {
            console.log ('ERROR', error);
            return redirect("/log-in");
          }

            } else {
              console.log('NO TOKEN');
              return redirect("/sign-up")
            }
        }
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<RouterProvider router={router} />);

function toast(arg0: { title: string; description: string; status: string; duration: number; isClosable: boolean; }) {
  throw new Error('Function not implemented.');
}
