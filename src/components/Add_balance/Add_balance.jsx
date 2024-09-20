import React, { useState, useEffect, useRef } from "react";
import styles from "./Add_balance.module.css";
import { ButtonLabel } from "../common/ButtonLabel/ButtonLabel";
import { TransactionForm } from "../TransactionForm/TransactionForm";
import { SaveInvoice } from '../SaveInvoice/SaveInvoice';
import { ReducePrice } from  '../ReducePrice/ReducePrice'  

export function Add_balance({ onBack }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showSaveInvoice, setShowSaveInvoice] = useState(false);
  const [showReduce, setShowReduce] = useState(false);
  const inputButtonRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputButtonRef.current?.focus();
  }, []);

  const handleOptionChange = (option) => {
    setSelectedOption(option); 

    // Resetting states
    setShowSaveInvoice(false);
    setShowTransactionForm(false);
    setShowReduce(false);

    switch (option) {
      case "salvar":
        setShowSaveInvoice(true);
        break;
      case "majorar":
        setShowTransactionForm(true);
        setTimeout(() => inputRef.current?.focus(), 0);
        break;
      case "reduzir":
        setShowReduce(true);
        break;
      default:
        // console.log("Opção desconhecida:", option);
        break;
    }
  };

  const handleCancel = () => {
    setSelectedOption("");
    setShowTransactionForm(false);
    setShowSaveInvoice(false);
    setShowReduce(false);
  };

  return (
    <div>
      {!showTransactionForm && !showSaveInvoice && !showReduce ? (
        <>
          <h6 className={styles.title}>ADICIONAR SALDO</h6>
          <div className={styles.container}>
            <div className={styles.forms}>
              <ButtonLabel text="Qual transação gostaria de realizar?" />
              <div className={styles.optionButton}>
                <button
                  onClick={() => handleOptionChange("majorar")}
                  className={
                    selectedOption === "majorar" ? styles.selected : styles.option
                  }
                >
                  MAJORAR
                </button>
                <button
                  onClick={() => handleOptionChange("salvar")}
                  className={
                    selectedOption === "salvar" ? styles.selected : styles.option
                  }
                >
                  SALVAR
                </button>
                <button
                  onClick={() => handleOptionChange("reduzir")}
                  className={
                    selectedOption === "reduzir" ? styles.selected : styles.option
                  }
                >
                  REDUZIR
                </button>
              </div>
            </div>
          </div>
        </>
      ) : showTransactionForm ? (
        <TransactionForm
          transactionType={selectedOption}
          onCancel={handleCancel}
          initialInputRef={inputRef}
          onBack={onBack}
        />
      ) : showSaveInvoice ? (
        <SaveInvoice 
          transactionType={selectedOption}
          onCancel={handleCancel}          
          onBack={onBack}
        />
      ) : (
        <ReducePrice
          transactionType={selectedOption}
          onCancel={handleCancel}
          onBack={onBack}
        />
      )}
    </div>
  );
}
