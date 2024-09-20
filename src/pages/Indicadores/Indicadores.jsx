import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header/Header";
import styles from "./Indicadores.module.css";
import { OptionsCard } from "../../components/OptionsCard/OptionsCard";
import { Add_balance } from "../../components/Add_balance/Add_balance";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../../features/session/sessionSlice';

export function Indicadores() {
  const [selectedOption, setSelectedOption] = useState(null);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  
  useEffect(() => {  
    if (!isAuthenticated) {
      navigate('/');
        return;
    }
  }, [isAuthenticated, navigate]);

 const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const resetOption = () => {
    setSelectedOption(null);
  };
  const renderOption = () => {
    switch (selectedOption) {
      case "add_balance":
        return <Add_balance onBack={resetOption} />;
      default:
        return <div>Nada selecionado</div>;
    }
  };

  if (!isAuthenticated) {
    return null; // Renderiza nada se o usuário não estiver autenticado
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.area}>
          {!selectedOption && (
            <div className={styles.indicator}>
              <div className={styles.kpi}>
                <div className={styles.title}>Total de Bonificações</div>
                <div className={styles.line}></div>
                <div className={styles.value}>R$ 1.350.225.150,22</div>
              </div>
              <div className={styles.kpi}>
                <div className={styles.title}>Bonificações do Mês</div>
                <div className={styles.line}></div>
                <div className={styles.value}>R$ 350.256,25</div>
              </div>
            </div>
          )}
        </div>
        <div className={`${styles.area} ${styles.centerArea}`}>
          {selectedOption ? (
            renderOption()
          ) : (
            <OptionsCard onOptionClick={handleOptionClick} />
          )}
        </div>
      </div>
    </div>
  );
}
