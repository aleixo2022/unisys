import React from 'react';
import styles from './connectMeli.module.css';
import { FaLink } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export function ConnectMeli() {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  const state = import.meta.env.VITE_STATE;
  const email = useSelector((state) => state.email.value);
  const meliAuthUrl = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

  return (
    <div className={styles.connectContainer}>
 
      <p>Por favor, conecte-se à sua conta do Mercado Livre para continuar.</p>
      <a href={meliAuthUrl} className={styles.connectLink}>
        <FaLink className={styles.icon} /> Clique aqui para conectar
      </a>
    </div>
  );
}

 