import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login";
import App from "../App";
import SignUp from "../components/SignUp";
import Home from "../pages/Home";
import Dashboard from "../pages/DashBoard";
import DonatePage from "../pages/DonatePage";
import RequestBook from "../pages/RequestBook";
import Notification from "../pages/Notification";
import PrivateRoute from "../components/PrivateRoute"; // Adjust path as needed
import { Navigate } from "react-router-dom";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
      {
        path: "/",
        element: <Navigate to="/Login" replace />
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
          path: "/Home",
          element: (
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          )
      },
      {
        path: "/Dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        )
      },
      {
  path: "/DonatePage",
  element: (
    <PrivateRoute>
      <DonatePage />
    </PrivateRoute>
  )
},
{
  path: "/RequestBook",
  element: (
    <PrivateRoute>
      <RequestBook />
    </PrivateRoute>
  )
},
{
  path: "/notifications",
  element: (
    <PrivateRoute>
      <Notification />
    </PrivateRoute>
  )
}

    ]
  },
]);


export default Router;
