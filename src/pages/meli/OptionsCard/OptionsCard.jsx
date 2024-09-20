import React from "react";
import styles from "./OptionsCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlug, faClipboardList, faChartBar, faDollarSign, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useFlash } from "../../../components/contexts/FlashContext";
 


export function OptionsCard() {
  const navigate = useNavigate();
  const { setFlashMessage } = useFlash();

  const goToIntegrations = () => {
    navigate("/meli/integrations");
  }; 

  const goToBonificacoes = () => {
    navigate("/indicadores");
  };

  const goToOrders =()=>{
    navigate("/meli/orders")
  }
  const goToCMPPrincipal=()=>{
    navigate("/cmp/principal")
  }

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.options_link} onClick={goToIntegrations}>
          <FontAwesomeIcon icon={faPlug} color="#7132A3" size="2x" />
          <h6 className={styles.title}>Integrações</h6>
        </div>

        <div className={styles.options_link} onClick={goToOrders}>
          <FontAwesomeIcon icon={faClipboardList} color="#7132A3" size="2x" />
          <h6 className={styles.title}>Meus Pedidos</h6>
        </div>
        <div className={styles.options_link} onClick={() => setFlashMessage("Não acessível no momento...")}>
          <FontAwesomeIcon icon={faChartBar} color="#7132A3" size="2x" />
          <h6 className={styles.title}>Rentabilidade</h6>
        </div>
        <div className={styles.options_link} onClick={goToBonificacoes}>
          <FontAwesomeIcon icon={faDollarSign} color="#7132A3" size="2x" />
          <h6 className={styles.title}>Bonificações</h6>
        </div>
        <div className={styles.options_link} onClick={goToCMPPrincipal}>
          <FontAwesomeIcon icon={faMoneyBillWave} color="#7132A3" size="2x" />
          <h6 className={styles.title}>Custo Médio</h6>
        </div>
      </div>
    </div>
  );
}
