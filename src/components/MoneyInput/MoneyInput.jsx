import React, { useState, forwardRef, useEffect } from "react";
import styles from "./MoneyInput.module.css";

// Função debounce fora do componente
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const MoneyInput = forwardRef(
  ({ value, onChange, onValidationChange,placeholder }, ref) => {
    const [inputValue, setInputValue] = useState(value);
    const [isValid, setIsValid] = useState(undefined);  

    useEffect(() => {
      const handler = debounce(() => validateAndNotify(inputValue), 2000);
      handler();
    }, [inputValue]);

    const handleChange = (event) => {
      const newValue = event.target.value.replace(/[^0-9]/g, "");
      const formattedValue = formatCurrency(newValue);
      setInputValue(formattedValue);
      onChange(formattedValue);
    };

    const validateAndNotify = (formattedValue) => {
      const valid = parseFloat(formattedValue.replace(/[R$\.,]/g, "")) > 0;
      setIsValid(valid); // Atualiza o estado de validade
      onValidationChange(valid); // Notifica o componente pai sobre a validação
    };

    function formatCurrency(value) {
      if (value === "") return "R$ 0,00";
      const numericValue = parseInt(value, 10);
      const integerPart = Math.floor(numericValue / 100);
      const decimalPart = numericValue % 100;
      const formattedInteger = integerPart.toLocaleString("pt-BR");
      const formattedDecimal = decimalPart.toString().padStart(2, "0");
      return `R$ ${formattedInteger},${formattedDecimal}`;
    }
    const inputClass = isValid === true ? styles.validInput : styles.input;
    return (
      <input
        className={inputClass}
        ref={ref}
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
    );
  }
);

export default MoneyInput;
