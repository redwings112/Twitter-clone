import React, { createContext, useState, useEffect } from "react";

// Create the UserContext
const UserContext = createContext();

// UserProvider component to wrap around the app
const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    name: "",
    bio: "",
    address: "",
    profileImage: "",
    loggedIn: false,
  });

  // Load user data from local storage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user data to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const login = (userData) => {
    setUser({ ...userData, loggedIn: true });
  };

  const logout = () => {
    setUser({
      id: null,
      name: "",
      bio: "",
      address: "",
      profileImage: "",
      loggedIn: false,
    });
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };