// import { createBrowserRouter } from "react-router-dom";
// import App from "../App";
// // import Login from '../Login'
// import Home from '../Home'

// const Router = createBrowserRouter([
//     {
//         path : "/",
//         element: <App />,
//         children: [
//             // { path: "/",
//             //   element: <Login /> 
//             // },

//             {
//                 path: "/Home",
//                 element: <Home />
//             },

          

//         ]
//     },
// ]);

// export default Router;



import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
]);

export default Router;
