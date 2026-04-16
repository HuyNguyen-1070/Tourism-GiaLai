import { createBrowserRouter } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
const Home = () => <h1 className="text-2xl">Home Page</h1>;
// eslint-disable-next-line react-refresh/only-export-components
const Login = () => <h1 className="text-2xl">Login Page</h1>;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
