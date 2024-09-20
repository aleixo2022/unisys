import React, { createContext, useContext, useState } from "react";
import styles from "./FlashContext.module.css";
const FlashContext = createContext();

export const useFlash = () => useContext(FlashContext);
export const FlashProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const setFlashMessage = (msg) => {
    setMessage(msg);

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <FlashContext.Provider value={{ message, setFlashMessage }}>
      {children}
      {message && <div className={styles.container}>{message}</div>}
    </FlashContext.Provider>
  );
};
