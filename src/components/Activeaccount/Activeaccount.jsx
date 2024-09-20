import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Activeaccount.module.css';
import loadingGif from '../../assets/images/loading.gif';
import { FaCheckCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setTokens, selectIsAuthenticated } from  '../../features/session/sessionSlice';
import { selectEmail } from '../../features/email/emailSlice';
import { setIdentityVerify, resetIdentityVerify,selectIdentityVerify } from '../../features/identity/identityVerify';

export function Activeaccount() {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.error.value);
  const username = useSelector((state) => state.username.value); 
  const password = useSelector((state) => state.password.value);
  const [errorMessage, setErrorMessage] = useState('');
  let email = useSelector(selectEmail);
  const isVerified = useSelector(selectIdentityVerify);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const API_URL= import.meta.env.VITE_NGROK_LINK;
  
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const extractedCode = query.get('code');

    if (extractedCode && extractedCode.startsWith('TG-')) {
      setCode(extractedCode);
    } else {
      navigate('/');
    }
  }, [location]);

  useEffect(() => {
    if (!code) {
      // console.log("Aqui email:", email);
      console.log('Nenhum código disponível, ignorando a busca');       
      return;
    }

    function isObject(variable) {
      return typeof variable === 'object' && variable !== null && !Array.isArray(variable);
    }


    const fetchData = async () => {
      setLoading(true);
       
      if(isObject(email) == true){
        email = email.email;
      }else{
        email = email;
      };

      //const url = `https://unisys-7981816f1ad6.herokuapp.com/authorize?email=${encodeURIComponent(email)}`;
      const url = `${API_URL}/authorize?email=${encodeURIComponent(email)}`;
      const requestBody = {
        code: code,
        redirect_uri: "https://unisys.vercel.app/activated"
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
      };

      try {
        const response = await fetch(url, requestOptions);
        const responseData = await response.json();
        console.log('Response Data:', responseData);
        console.log('Response Status:', response.status);

        if ((response.status === 200 || response.status === 201) && responseData.access_token) {
          console.log('Successful API response:', responseData);
          setSuccess(true);
          setShowSuccessMessage(true);
       
          setTimeout(() => {
            setShowSuccessMessage(false);
            if(!isAuthenticated){
              handleLogin();
            }else{
              navigate('/meli/indicadores');
            }
          }, 3000); // Exibe a mensagem de sucesso por 5 segundos
        } else {
          alert("Falha na autenticação ou faltam dados importantes na resposta");             
          throw new Error('Falha na autenticação ou faltam dados importantes na resposta.');
        }
      } catch (error) { 
        console.error('Error during fetch:', error.message);
        setLoading(false);
        setErrorMessage(error.message);
         
        navigate('/'); 
      } finally {
        setLoading(false);
        console.log('Carregando estado definido como falso');
      }
    };

    fetchData();
  }, [code, dispatch, email]);

  const handleLogin = async () => {
    //const loginUrl = 'https://unisys-7981816f1ad6.herokuapp.com/auth/login';
    const loginUrl = 'https://5994-45-163-2-44.ngrok-free.app/auth/login';
    const loginBody = {
      username: username,
      password: password
    };
    console.log('Login URL:', loginUrl);
    console.log('Login Body:', loginBody);

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
      console.log('Login Response Data:', responseData);
      console.log('Login Response Status:', response.status);
      
      if(isVerified == true){
        setLoadingOrders(false);
        dispatch(resetIdentityVerify());
        navigate('/meli/indicadores');
      }else{
        if (response.status === 200) {
          console.log('Login successful:', responseData);
          setLoadingOrders(true);
                   
          dispatch(setTokens({
            accessToken: responseData.access_token,
            refreshToken: responseData.refresh_token
          }));
          
          setTimeout(() => {
            setLoadingOrders(false);
            navigate('/meli/indicadores');
          }, 10000); // Simula o tempo de carregamento dos pedidos
        } else {
          throw new Error('Login failed: ' + responseData.message);
        }
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setErrorMessage(error.message);
      navigate('/');
    }
  };

  useEffect(() => {
    let timer;
    if (error) {
      timer = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter <= 1) {
            clearInterval(timer);
            navigate('/');
            return 0;
          }
          return prevCounter - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [error, navigate]);

  return (
    <div className={styles.flexcenter}>
      {loading ? (
        <div className={styles.loader}><img src={loadingGif} alt="Loading..." /></div>
      ) : error ? (
        <div className={styles.errorMsg}>
          <p>Falha. Isso gerou um ticket de suporte enviado a equipe, em até 1 hora tente novamente</p>
          <p>Redirecionamento ao Login em {counter} segundos!</p>
        </div>
      ) : success && showSuccessMessage ? (
        <div className={styles.successMsg}>
          <h1>Integração bem sucedida!</h1>
          <FaCheckCircle size={30} style={{ color: 'green' }} />
          <p>Sua conta agora está totalmente Integrada e pronta para uso.</p>
          <p style={{ fontSize: '18px' }}>Ir <a href="/login">Redirecionando para Indicadores</a></p>
        </div>
      ) : loadingOrders ? (
        <div className={styles.loader}><img src={loadingGif} alt="Loading Orders..." /><p>Carregando Indicadores...</p></div>
      ) : (
        <div><p>Nenhum dado obtido no momento, se persistir acione o suporte é rapidinho! AQUI</p></div>
      )}
    </div>
  );
}
