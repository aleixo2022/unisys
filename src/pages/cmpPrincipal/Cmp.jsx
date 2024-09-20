import React, { useState, useEffect } from "react";
import axios from '../../services/axiosConfig';
import Spinner from '../../assets/images/loading.gif';
import { Header } from "../../components/Header/Header";
import { FaArrowLeft } from 'react-icons/fa';
import styles from "./cmp.module.css";
import { useNavigate } from "react-router-dom";
import useDebounce from '../../hooks/useDebounce';

export function CmpP() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [productDescription, setProductDescription] = useState(""); // Novo estado para a descrição do produto
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500 ms de atraso
  const navigate = useNavigate();

  const goToOrders = () => {
    navigate('/meli/indicadores');
  };

  const fetchProcessedData = async () => {
    try {
      setIsLoading(true);
      const queryParam = debouncedSearchQuery ? `&cod_produto=${encodeURIComponent(debouncedSearchQuery)}` : '';
      const response = await axios.get(`/api/get_processed_data?${queryParam}`);
      const { data } = response.data;

      setData(data);
      
      // Definir a descrição do produto com base no primeiro item retornado
      if (data.length > 0) {
        setProductDescription(data[0].descricao1);
      } else {
        setProductDescription(""); // Limpa a descrição se não houver dados
      }
      
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Ocorreu um erro ao carregar os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProcessedData();
  }, [debouncedSearchQuery]); // Reagir apenas à mudança no debouncedSearchQuery

  const formatDate = (dateString) => {
    if (!dateString) return "Indisponível";
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Custo Médio Principal Unimarcas</h1>
        </div>

        <input 
          type="text" 
          placeholder="Buscar por Código do Produto" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className={styles.searchInput} 
        />

        <button className={styles.backButton} onClick={goToOrders}>
          <FaArrowLeft />
          <span>Home</span>
        </button>

        {/* Exibir a descrição do produto acima da tabela */}
        {productDescription && (
          <div className={styles.productDescription}>
            <h2>{productDescription}</h2>
          </div>
        )}

        <div className={styles.tableContainer}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <img src={Spinner} alt="Loading..." className={styles.spinner} />
            </div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.center}>Código</th>                             
                  <th className={styles.center}>V. Cofins</th>
                  <th className={styles.center}>V. PIS</th>
                  <th className={styles.center}>Nota</th>
                  <th className={styles.center}>ICMS</th>
                  <th className={styles.center}>IPI</th>
                  <th className={styles.center}>Data Fin.</th>
                  <th className={styles.center}>Data Imp.</th>
                  <th className={styles.center}>Preço</th>
                  <th className={styles.center}>Saldo Dia</th>
                  <th className={styles.center}>Qtde</th>
                  <th className={styles.center}>C.Méd. Liq</th>
                  <th className={styles.center}>C.Méd. NF</th>
                  <th className={styles.center}>C.Méd. ST</th>
                  <th className={styles.center}>C.Méd. ICMS</th>
                  <th className={styles.center}>C.Méd. Pis Cofins</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td className={styles.center}>{item.cod_produto}</td>                                      
                    <td className={styles.center}>{formatCurrency(item.v_cofins)}</td>
                    <td className={styles.center}>{formatCurrency(item.v_pis)}</td>
                    <td className={styles.center}>{item.nota || 0}</td>
                    <td className={styles.center}>{formatCurrency(item.v_icms)}</td>
                    <td className={styles.center}>{formatCurrency(item.v_ipi)}</td>
                    <td className={styles.center}>{formatDate(item.data_finalizacao)}</td>
                    <td className={styles.center}>{formatDate(item.dataimp)}</td>
                    <td className={styles.center}>{formatCurrency(item.preco)}</td>
                    <td className={styles.center}>{item.saldo_dia_alpha || 0}</td>
                    <td className={styles.center}>{item.quantidade || 0}</td>
                    <td className={styles.center}>{formatCurrency(item.cmp)}</td>
                    <td className={styles.center}>{formatCurrency(item.cmp_nf)}</td>
                    <td className={styles.center}>{formatCurrency(item.cmp_st)}</td>
                    <td className={styles.center}>{formatCurrency(item.cmp_icms)}</td>
                    <td className={styles.center}>{formatCurrency(item.cmp_pis_cofins)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
