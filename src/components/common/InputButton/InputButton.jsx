import React from "react";
import styles from "./InputButton.module.css";

function InputButtonComponent(
  { type = "text", placeholder, value, onChange, isValid, isInvalid },
  ref
) {
  let inputClass = styles.customInput;
  if (isValid) {
    inputClass = styles.validInput;
  } else if (isInvalid) {
    inputClass = styles.invalidInput;
  }
  
  return (
    <input
      ref={ref}  
      type={type}
      className={inputClass}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export const InputButton = React.forwardRef(InputButtonComponent);
