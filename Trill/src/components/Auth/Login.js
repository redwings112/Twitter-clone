import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const { login } = useContext(UserContext);

  const handleLogin = () => {
    const userData = {
      id: 1,
      name: "John Doe",
      bio: "Software Developer",
      address: "123 Main St",
      profileImage: "profile.jpg",
    };
    login(userData);
  };

  return <button onClick={handleLogin}>Log In</button>;
};

export default Login;
