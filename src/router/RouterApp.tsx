import { Routes, Route, BrowserRouter as Router, Navigate } from "react-router-dom";
import { AuthPage } from "../pages/AuthPage";
import Signup from "../components/Signin/Signup";
import PrivateRoute from "./PrivateRoute";
import { ChatRouter } from "./ChatRouter";

export const RouterApp = () => {
  return (
    <Router>
        <Routes>
          <Route path="/chat/*" element={
            <PrivateRoute>
              <ChatRouter />
            </PrivateRoute>
          } />
          <Route path="/signin" element={<AuthPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/chat/" />} />
        </Routes>
    </Router>
  );
};
