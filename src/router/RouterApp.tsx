import { Routes, Route, BrowserRouter as Router, Navigate } from "react-router-dom";
import { AuthPage } from "../pages/AuthPage";
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
          <Route path="/" element={<Navigate to="/chat/" />} />
        </Routes>
    </Router>
  );
};
