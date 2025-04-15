import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem("accessToken");

  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;