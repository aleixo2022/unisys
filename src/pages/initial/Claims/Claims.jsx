import React, { useState, useEffect } from "react";
import { Header } from "../../../components/Header/Header";
import styles from "./claims.module.css";
import { OptionsCard } from "../OptionsCard/OptionsCard";
import axios from '../../../services/axiosConfig';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../../../features/session/sessionSlice';
import { FaChartBar, FaClipboardList, FaChartPie, FaBoxes } from 'react-icons/fa';

function calculateOrders(data) {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  let ordersToday = 0;
  let ordersThisMonth = 0;
  let quantityToday = 0;
  let quantityThisMonth = 0;

  Object.values(data).forEach(profile => {
    profile.orders.forEach(order => {
      const orderDate = new Date(order.date_created);

      if (orderDate >= startOfToday) {
        ordersToday += order.items.reduce((total, item) => total + (parseFloat(item.unit_price) * item.quantity), 0);
        quantityToday += order.items.reduce((total, item) => total + item.quantity, 0);
      }

      if (orderDate >= startOfMonth) {
        ordersThisMonth += order.items.reduce((total, item) => total + (parseFloat(item.unit_price) * item.quantity), 0);
        quantityThisMonth += order.items.reduce((total, item) => total + item.quantity, 0);
      }
    });
  });

  return { ordersToday, ordersThisMonth, quantityToday, quantityThisMonth };
}


export function Indicadores() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [ordersToday, setOrdersToday] = useState(0);
  const [ordersThisMonth, setOrdersThisMonth] = useState(0);
  const [quantityToday, setQuantityToday] = useState(0);
  const [quantityThisMonth, setQuantityThisMonth] = useState(0);
  const [data, setData] = useState({});
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const updateOrder = await axios.get('/api/orders_info');
        console.log(updateOrder.data);
        const response = await axios.get('/api/order_items');        
        const result = response.data;
        setData(result);
        const { ordersToday, ordersThisMonth, quantityToday, quantityThisMonth } = calculateOrders(result);
        setOrdersToday(ordersToday);
        setOrdersThisMonth(ordersThisMonth);
        setQuantityToday(quantityToday);
        setQuantityThisMonth(quantityThisMonth);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
      }
    };

    fetchOrders();
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
                <div className={styles.title}>Pedidos Hoje</div>
                <div className={styles.line}></div>
                <div className={styles.value}><FaChartBar /> {`R$ ${ordersToday.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</div>
               
              </div>
              <div className={styles.kpi}>
                <div className={styles.title}>Quantidade de Hoje</div>
                <div className={styles.line}></div>               
                <div className={styles.quantity}><FaBoxes /> {`Qtd: ${quantityToday}`}</div>
              </div>
              <div className={styles.kpi}>
                <div className={styles.title}>Pedidos do Mês</div>
                <div className={styles.line}></div>
                <div className={styles.value}><FaChartPie /> {`R$ ${ordersThisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</div>
                
              </div>
              <div className={styles.kpi}>
                <div className={styles.title}>Quantidade do Mês</div>
                <div className={styles.line}></div>                
                <div className={styles.quantity}><FaClipboardList />  {`Qtd: ${quantityThisMonth}`}</div>
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
