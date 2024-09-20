import React, { useEffect, useState } from "react";
import styles from "./FlashMessage.module.css";

const FlashMessage = ({ message, duration = 500000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return <div className={styles.flashMessage}>{message}</div>;
};

export default FlashMessage;
