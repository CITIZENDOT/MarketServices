import React, { useState, createContext, useContext } from "react";
import axios from "./axios";
import Cookies from "js-cookie";

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(
    Cookies.get("currentUser")
      ? {
          email: Cookies.get("currentUser") || null,
          userRole: Cookies.get("userRole") || null
        }
      : null
  );

  const logIn = async (email, password) => {
    try {
      const response = await axios.post("/user/login", {
        email,
        password
      });
      console.log(response.data);
      const { token, userRole, expiresIn, gatepass } = response.data;
      const options = {
        expires: new Date(expiresIn)
      };
      Cookies.set("token", token, options);
      Cookies.set("currentUser", email, options);
      Cookies.set("userRole", userRole, options);
      setUser({
        email,
        userRole,
        gatepass
      });
    } catch (err) {
      throw err;
    }
  };

  const logOut = () => {
    Cookies.remove("token");
    Cookies.remove("currentUser");
    setUser(null);
  };

  return {
    user,
    logIn,
    logOut
  };
}
