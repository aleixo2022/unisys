import React, { useState, useRef, useEffect, useMemo } from "react";
import debounce from 'lodash/debounce';
import styles from "./ReducePrice.module.css";
import checkIcon from "../../assets/images/check_icon.svg";
import errorIcon from "../../assets/images/error.svg";
import loadingIcon from "../../assets/images/loading.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faMoneyCheckDollar,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import invoicesData from "../../../invoicesData.json";
import productsData from "../TransactionForm/productsData.json";
import MoneyInput from "../MoneyInput/MoneyInput";
import TextAreaInput from "../TextAreaInput/TextAreaInput";
import { useFlash } from "../contexts/FlashContext";
import TypingBalloon from '../TypingBalloon/TypingBalloon';

export function ReducePrice({ onSubmit, transactionType, onCancel, onBack }) {
  const { setFlashMessage } = useFlash();
  const [invoice, setInvoice] = useState("");
  const [invoiceValidate, setInvoiceValidate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const invoiceRef = useRef(null);
  const [showBalloon, setShowBalloon] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState("");
  const [isPulsing, setIsPulsing] = useState(false);


  const [codeInputValue, setCodeInputValue] = useState("");
  const [codeInputValidate, setCodeInputValidate] = useState(null);
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  const codeRef = useRef(null);

  const [productDetail, setProductDetail] = useState(null);
  const [consumeStock, setConsumeStock] = useState("");
  const [consumeStockValidate, setConsumeStockValidate] = useState(null);
  const stockRef = useRef();
  const newInputRef = useRef();

  const [moneyValue, setMoneyValue] = useState("");
  const [moneyValid, setMoneyValid] = useState(undefined);
  const moneyInputRef = useRef(null);
  const [convertMoney,setConvertMoney] = useState(null);
  

  const [observation, setObservation] = useState("");
  const [observationValid, setObservationValid] = useState(false);
  const textAreaRef = useRef(null);

  const [autoText, setAutoText] = useState(""); // Guarda o texto digitado automaticamente
const [isTyping, setIsTyping] = useState(false); // Controla se a autodigitação está ativa


const simulateTyping = (text, delay = 100) => {
  let index = 0;
  setIsTyping(true);
  const type = () => {
    if (index < text.length) {
      setAutoText((prev) => prev + text[index]);
      index++;
      setTimeout(type, delay);
    } else {
      setIsTyping(false);
    }
  };
  type();
};




  useEffect(() => {
    invoiceRef.current?.focus();
  }, []);

  useEffect(() => {
    if (invoice) {
      setIsLoading(true);
      const timeout = setTimeout(() => {
        const invoiceFound = invoicesData.find(product => product.nota === invoice);
        setInvoiceValidate(!!invoiceFound);
        if (invoiceFound) {
          setInvoiceDetail(invoiceFound);
          setShowBalloon(true);
          setTimeout(() => codeRef.current?.focus(), 0);
        } else {
          setShowBalloon(false);
        }
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timeout);
    } else {
      setInvoiceValidate(null);
      setIsLoading(false);
      setShowBalloon(false);
    }
  }, [invoice]);
  
  
  
  const validateProductCode = () => {
    const isValid = productsData.some(prod => prod.codigo === codeInputValue && prod.saldodia > 0);
    const productDetails = productsData.find(prod => prod.codigo === codeInputValue && prod.saldodia > 0); 
    setProductDetail(productDetails);
    setCodeInputValidate(isValid);
    setIsLoadingCode(false);
  };

  const debouncedValidateProductCode = useMemo(() => debounce(validateProductCode, 300), [codeInputValue, productsData]);

  useEffect(() => {
    if (codeInputValue) {
      setIsLoadingCode(true);
      debouncedValidateProductCode();
    } else {
      setCodeInputValidate(null);
      setIsLoadingCode(false);
    }
    return () => {
      debouncedValidateProductCode.cancel();
      setIsLoadingCode(false);
    };
  }, [codeInputValue, debouncedValidateProductCode]);

  useEffect(() => {
    if (codeInputValidate) {
      stockRef.current?.focus();
    }
  }, [codeInputValidate])

  useEffect(() => {
    if (consumeStock) {     
      const validConsumption = parseInt(consumeStock) <= productDetail.saldodia;
      setConsumeStockValidate(validConsumption);
      if (validConsumption) {
        moneyInputRef.current?.focus();
      }
    } else {
      setConsumeStockValidate(null);
    }
  }, [consumeStock, productDetail]);


  useEffect(() => {
    if (moneyValid) {
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 0);
    }
  }, [moneyValid]);
  useEffect(() => {
    if (moneyValue && moneyValue.trim() !== "") {
      setIsPulsing(true);
      const timer = setTimeout(() => {
        setIsPulsing(false);
      }, 1000);  
      return () => clearTimeout(timer);
    }
  }, [moneyValue]);



  const clearInvoiceInput = () => {
    setInvoice("");    
    invoiceRef.current?.focus();
  };
  const clearCodeInput = () => {  
    setCodeInputValue("");  
    codeRef.current?.focus();
  };
  const clearStockInput = () => {  
    setConsumeStock("");
    stockRef.current?.focus();
  };
  

  useEffect(()=>{
    if(moneyValid){
      setConvertMoney(parseFloat(moneyValue.replace("R$ ", "").replace(".", "").replace(",", ".")));
     
    }    
  })
   
  const handleSubmit = () => {
    const transactionData = {
      invoice,
      codeInputValue,
      consumeStock,
      moneyValue,
      observation,
      transactionType,      
    };
 
    setFlashMessage("Cadastro Realizado com Sucesso!");
    onBack();
  };

  return (
  
   <>
    <TypingBalloon text="Olá! Aqui você reduz o preço do produto no BI!" />
    <div className={styles.container}>
  
      <FontAwesomeIcon icon={faTimesCircle} onClick={onCancel} className={styles.cancelIcon} />

      <div className={styles.transacao}>
        <FontAwesomeIcon icon={faMoneyCheckDollar} className={`${styles.gearIcon} fa-flip`} />
        <span className={styles.transaction}>Transação</span>
        <FontAwesomeIcon icon={faArrowRight} className={styles.next} />
        {transactionType}
      </div>
      <div className={styles.inputGroupAlpha}>
        <div className={styles.inputBlock}>
          <input
            ref={invoiceRef}
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            type="text"
            placeholder="Chave ou nota fiscal"
            className={invoiceValidate !== null ? (invoiceValidate ? styles.textInputValid : styles.textInputInvalid) : styles.textInput}
          />
          {isLoading ? (
            <img src={loadingIcon} alt="carregando" className={styles.loadingIcon} />
          ) : (
            invoiceValidate !== null &&
            (invoiceValidate ? (
              <img src={checkIcon} alt="Nota fiscal Validada" className={styles.checkIcon} />
            ) : (
              <img src={errorIcon} alt="Nota fiscal invalida" className={styles.errorIcon} onClick={clearInvoiceInput} />
            ))
          )}
        </div>

        {showBalloon && (
    <div className={isPulsing ? `${styles.balloon} ${styles.pulsing}` : styles.balloon}>
        <p>Sua nota esta com um saldo de R$ {invoiceDetail.saldo > convertMoney ?(invoiceDetail.saldo-convertMoney).toFixed(2):0}</p>
      </div>
    )}

        {invoiceValidate && (
          <div className={styles.inputBlock}>
            <input
              ref={codeRef}
              type="text"
              value={codeInputValue}
              onChange={(e) => {
                setCodeInputValue(e.target.value);
                setIsLoadingCode(true);
              }}
              placeholder="Código ou SKU"
              className={codeInputValidate !== null ? (codeInputValidate ? styles.textInputValid : styles.textInputInvalid) : styles.textInput}
            />
            {isLoadingCode ? (
              <img src={loadingIcon} alt="carregando" className={styles.loadingIcon} />
            ) : (
              codeInputValidate !== null && (
                codeInputValidate ? (
                  <img src={checkIcon} alt="Código validado" className={styles.checkIcon} />
                ) : (
                  <img src={errorIcon} alt="Código não validado" className={styles.errorIcon} onClick={clearCodeInput}/>
                )
              )
            )}
          </div>
        )}

        {codeInputValidate && (
          <div className={styles.inputBlock}>
            <input
              ref={stockRef}
              type="number"
              value={consumeStock}
              onChange={(e) => setConsumeStock(e.target.value)}
              placeholder="Usar do Estoque?"
              
              className={consumeStockValidate !== null ? (consumeStockValidate ? styles.textInputValid : styles.textInputInvalid) : styles.textInput}
            />
            {consumeStockValidate !== null && (
              consumeStockValidate ? (
                <img src={checkIcon} alt="Estoque validado" className={styles.checkIcon} />
              ) : (
                <img src={errorIcon} alt="Estoque inválido" className={styles.errorIcon} onClick={clearStockInput} />
              )
            )}
          </div>
        )}

        {consumeStockValidate && (
          <div className={styles.inputBlock}>
            <MoneyInput 
            placeholder="Consumir R$ 1,00?"
            ref={moneyInputRef}
            value={moneyValue}
            onChange={setMoneyValue}
            onValidationChange={setMoneyValid}
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
    </div>
   </>
  );
}
