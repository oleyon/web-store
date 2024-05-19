import React, { createContext, useContext, useEffect, useReducer } from "react";
import AuthService from "../services/AuthService";

const initialState = {
  user: null,
};

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    AuthService.getUser()
      .then((response) => {
        if (response.data) {
          dispatch({ type: "SET_USER", payload: response.data });
        }
      })
      .catch((err) => {
      });
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
