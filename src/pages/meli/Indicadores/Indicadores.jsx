import React, { useState, useEffect } from "react";
import { Header } from "../../../components/Header/Header";
import styles from "./indicadores.module.css";
import { OptionsCard } from "../OptionsCard/OptionsCard";
import axios from '../../../services/axiosConfig';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../../../features/session/sessionSlice';
import { FaChartBar, FaClipboardList, FaChartPie, FaBoxes } from 'react-icons/fa';
import Spinner from '../../../assets/images/loading.gif'; // Importação do GIF de loading

export function Indicadores() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [orderSummary, setOrderSummary] = useState({
    orders_count_today: 0,
    orders_count_this_month: 0,
    orders_today: 0,
    quantity_today: 0,
    orders_this_month: 0,
    quantity_this_month: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchOrderSummary = async () => {
      try {
        const response = await axios.get('/api/order_summary');
        const result = response.data.order_summary; // Extrai o resumo do pedido do JSON retornado
        setOrderSummary(result); // Define os dados do resumo do pedido
        setIsLoading(false); // Dados carregados, desativa o loading
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        setIsLoading(false); // Mesmo em caso de erro, desativa o loading
      }
    };

    fetchOrderSummary();
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

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.area}>
          {!selectedOption && (
            <div className={styles.indicator}>
              <div className={styles.kpi}>
                <div className={styles.title}>Pedidos de Hoje</div>
                <div className={styles.line}></div>
                <div className={styles.value}>
                  {isLoading ? (
                    <img src={Spinner} alt="Loading..." className={styles.spinner} />
                  ) : (
                    <>
                      <FaBoxes />
                      {` Contagem: ${orderSummary.orders_count_today}`}
                    </>
                  )}
                </div>
              </div>

              <div className={styles.kpi}>
                <div className={styles.title}>Pedidos do Mês</div>
                <div className={styles.line}></div>
                <div className={styles.value}>
                  {isLoading ? (
                    <img src={Spinner} alt="Loading..." className={styles.spinner} />
                  ) : (
                    <>
                      <FaClipboardList />
                      {` Contagem: ${orderSummary.orders_count_this_month}`}
                    </>
                  )}
                </div>
              </div>

              <div className={styles.kpi}>
                <div className={styles.title}>Venda de Hoje (R$)</div>
                <div className={styles.line}></div>
                <div className={styles.value}>
                  {isLoading ? (
                    <img src={Spinner} alt="Loading..." className={styles.spinner} />
                  ) : (
                    <>
                      <FaChartBar />
                      {` R$ ${orderSummary.orders_today.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </>
                  )}
                </div>
              </div> 

              <div className={styles.kpi}>
                <div className={styles.title}>Vendas do Mês</div>
                <div className={styles.line}></div>
                <div className={styles.value}>
                  {isLoading ? (
                    <img src={Spinner} alt="Loading..." className={styles.spinner} />
                  ) : (
                    <>
                      <FaChartPie />
                      {` R$ ${orderSummary.orders_this_month.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </>
                  )}
                </div>
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
