import { useContext } from "react";
import { UserContext } from "./UserContext";

const useAuth = () => {
  const { user, login, logout } = useContext(UserContext);

  const isAuthenticated = () => {
    return user.loggedIn;
  };

  return { user, login, logout, isAuthenticated };
};

export default useAuth;
