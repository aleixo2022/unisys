import React, { useState, forwardRef } from "react";
import styles from "./TextAreaInput.module.css";

const TextAreaInput = forwardRef(
  ({ value, onChange, onValidationChange }, ref) => {
    const [isValid, setIsValid] = useState(false);

    const handleChange = (event) => {
      const newValue = event.target.value;
      onChange(newValue);
      const valid = newValue.length > 0;
      setIsValid(valid);
      onValidationChange(valid);
    };
 
    return (
      <textarea
        className={isValid ? styles.validInput : styles.input}
        ref={ref}
        value={value}
        onChange={handleChange}
        placeholder="Adicione uma observação..."
      />
    );
  }
);

export default TextAreaInput;
