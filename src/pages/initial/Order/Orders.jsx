import React, { useState, useEffect } from "react";
import axios from '../../../services/axiosConfig';
import Spinner from '../../../assets/images/loading.gif';
import { Header } from "../../../components/Header/Header";
import ReactPaginate from 'react-paginate';
import { FaArrowLeft, FaEye,FaSearch, FaSortUp, FaSortDown, FaCopy, FaShoppingCart, FaBox } from 'react-icons/fa'; // Incluindo FaShoppingCart
import styles from "./orders.module.css";
import { Triangle } from 'react-loader-spinner';
import { useNavigate } from "react-router-dom";

export function Orders() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileId, setProfileId] = useState("")
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [expandedOrderDetails, setExpandedOrderDetails] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedSku, setCopiedSku] = useState(null);  
  const [copiedOrderId, setCopiedOrderId] = useState(null);  
  const [profileOptions, setProfileOptions] = useState([]); 
  const navigate = useNavigate();

  const goToOrders = () => {
    navigate('/initial/indicadores');
  };

  const fetchOrders = async (page = 1) => {
    try {
      setIsLoading(true);
      const queryParam = searchQuery ? `&query=${encodeURIComponent(searchQuery)}` : '';
      const profileParam = profileId ? `&profile_id=${encodeURIComponent(profileId)}` : '';
      const response = await axios.get(`/api/processed_order_data?page=${page}${queryParam}${profileParam}`);
      const { orders, pagination } = response.data;
      console.log(orders)
      const ordersWithDetails = await Promise.all(orders.map(async order => {
        try {
          const detailsResponse = await fetch(`https://api.mercadolibre.com/items/${order.mlb}?include_attributes=all`);
          if (!detailsResponse.ok) {
            throw new Error("Erro ao buscar detalhes do item do Mercado Livre.");
          }
          const details = await detailsResponse.json();
          return {
            ...order,
            permalink: details.permalink,
            price: details.price,
            base_price: details.base_price,
            picture_urls: details.pictures?.map(picture => picture.url) || [],
            full_unit_price: order.item_unit_price,
            account: order.title_nickname,
            seller_sku: order.seller_sku,
            profit: order.profit,
            profitability: order.profitability,
            state:order.state,
            profile_id: order.profile_id,
            imported: order.imported,
          };
       
        } catch (err) {
          console.error(`Erro ao buscar detalhes do item ${order.item_id}:`, err);
          return order;
        }
      }));
    
      setData(ordersWithDetails);
      setPagination(pagination);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Ocorreu um erro ao carregar os dados. Pressione ⌘ ou F5");
    } finally {
      setIsLoading(false);
    }
  };
 

  const fetchProfileOptions = async () => {
    try {
      const response = await axios.get('/api/profiles/meta'); 
     console.log(response.data.profiles)
      
     const profiles = response.data.profiles.map(profile => ({        
        id: profile.id,  
       brandName: profile.meta_dados.nickname,
      }));
      console.log(profiles)
      setProfileOptions(profiles); 
    } catch (err) {
      console.error("Erro ao buscar profile_ids:", err);
      setError("Ocorreu um erro ao carregar os perfis.");
    }
  };
  
  



  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, searchQuery, profileId]);

  useEffect(() => {
    fetchProfileOptions(); 
  }, []);


  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  const formatCurrent = (value) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatCurrentProfit = (value) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
      return value.replace(/\./g, ',');
  };

  // Função para formatar o lucro percentual (profit)
  const formatProfit = (value) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    let profit = parseFloat(value); // Divide por 100
    return profit.toFixed(2); // Formata com duas casas decimais
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleViewMore = (orderId, orderDetails) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setExpandedOrderDetails(null);
    } else {
      setExpandedOrderId(orderId);
      setExpandedOrderDetails({
        ...orderDetails,
        seller_sku: data.find(item => item.order_id === orderId).seller_sku,
        profitability: data.find(item => item.order_id === orderId).profitability,
      });
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "sku") {
      setCopiedSku(text);
      setTimeout(() => setCopiedSku(null), 2000); // Reseta o estado após 2 segundos
    } else if (type === "order_id") {
      setCopiedOrderId(text);
      setTimeout(() => setCopiedOrderId(null), 2000); // Reseta o estado após 2 segundos
    }
  };

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
  };

  return (
    <div> 
      <Header />
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Detalhamento de Pedidos</h1>
        </div>

        <div className={styles.input_list}>
              {/* Select para escolher profile_id */}
              <select
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)} 
              // Define o profile_id (meta_profile) como valor
              className={styles.profileSelect}
            >
              <option value="">TODAS AS LOJAS</option>
              {profileOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.brandName}  
                </option>
              ))}
            </select>

          <div className={styles.inputContainer}>
            <div className={styles.searchContainer}>
              <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por SKU ou Pedido"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            </div>
            {searchQuery && (
              <span className={styles.clearIcon} onClick={() => setSearchQuery('')}>
                &times;
              </span>
            )}
          </div>
        </div>

        <button className={styles.backButton} onClick={goToOrders}>
          <FaArrowLeft />
          <span>Home</span>
        </button>

        <div className={styles.tableContainer}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
            <img src={Spinner} alt="Loading..." className={styles.spinner} />
          </div>
          ) : error ? (
            <div className={styles.errorContainer}>
    <Triangle height="30" width="30" color="red" ariaLabel="loading" />
    <span className={styles.errorMessage}>Ocorreu um erro ao carregar os dados. Pressione ⌘ ou F5</span>
  
  </div>
          ) : (
            <>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.conta}>Conta</th>
                    <th className={styles.produto}>Produto</th>
                    <th className={styles.center} onClick={() => handleSort('date')}>
                      Data {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </th>
                    <th className={styles.center} onClick={() => handleSort('item_unit_price')}>
                      Preço Venda {sortConfig.key === 'item_unit_price' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
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
                  {data.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td className={styles.accountStyleColumn}>
                          <span>{item.account}</span>
                          <br />
                          <span
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: copiedOrderId === item.order_id ? 'darkblue' : 'inherit' }}
                            onClick={() => handleCopy(item.order_id, "order_id")}
                          >
                            {item.order_id || "Indisponível"}
                            <FaCopy style={{ marginLeft: '5px' }} />
                          </span>
                          {item.pack_id && item.pack_count > 1 && (
                            <span style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                              <FaShoppingCart style={{ marginRight: '2px' }} />
                              {String(item.pack_id).slice(0, -2)}
                              <FaCopy
                                style={{ marginLeft: '5px', cursor: 'pointer' }}
                                onClick={() => navigator.clipboard.writeText(item.pack_id)}
                              />
                            </span>
                          )}



                        </td>
                        <td>
                          <div className={styles.productInfo}>
                            <img
                              src={item.picture_urls[0]}
                              alt={item.item_title}
                              className={styles.productImageTable}
                            />
                            <span>{item.item_title}</span>
                          </div>
                        </td>
                        <td className={styles.center}>{formatDate(item.date_created) || "Data não disponível"}</td>
                        <td className={styles.center}>{formatCurrent(item.item_unit_price)}</td>
                        <td className={styles.center}>{item.logistic_type || "Não possui"}</td>
                        <td className={styles.center}>{formatCurrent(item.freight_alpha) || "N/A"}</td>
                        <td className={styles.center}>{item.item_quantity || "N/A"}</td>
                        <td className={styles.center}>{formatCurrent(item.commission)}</td>
                        <td className={styles.center}>{formatCurrent(item.discount_total)}</td>
                        <td className={styles.center}>{formatCurrent(item.pass_on)}</td>
                        <td className={styles.center}>{item.profit === null ?  'N/A':`${formatCurrentProfit(formatProfit(item.profit))} %`}</td>
                        <td className={styles.center}>0,0</td>
                        <td className={`${styles.actionButton} ${styles.center}`}>
                          <a href={item.permalink} target="_blank" rel="noopener noreferrer"><FaEye /></a>
                        </td>
                        <td className={`${styles.actionButton} ${styles.center}`}>
                          <button
                            onClick={() => handleViewMore(item.order_id, {
                              refund_freight_flex: item.refund_freight_flex,
                              shared_discount: item.shared_discount,
                              seller_sku: item.seller_sku,
                              profitability: item.profitability,
                              state:item.state,
                              imported:item.imported,
                            })}
                          >+</button>
                        </td>
                      </tr>
                      {expandedOrderId === item.order_id && (
                        <tr>
                          <td colSpan="14" className={styles.expandedRow}>
                            <div>
                              <p><strong>DETALHES: </strong></p>
                              <p><strong>Estado Origem:</strong> {expandedOrderDetails?.state}</p>
                              <p><strong>Importado:</strong> {expandedOrderDetails?.imported == 1 ? "Sim":expandedOrderDetails.imported == 0 ? "Não":"Indefinido"}</p>
                              <p><strong>Lucro:</strong> {formatCurrent(expandedOrderDetails?.profitability)}</p>
                              <p><strong>Reembolso de Frete:</strong> {formatCurrent(expandedOrderDetails?.refund_freight_flex)}</p>
                              <p><strong>Desconto Compartilhado:</strong> {formatCurrent(expandedOrderDetails?.shared_discount)}</p>
                              <p><strong>SKU:</strong>
                                <span
                                  style={{ cursor: 'pointer', color: copiedSku === expandedOrderDetails?.seller_sku ? 'darkblue' : 'inherit' }}
                                  onClick={() => handleCopy(expandedOrderDetails?.seller_sku, "sku")}
                                >
                                  {expandedOrderDetails?.seller_sku} <FaCopy style={{ marginLeft: '5px' }} />
                                </span>
                              </p>
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
                  pageCount={pagination.total_pages}
                  onPageChange={handlePageClick}
                  containerClassName={styles.pagination}
                  pageLinkClassName={styles.pageButton}
                  previousLinkClassName={styles.pageButton}
                  nextLinkClassName={styles.pageButton}
                  activeLinkClassName={styles.activePageButton}
                  disabledLinkClassName={styles.disabledPageButton}
                  breakLabel={""}
                  forcePage={currentPage - 1}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
