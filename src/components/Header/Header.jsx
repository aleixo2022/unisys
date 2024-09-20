import React from "react";
import logo from "../../assets/images/logo.svg";
import logoutIcon from "../../assets/images/logout.svg";
import styles from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/session/sessionSlice";

export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <header className={styles.header}>
        <div></div>
        <div className={styles.brand}>
          <img src={logo} className={styles.logo} />

          <div className={styles.brand_title}>
            <h5 className={styles.title}>Grupo</h5>
            <h5 className={styles.title}>Unimarcas</h5>
          </div>
        </div>

        <div className={styles.linklogout} onClick={handleLogout}>
          <div className={styles.logout}>
            <img src={logoutIcon} alt="logout" />
            <h5 className={styles.title_logout}>Sair</h5>
          </div>
        </div>
      </header>
    </div>
  );
}
