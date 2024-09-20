import React , {useState, useEffect} from "react";
import styles from "./OptionsCard.module.css";
import add_balance from "../../assets/images/add_balance.svg";
import extract from "../../assets/images/extract.svg";
import metrics from "../../assets/images/metrics.svg";
import analitycs from "../../assets/images/analitycs.svg";
import { useNavigate } from "react-router-dom";
import { useFlash } from "../contexts/FlashContext";

export function OptionsCard({ onOptionClick }) {
  const navigate = useNavigate();
  const { setFlashMessage } = useFlash();  

  const goToExtrato = () => {
      setFlashMessage("Extrato em Desenvolvimento"); 
      // console.log("extrato OK");
  }

  const goToAcoes = () => {
      setFlashMessage("Ações em Desenvolvimento");  
  }

  const goToMeliIndicadores = () => {
      navigate('/meli/indicadores');
  }
  
  return (
    <div>
      <div className={styles.container}>
        <div
          className={styles.options_link}
          onClick={() => {
            onOptionClick("add_balance");
            setFlashMessage(""); // Exibe uma mensagem quando clicado
          }}
        >
          <img src={add_balance} alt="Adicionar Bonificação" />
          <h6 className={styles.title}>Adicionar Bonificação</h6>
        </div>
        
        <div className={styles.options_link} onClick={goToExtrato}>
          <img src={extract} alt="Extrato" />
          <h6 className={styles.title}>Extrato</h6>
        </div>
        <div className={styles.options_link} onClick={goToAcoes}>
          <img src={metrics} alt="Ações" />
          <h6 className={styles.title}>Minhas Ações</h6>
        </div>
        <div className={styles.options_link} onClick={goToMeliIndicadores}>
          <img src={analitycs} alt="Home" />
          <h6 className={styles.title}>Home</h6>
        </div>
      </div>
    </div>
  );
}
