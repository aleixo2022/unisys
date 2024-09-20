import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TransactionForm.module.css";
import checkIcon from "../../assets/images/check_icon.svg";
import errorIcon from "../../assets/images/error.svg";
import loadingIcon from "../../assets/images/loading.gif";
import { InputButton } from "../common/InputButton/InputButton";
import MoneyInput from "../MoneyInput/MoneyInput";
import TextAreaInput from "../TextAreaInput/TextAreaInput";
import productsData from "./productsData.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faArrowRight, faCog } from "@fortawesome/free-solid-svg-icons";
import { useFlash } from "../contexts/FlashContext";
import TypingBalloon from '../TypingBalloon/TypingBalloon';

export function TransactionForm({
  transactionType, // Tipo de transação (passado como prop)
  initialInputRef, // Referência inicial para o campo de input (passado como prop)
  onCancel, // Função para cancelar a transação (passado como prop)
  onBack // Função para voltar à tela anterior (passado como prop)
}) {
  const navigate = useNavigate();
  const [productCode, setProductCode] = useState(""); // Estado para o código do produto
  const [productValid, setProductValid] = useState(null); // Estado para validar o produto
  const [isLoading, setIsLoading] = useState(false); // Estado para indicar carregamento
  const [observation, setObservation] = useState(""); // Estado para observações
  const [observationValid, setObservationValid] = useState(false); // Estado para validar observações
  const inputRef = useRef(null);
  const [moneyValue, setMoneyValue] = useState(""); // Estado para valor em dinheiro
  const [moneyValid, setMoneyValid] = useState(undefined); // Estado para validar o valor em dinheiro
  const moneyInputRef = useRef(null);
  const textAreaRef = useRef(null);
  const { setFlashMessage } = useFlash(); // Contexto para exibir mensagens de flash
  const [typingMessage, setTypingMessage] = useState("Olá! nesta pagina você podera elevar o preço do produto no BI!")

  useEffect(() => {
    // Efeito para validar o código do produto
    if (productCode) {
      setIsLoading(true);
      const timeout = setTimeout(() => {
        const isValid = productsData.some(
          (product) => product.codigo === productCode
        );
        setProductValid(isValid);
        setIsLoading(false);
        if (isValid) {
          setTypingMessage("Insira um valor positivo para Majoração do Produto agora!")
          setTimeout(() => {            
            moneyInputRef.current?.focus(); // Foca no campo de input de dinheiro se o código for válido
          }, 0);
        }
      }, 2000);
      return () => clearTimeout(timeout);
    } else {
      setProductValid(null);
      setIsLoading(false);
    }
  }, [productCode]);

  useEffect(() => {
    // Efeito para focar no campo de observações se o valor em dinheiro for válido
    if (moneyValid) {
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 0);
    }
  }, [moneyValid]);

  const handleCodeChange = (event) => {
    // Função para lidar com mudanças no código do produto
    setProductCode(event.target.value);
  };

  const clearInput = () => {
    // Função para limpar o campo de input
    setProductCode("");
    setProductValid(null);
    setIsLoading(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (event) => {
    // Função para lidar com a submissão do formulário
    event.preventDefault(); 
    const transactionData = {
      productCode,
      moneyValue,
      observation,
      transactionType,
      productValid,
      moneyValid,
      observationValid,
    };

    setFlashMessage("Cadastro Realizado com Sucesso!"); // Exibe mensagem de sucesso
    onBack(); // Chama a função para voltar à tela anterior
  };
  
  const handleKeyPress = (event) => {
    // Função para lidar com pressionamento de tecla Enter
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  return (
    <>
      <TypingBalloon text={typingMessage} displayDuration={5000}/>
      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <FontAwesomeIcon
            icon={faTimesCircle}
            onClick={onCancel}
            className={styles.cancelIcon}
          />
        </div>
        <span className={styles.transacao}>
          <FontAwesomeIcon icon={faCog} spin className={styles.gearIcon} />
          <span className={styles.transaction}>Transação</span>
          <FontAwesomeIcon icon={faArrowRight} className={styles.next} />
          {transactionType}
        </span>
        <div className={styles.inputGroupAlpha}>
          <div className={styles.inputBlock}>
            <InputButton
              ref={initialInputRef}
              value={productCode}
              onChange={handleCodeChange}
              placeholder="Código ou SKU"
              isValid={productValid === true}
              isInvalid={productValid === false}
            />
            {isLoading ? (
              <img
                src={loadingIcon}
                alt="Carregando"
                className={styles.loadingIcon}
              />
            ) : (
              productValid !== null &&
              (productValid ? (
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
                  onClick={clearInput}
                />
              ))
            )}
          </div>
          {productValid && (
            <div className={styles.inputBlock}>
              <MoneyInput
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
                <button className={styles.buttonMajorar} type="submit">
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
