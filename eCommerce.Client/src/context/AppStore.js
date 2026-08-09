import React, { createContext, useState } from "react";
import { isObject, merge } from "lodash";
import { defaultStates, initialStates } from "./constant";

export const AppContext = createContext(initialStates);

const userDetails = JSON.parse(localStorage.getItem("pharmaforce")) || {};
initialStates.userDetails = userDetails;

const AppStore = ({ children }) => {
  const [states, updateState] = useState(initialStates);
  const [shouldCloseDrawer, setShouldCloseDrawer] = useState("");
  const setStates = (key, states) => {
    if (isObject(states)) {
      initialStates[key] = {
        ...initialStates[key],
        ...states,
      };
    } else {
      initialStates[key] = states;
    }
    updateState({ ...initialStates });
  };
  const resetStates = (key) => {
    initialStates[key] = {
      ...initialStates[key],
      ...merge(initialStates[key], defaultStates[key]),
    };
    updateState({ ...initialStates });
  };
  const contextValue = {
    states,
    setStates,
    resetStates,
    shouldCloseDrawer,
    setShouldCloseDrawer,
  };
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppStore;

