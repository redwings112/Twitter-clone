import React from "react";
import { Navigate } from "react-router-dom";

// PrivateRoute Component to protect routes
const PrivateRoute = ({ children, currentUser }) => {
  return currentUser ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
