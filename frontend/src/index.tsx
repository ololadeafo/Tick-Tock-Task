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
import { createStandaloneToast } from '@chakra-ui/react';
import ResetPassword from './Pages/ResetPassword';


const { ToastContainer, toast } = createStandaloneToast();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: async () => {

      const token = localStorage.getItem("token");
      if(token) {
        try {
          const response = await axios.get("http://localhost:3025/auth/profile", {headers: {Authorization: `Bearer ${token}` }});
        return response.data;
      } catch (error) {
        return {};
      }

        } else {
          return {};
        }
    },
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
        loader: async () => {

          const token = localStorage.getItem("token");
          if(token) {
            try {
              const response = await axios.get("http://localhost:3025/auth/user-projects", {headers: {Authorization: `Bearer ${token}` }});
            return response.data;
          } catch (error) {
            toast ({
              title: "An error Occured.",
              description: "You must be signed in to view this page!",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return redirect("/log-in");
          }

            } else {
              toast ({
                title: "An error Occured.",
                description: "You must have an account to view this page!",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
              return redirect("/sign-up")
            }
        },
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
            toast ({
              title: "An error Occured.",
              description: "You must be signed in to view this page!",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return redirect("/log-in");
          }

            } else {
              toast ({
                title: "An error Occured.",
                description: "You must have an account to view this page!",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
              return redirect("/sign-up")
            }
        },
      },
      {
        path: "/reset-password/:token/:id",
        element: <ResetPassword />,
      }
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render( 
  <>
    <ToastContainer />
    <RouterProvider router={router} />
  </>
);
