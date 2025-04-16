import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login";
import App from "../App";
import SignUp from "../components/SignUp";
import Home from "../pages/Home";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
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
    ]
  },
]);


export default Router;
