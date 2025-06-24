"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
// Create the UserContexti
import api from "@/utilities/api"; // Import the API utility
export const UserContext = createContext({
  user: {
    BirthDate: null,
    Gender: null,
    UserImage: null,
    Username: null,
    email: null,
    id: null,
    userPharmacy: [
      {
        Address: null,
        Description: null,
        ID: null,
        Location: {
          points: [
            {
              lat: null,
              lng: null,
            },
          ],
        },
        Logo: null,
        PharmacyName: null,
        Phone: null,
        UserID: null,
      },
    ],
  },
  login: () => Promise.resolve(),
  logOut: () => Promise.resolve(),
  SignUp: (userData = {}) => Promise.resolve(),
  isUserAuthenticated: () => false,
  userLoading: true,
  setUser: () => {},
  userAuthed: false,
});

// Create a Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Manage user data in state
  const [userAuthed, setUserAuthed] = useState(false); // Manage user authentication state
  const [userLoading, setUserLoading] = useState(true); // Manage loading state for user data
  const logOut = async () => {
    try {
      const response = await api.post("auth/signOut");
      setUserAuthed(false);
      setUser(null);
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  console.log(user);

  const login = async ({ email, password }) => {
    try {
      const response = await api.post(`auth/signin`, {
        email,
        password,
      });

      const { user } = response.data;

      setUser({
        ...user,
      });

      setUserAuthed(true);

      return Promise.resolve("Login successful");
    } catch (error) {
      return Promise.reject(error.response.data.message || "Login failed");
    }
  };
  const SignUp = async (userData) => {
    try {
      const response = await api.post(`auth/signup`, userData);
      const { user } = response.data;

      setUser({
        ...user,
      });
      setUserAuthed(true);

      return Promise.resolve("Sign up successful");
    } catch (error) {
      return Promise.reject(error || "Sign up failed");
    }
  };
  const checkUserAuth = async () => {
    setUserLoading(true); // Set loading state to true while checking auth
    try {
      const response = await api.get("auth/checkAuth");
      console.log(response.data);
      setUser(response?.data?.user);
      setUserAuthed(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserAuthed(false);
    } finally {
      setUserLoading(false);
    }
  };
  const isUserAuthenticated = () => {
    return userAuthed;
  };
  useEffect(() => {
    checkUserAuth();
  }, []);
  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logOut,
        SignUp,
        setUser,
        isUserAuthenticated,
        userLoading,
        userAuthed,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
