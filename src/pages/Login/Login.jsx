import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { setTokens } from '../../features/session/sessionSlice';
import styles from "./Login.module.css";
import logo from "../../assets/images/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { setEmail } from "../../features/email/emailSlice";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_NGROK_LINK;

  // Carregar login e senha do LocalStorage quando a página for carregada
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    //console.log(savedUsername, savedPassword)
    if (savedRememberMe) {
      setUsername(savedUsername || ""); // Preenche o campo de usuário
      setPassword(savedPassword || ""); // Preenche o campo de senha
      setRememberMe(true); // Manter a checkbox marcada
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
   // console.log("Login attempt: ", username, password);

    setLoading(true);
    const loginUrl = `${API_URL}/auth/login`;
    const loginBody = {
      username: username,
      password: password
    };

    const loginOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(loginBody)
    };

    try {
      const response = await fetch(loginUrl, loginOptions);
      const responseData = await response.json();

      if (response.status === 200) {
       // console.log('Login successful:', responseData);
        dispatch(setTokens({
          accessToken: responseData.access_token,
          refreshToken: responseData.refresh_token
        }));

        dispatch(setEmail({
          email: responseData.email
        }));

        // Se o usuário marcou "Lembrar login e senha", salvar no LocalStorage
        if (rememberMe) {
          // console.log("lembrar senha: "+rememberMe)
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
          localStorage.setItem('rememberMe', true);
        } else {
          localStorage.removeItem('accessToken'); 
          localStorage.removeItem('refreshToken');
        }

        navigate('/initial/indicadores');
      } else {
       // console.log('Login failed with status:', response.status, 'and message:', responseData.message);
        throw new Error('Servidor offline: ' + responseData.message);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Link to="/">
          <img src={logo} className={styles.logo} alt="Logo" />
        </Link>
        <h2>Intranet</h2>
        <div>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Usuário"
          />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Senha"
          />
        </div>

        {errorMessage && <p className={styles.errorMsg}>{errorMessage}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Carregando...' : 'Entrar'}
        </button>

        <div className={styles.checkboxContainer}>
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Lembrar login e senha</span>
          </label>
        </div>
      </form>
    </div>
  );
}
