import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../../../features/session/sessionSlice';
import { Link } from 'react-router-dom';
import styles from './SettingsPage.module.css';
import { FaUserCog, FaBell, FaShieldAlt, FaUserPlus , FaArrowLeft} from 'react-icons/fa';
import { RiMapPin2Line } from 'react-icons/ri';
import { Header } from "../../../components/Header/Header";
export function SettingsPage() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
          navigate('/');
          return;       
        }
    }, [isAuthenticated, navigate]);

    const handleSecurityClick = (e) => {
        e.preventDefault();
        alert('Recurso em desenvolvimento');
    };

    const goToHome =()=>{
      navigate('/initial/indicadores')
    }
    return (
       <>
        <Header />
      <div className={styles.container}>
      <button className={styles.backButton} onClick={goToHome}>
          <FaArrowLeft />
          <span>Voltar</span>
        </button>
        <h1>Configurações</h1>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <Link to="/initial/custos-estados">
              <div className={styles.iconWrapper}>
                <RiMapPin2Line size={50} color="#007BFF" className={`${styles.icon} ${styles.iconUp}`}/>
              </div>
              <h2>Estados</h2>
            </Link>
          </div>
          <div className={styles.card}>
            <Link to="/13a2828b3adecc1c32ea3888d08afa51e147b3f3">
              <div className={styles.iconWrapper}>
                <FaUserPlus className={`${styles.icon} ${styles.iconUp}`} />
              </div>
              <h2>Novo Usuário</h2>
            </Link>
          </div>
          <div className={styles.card}>
            <a href="#" onClick={handleSecurityClick}>
              <div className={styles.iconWrapper}>
                <FaShieldAlt className={styles.icon} />
              </div>
              <h2>Segurança</h2>
            </a>
          </div>
        </div>
      </div>
       </>
    );
}
