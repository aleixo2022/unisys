import React from "react";
import { Link } from "react-router-dom";
import logoHome from "../../assets/images/logo.svg";
import login_img from "../../assets/images/login.png";
import styles from "./Home.module.css";

export function Home() {
  return (
    <div className={styles.main}>
      <Link to="/login" className={styles.login}>
        <div className={styles.login}>
          <img src={login_img} alt="imagem de login" />
          <strong>Entrar</strong>
        </div>
      </Link>

      <div className={styles.container}>
        <img src={logoHome} alt="Logo da pagina inicial" />
        <h1 className={styles.title}>Grupo Unimarcas</h1>
      </div>

      <Link to="/login" className={styles.linkLogin}>
        <div className={styles.login_mobile}>
          <img
            src={login_img}
            alt="imagem de login"
            className={styles.iconlogin}
          />
          <strong>Entrar</strong>
        </div>
      </Link>
    </div>
  );
}
