import React, { useState, useEffect } from "react";
import axios from '../../../services/axiosConfig';
import Spinner from '../../../assets/images/loading.gif';
import { Header } from "../../../components/Header/Header";
import ReactPaginate from 'react-paginate';
import { FaArrowLeft, FaEye, FaSortUp, FaSortDown } from 'react-icons/fa';
import styles from "./orders.module.css";
import { useNavigate } from "react-router-dom";

export function Orders() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Renomeado para searchQuery
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Para armazenar o ID do pedido expandido
  const [expandedOrderDetails, setExpandedOrderDetails] = useState(null); // Para armazenar detalhes do pedido expandido
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const navigate = useNavigate();

  const goToOrders = () => {
    navigate('/meli/indicadores');
  };

  useEffect(() => {
    const fetchOrderItemsWithDetails = async () => {
      try {
        const response = await axios.get('/api/order_items');
        const ordersData = response.data;

        const userData = Object.values(ordersData)[0];
        
        if (userData && userData.orders && Array.isArray(userData.orders)) {
          const orderItems = [];
          const loadItemDetails = async (item, order) => {
            try {
              const detailsResponse = await fetch(`https://api.mercadolibre.com/items/${item.mlb_item}?include_attributes=all`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit'
              });

              if (!detailsResponse.ok) {
                throw new Error("Erro ao buscar detalhes do item do Mercado Livre.");
              }

              const details = await detailsResponse.json();
              function formatDate(dateString) {
                const [year, month, day] = dateString.split("T")[0].split("-");
                return `${day}/${month}/${year}`;
              }
              let x1 = 0;
              function formatCurrent(value){     
                return new Intl.NumberFormat('pt-BR', {
                  style:'currency',
                  currency:'BRL',
                }).format(value);
              }


           

              let discountAmounts = { total: 0, seller: 0 };
              if (order.discounts && order.discounts.details) {
                const discountDetails = order.discounts.details[0];
                if (discountDetails.items && discountDetails.items.length > 0) {
                  discountAmounts = discountDetails.items[0].amounts;
                }
              } 
              let plataform =  null;

              if (userData.meta_profile){
                plataform = userData.meta_profile.nickname;
              }
             
              const combinedItem = { 
                account: plataform, 
                order_id: order.order_id,
                mlb_item: item.mlb_item,
                sale_fee: formatCurrent(item.sale_fee),
                quantity: item.quantity,
                unit_price: formatCurrent(item.unit_price),
                full_unit_price: formatCurrent(item.full_unit_price),
                seller_sku: item.seller_sku,
                permalink: details.permalink, 
                price: formatCurrent(details.price), 
                base_price: formatCurrent(details.base_price), 
                picture_urls: details.pictures?.map(picture => picture.url) || [],
                title: details.title,                 
                date: order.date,
                meta_pedido: order.meta_pedido,  
                discounts: formatCurrent(discountAmounts.total),
                freight:(order.freight.list_cost, item.quantity),
                date:order.date_created ? formatDate(order.date_created) : "Data não disponível",
                time: order.date_created ? order.date_created.split("T")[1].split(".")[0] : "Hora não disponível",
                logistic_type: order.freight ? order.freight.logistic_type : "N/A", 
                pass_on: formatCurrent(item.pass_on),
                refund_freight_flex: formatCurrent(item.refund_freight_flex || 0),  // Adicionando refund_freight_flex
                shared_discount: formatCurrent(order.freight?.shared_discount || 0),  // Adicionando shared_discount
                freight_alpha: formatCurrent(item.freight_alpha)
              };
              console.log(item, order)
              orderItems.push(combinedItem);

            } catch (detailsError) {
              console.error("Erro ao buscar detalhes do item:", item.mlb_item, detailsError);
            }
          };

          for (const order of userData.orders) {
            for (const item of order.items) {
              await loadItemDetails(item, order);
            }
          }

          setData(orderItems);
          setIsInitialLoadDone(true);

        } else {
          throw new Error("A resposta da API não tem o formato esperado");
        }

      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Ocorreu um erro ao carregar os dados.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderItemsWithDetails();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleViewMore = (orderId, orderDetails) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null); // Recolher se já estiver expandido
      setExpandedOrderDetails(null);
    } else {
      setExpandedOrderId(orderId);
      setExpandedOrderDetails(orderDetails); // Definir os detalhes do pedido selecionado
    }
  };

  const sortedFilteredItems = [...data].filter(item => 
    item.seller_sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.order_id.toString().toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage + itemsPerPage;
  const currentItems = sortedFilteredItems.slice(currentPage * itemsPerPage, indexOfLastItem);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && !isInitialLoadDone) {
    return (
      <div className={styles.loadingContainer}>
        <img src={Spinner} alt="Loading..." className={styles.spinner} />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Detalhamento de Pedidos</h1>
      </div>

        <input 
          type="text" 
          placeholder="Buscar por Seller SKU ou Order ID" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className={styles.searchInput} 
        />
         <button className={styles.backButton} onClick={goToOrders}>
          <FaArrowLeft />
          <span>Voltar</span>
        </button>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.conta}>Conta</th>
              <th className={styles.produto}>Produto</th>
              <th className={styles.center} onClick={() => handleSort('date')}>
                Data {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className={styles.center} onClick={() => handleSort('full_unit_price')}>
                Preço Cheio {sortConfig.key === 'full_unit_price' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className={styles.center} onClick={() => handleSort('unit_price')}>
                Preço Venda {sortConfig.key === 'unit_price' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className={styles.center}>Tipo Frete</th>
              <th className={styles.center}>Frete</th>
              <th className={styles.center}>Qtde</th>
              <th className={styles.center}>Comissão</th>  
              <th className={styles.center}>Desconto</th>  
              <th className={styles.center}>Repasse</th>
              <th className={styles.center}>Lucro %</th>
              <th className={styles.center}>Meta %</th>
              <th className={styles.center}>Anuncio</th>
              <th className={styles.center}>Ver+</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td className={styles.accountStyleColumn}>
                    <span>{item.account}</span>
                    <br />
                    <span>{item.order_id || "Indisponivel"}</span>
                  </td>
                  <td>
                    <div className={styles.productInfo}>
                      <img 
                        src={item.picture_urls[0]} 
                        alt={item.title} 
                        className={styles.productImageTable} 
                      />
                      <span>{item.title}</span>
                    </div>
                  </td>
                  <td className={styles.center}>{item.date || "Data não disponível"}</td>
                  <td className={styles.center}>{item.full_unit_price}</td>
                  
                  <td className={styles.center}>{item.unit_price}</td>
                  <td className={styles.center}>{item.logistic_type}</td>
                  <td className={styles.center}>{item.freight_alpha || "N/A"}</td>
                  <td className={styles.center}>{item.quantity || "N/A"}</td>
                  <td className={styles.center}>{item.sale_fee}</td>
                  <td className={styles.center}>{item.discounts || "N/A"}</td>
                  <td className={styles.center}>{item.pass_on}</td>
                  <td>0,0</td>
                  <td className={styles.center}>0,0</td>
                  <td className={`${styles.actionButton} ${styles.center}`}>
                    <a href={item.permalink} target="_blank" rel="noopener noreferrer"><FaEye /></a>
                  </td>
                  <td className={`${styles.actionButton} ${styles.center}`}>
                    <button 
                      onClick={() => handleViewMore(item.order_id, { refund_freight_flex: item.refund_freight_flex, shared_discount: item.shared_discount })}
                    >+</button>
                  </td>               
                </tr>
                {expandedOrderId === item.order_id && (
                  <tr>
                    <td colSpan="12" className={styles.expandedRow}>
                      <div>
                         <p><strong>Outros Detalhes: </strong></p>
                        <p><strong>Reembolso de Frete:</strong> {expandedOrderDetails?.refund_freight_flex}</p>
                        <p><strong>Desconto Compartilhado:</strong> {expandedOrderDetails?.shared_discount}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className={styles.paginate_alpha}>
          <ReactPaginate
            previousLabel={"← Anterior"}
            nextLabel={"Próximo →"}
            pageCount={Math.ceil(sortedFilteredItems.length / itemsPerPage)}
            onPageChange={handlePageClick}
            containerClassName={styles.pagination}
            pageLinkClassName={styles.pageButton}
            previousLinkClassName={styles.pageButton}
            nextLinkClassName={styles.pageButton}
            activeLinkClassName={styles.activePageButton}
            disabledLinkClassName={styles.disabledPageButton}
            breakLabel={""}
          />
        </div>
      </div>
    </div>
  );
}
