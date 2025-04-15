import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login";
import App from "../App";
import SignUp from "../components/SignUp";

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
    ]
  },
]);


export default Router;
