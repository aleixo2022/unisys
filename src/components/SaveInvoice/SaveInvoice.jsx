import React, { useState, useEffect, useRef } from "react";
import styles from "./SaveInvoice.module.css";
import MoneyInput from "../MoneyInput/MoneyInput";
import TextAreaInput from "../TextAreaInput/TextAreaInput";

import loadingIcon from "../../assets/images/loading.gif";
import productsData from "../TransactionForm/productsData.json";
import errorIcon from "../../assets/images/error.svg";
import checkIcon from "../../assets/images/check_icon.svg";
import { useFlash } from "../contexts/FlashContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faMoneyCheckDollar,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import TypingBalloon from '../TypingBalloon/TypingBalloon';

export function SaveInvoice({ onSubmit, transactionType, onCancel, onBack }) {
  const [invoiceInput, setInvoiceInput] = useState("");
  const [invoiceValid, setInvoiceValid] = useState(null); // Usamos null para estado inicial (não verificado)
  const [isLoading, setIsLoading] = useState(false);
  const invoiceRef = useRef(null);
  const [moneyValue, setMoneyValue] = useState("");
  const [moneyValid, setMoneyValid] = useState(undefined);
  const moneyInputRef = useRef(null);
  const textAreaRef = useRef(null);
  const [observation, setObservation] = useState("");
  const [observationValid, setObservationValid] = useState(false);
  const { setFlashMessage } = useFlash();

  useEffect(() => {
    invoiceRef.current?.focus();
  }, []);

  useEffect(() => {
    if (invoiceInput) {
      setIsLoading(true);
      const timeout = setTimeout(() => {
        const isValid = productsData.some(product => product.nota === invoiceInput);
        setInvoiceValid(isValid);
        setIsLoading(false);
        if (isValid) {
          setTimeout(() => {
            moneyInputRef.current?.focus();
          }, 0);
        }
      }, 2000);
      return () => clearTimeout(timeout);
    } else {
      setInvoiceValid(null);
      setIsLoading(false);
    }
  }, [invoiceInput]);
  

  useEffect(() => {
    if (moneyValid) {
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 0);
    }
  }, [moneyValid]);

  const clearCodeInput = () => {
    setInvoiceInput("");
    invoiceRef.current?.focus();
  };

  const handleSubmit = () => {
    const transactionData = {
      invoiceInput,
      moneyValue,
      observation,
      transactionType,
      invoiceValid,
      moneyValid,
      observationValid,
    };
    console.log(transactionData);
    setFlashMessage("Cadastro Realizado com Sucesso!");
    onBack();
  };

  return (
   <>
    <TypingBalloon text="Olá! nesta pagina você podera apenas Salvar a Bonificação!" />
    <form className={styles.container}>
      <FontAwesomeIcon
        icon={faTimesCircle}
        onClick={onCancel}
        className={styles.cancelIcon}
      />
      <div className={styles.transacao}>
        <FontAwesomeIcon
          icon={faMoneyCheckDollar}
          className={`${styles.gearIcon} fa-flip`}
        />
        <span className={styles.transaction}>Transação</span>
        <FontAwesomeIcon icon={faArrowRight} className={styles.next} />
        {transactionType}
      </div>
      <div className={styles.inputGroupAlpha}>
        <div className={styles.inputBlock}>
          <input
            ref={invoiceRef}
            value={invoiceInput}
            onChange={(e) => setInvoiceInput(e.target.value)}
            type="text"
            placeholder="Chave ou Nota Fiscal"
            className={
              invoiceValid !== null
                ? invoiceValid
                  ? `${styles.textInputValid} ${styles.validInput}`
                  : styles.textInput
                : styles.textInput
            }
          />
          {isLoading ? (
            <img
              src={loadingIcon}
              alt="Carregando"
              className={styles.loadingIcon}
            />
          ) : (
            invoiceValid !== null &&
            (invoiceValid ? (
              <img
                src={checkIcon}
                alt="Validado"
                className={styles.checkIcon}
              />
            ) : (
              <img
                src={errorIcon}
                alt="Inválido"
                className={styles.errorIcon}
                onClick={clearCodeInput}
              />
            ))
          )}
        </div>
        {invoiceValid && (
          <div className={styles.inputBlock}>
            <MoneyInput
              ref={moneyInputRef}
              value={moneyValue}
              onChange={setMoneyValue}
              onValidationChange={setMoneyValid}
              placeholder="Valor da Bonificação"
            />
            {moneyValid !== null &&
              (moneyValid ? (
                <img
                  src={checkIcon}
                  alt="Validado"                 
                  className={styles.checkIcon}
                />
              ) : (
                <img
                  src={errorIcon}
                  className={styles.errorIcon}
                  alt="Inválido"
                />
              ))}
          </div>
        )}
        {moneyValid && (
          <div className={styles.inputBlock}>
            <TextAreaInput
              ref={textAreaRef}
              value={observation}
              onChange={setObservation}
              onValidationChange={setObservationValid}
            />
            {observationValid && (
              <button className={styles.buttonMajorar} onClick={handleSubmit}>
                Salvar saldo
              </button>
            )}
          </div>
        )}
      </div>
    </form>
   </>
  );
}
