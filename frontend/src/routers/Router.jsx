import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login";
import App from "../App";
import SignUp from "../components/SignUp";
import Home from "../pages/Home";
import Dashboard from "../pages/DashBoard";
import DonatePage from "../pages/DonatePage";
import { Navigate } from "react-router-dom";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
      {
        path: "/",
        element: <Navigate to="/SignUp" replace />
      },
      {
          path: "/Login",
          element: <Login />
      },
      {
          path:"/SignUp",
          element:<SignUp />
      },

      {
        path:"/Home",
        element:<Home />
        
      },
      {
        path:"/Dashboard",
        element:<Dashboard />
      },
      {
        path:"/DonatePage",
        element:<DonatePage />
      },
    ]
  },
]);


export default Router;
