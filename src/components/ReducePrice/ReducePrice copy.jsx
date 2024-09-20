import React, { useState, useRef } from "react";
import styles from './ReducePrice.module.css';
import TextAreaInput from "../TextAreaInput/TextAreaInput";
import MoneyInput from "../MoneyInput/MoneyInput";
import checkIcon from "../../assets/images/check_icon.svg";
import errorIcon from "../../assets/images/error.svg";
import loadingIcon from "../../assets/images/loading.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import invoicesData from '../../../invoicesData.json'
import productsData from '../TransactionForm/productsData.json';

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const context = this;  // Preservando o contexto
    const later = () => {
      clearTimeout(timeout);
      func.apply(context, args);  // Usando apply para manter o contexto
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}


export function ReducePrice({ onSubmit, transactionType, onCancel, onBack }) {
  const [invoiceInput, setInvoiceInput] = useState('');
  const [productCode, setProductCode] = useState('');
  const [useAmount, setUseAmount] = useState('');
  const [moneyValue, setMoneyValue] = useState('');
  const [observation, setObservation] = useState('');
  const [observationValid, setObservationValid] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const invoiceRef = useRef(null);
  const productCodeRef = useRef(null);
  const useAmountRef = useRef(null);
  const moneyInputRef = useRef(null);
  const observationRef = useRef(null);

  // Debounced validation functions
  const debouncedValidateInvoice = debounce(() => {
    setIsLoading(true);
    const foundInvoice = invoicesData.find(inv => inv.nota == invoiceInput && inv.saldo > 0);
    setIsLoading(false);
    if (foundInvoice) {
      setInvoiceData(foundInvoice);
    } else {
      setError('Nota fiscal inválida ou saldo insuficiente');
      setInvoiceData(null);
    }
  }, 300);

  const debouncedValidateProductCode = debounce(() => {
    setIsLoading(true);
    const foundProduct = productsData.find(prod => prod.codigo == productCode && prod.saldodia > 0);
    setIsLoading(false);
    if (foundProduct) {
      setProductData(foundProduct);
    } else {
      setError('Produto inválido ou saldodia insuficiente');
      setProductData(null);
    }
  }, 300);

  // Handle input changes
  const handleInvoiceInput = (e) => {
    setInvoiceInput(e.target.value);
    debouncedValidateInvoice();
  };

  const handleProductCodeInput = (e) => {
    setProductCode(e.target.value);
    debouncedValidateProductCode();
  };

  const handleUseAmountInput = (e) => {
    setUseAmount(e.target.value);
    if (parseInt(e.target.value) > 0 && parseInt(e.target.value) <= productData.saldodia) {
      setMoneyInputRef.current?.focus();
    } else {
      setError('Quantidade inválida');
    }
  };

  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faTimesCircle} onClick={onCancel} className={styles.cancelIcon} />
      {isLoading && <img src={loadingIcon} alt="Carregando" className={styles.loadingIcon} />}
      <input
        className={styles.invoice}
        ref={invoiceRef}
        type="text"
        value={invoiceInput}
        onChange={handleInvoiceInput}
        placeholder="Chave ou Nota Fiscal"
      />
      {invoiceData && (
        <>
          <input
            className={styles.codigo}
            ref={productCodeRef}
            type="text"
            value={productCode}
            onChange={handleProductCodeInput}
            placeholder="Código do Produto"
          />
          {productData && (
            <>
              <input
                className={styles.useAmount}
                ref={useAmountRef}
                type="number"
                value={useAmount}
                onChange={handleUseAmountInput}
                placeholder="Quantidade a Usar"
              />
              <MoneyInput
                ref={moneyInputRef}
                value={moneyValue}
                onChange={setMoneyValue}
                placeholder="Consumir Valor da Nota Fiscal"
              />
              <TextAreaInput
                ref={textAreaRef}
                value={observation}
                onChange={setObservation}
                onValidationChange={setObservationValid}
              />
            </>
          )}
        </>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
