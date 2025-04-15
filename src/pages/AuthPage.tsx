import { Navigate } from "react-router-dom";
import Login from "../components/Signin/Login";


export const AuthPage = () => {
    const isAuthenticated = localStorage.getItem("accessToken");
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
  
    return (
      <div className="w-full h-[85vh] mb-16 playfair">
        <Login />
      </div>
    );
}
