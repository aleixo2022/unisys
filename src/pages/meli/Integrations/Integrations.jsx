import React, { useState, useEffect } from 'react';
import { Header } from '../../../components/Header/Header';
import { OptionsCard } from '../OptionsCard/OptionsCard';
import axios from '../../../services/axiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaLink, FaArrowLeft } from 'react-icons/fa';
import styles from './integrations.module.css';
import { selectEmail } from '../../../features/email/emailSlice';
import { setIdentityVerify  } from '../../../features/identity/identityVerify';
 



export function Integrations() {
    
    const navigate = useNavigate();
    const { isAuthenticated, accessToken } = useSelector(state => state.session);
    const  email = useSelector(selectEmail)
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            fetchProfiles();
        }
    }, [isAuthenticated, navigate]);

    const [mercadoLivreAccounts, setMercadoLivreAccounts] = useState([]);
    const [adUrl, setAdUrl] = useState('');
    const [sellerId, setSellerId] = useState('');
    const [showLogoutMessage, setShowLogoutMessage] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleAdUrlChange = (e) => {
        setAdUrl(e.target.value);
    };

    const extractAdId = (url) => {
        const regex = /MLB-?\d+/;
        const match = url.match(regex);
        return match ? match[0].replace('-', '') : null;
    };

    const fetchSellerId = async () => {
        const adId = extractAdId(adUrl);
        if (!adId) {
            alert('URL do anúncio inválida. Por favor, insira uma URL válida.');
            return;
        }

        try {
            const response = await axios.post('/api/get_item_id', { ad_id: adId });
            const sellerId = response.data.seller_id;
            setSellerId(sellerId);
        } catch (error) {
            console.error('Erro ao buscar seller_id:', error);
            alert('Erro ao buscar seller_id. Verifique a URL do anúncio e tente novamente.');
        }
    };

    const fetchProfiles = async () => {
        try {
            const response = await axios.get('/api/profiles/profiles', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setMercadoLivreAccounts(response.data);
        } catch (error) {
            console.error('Erro ao buscar contas do Mercado Livre:', error);
        }
    };

    const clientId = import.meta.env.VITE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const state = import.meta.env.VITE_STATE;
    dispatch(setIdentityVerify(true));
    const meliAuthUrl = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
    

    const handleConnectClick = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmYes = () => {
        setShowConfirmModal(false);
        window.location.href = meliAuthUrl;
    };

    const handleConfirmNo = () => {
        setShowConfirmModal(false);
        setShowLogoutMessage(true);
    };

    const handleBackToHome=()=>{
        navigate('/meli/indicadores')
    }
    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.integrationsContainer}>
                <button className={styles.backButton} onClick={handleBackToHome}>
                <FaArrowLeft />
                <span>Home</span>
                </button>

                    <h1 className={styles.title}>Integrações</h1>
                    <div className={styles.section}>
                        <h4>Contas do Mercado Livre</h4>
                        <ul className={styles.accountsProfiles}>
                            {mercadoLivreAccounts.map(account => (
                                <li key={account.id}>
                                    <span><strong>ID:</strong> {account.id}</span>
                                    <span><strong>CONTA:</strong> {account.mercado_livre_user_id}</span>
                                </li>
                            ))}
                        </ul>
                        <div className={styles.connectContainer}>
                            <h4>Conectar Nova Conta do Mercado Livre</h4>
                            <button onClick={handleConnectClick} className={styles.connectLink}>
                                <FaLink className={styles.icon} /> Clique aqui para conectar
                            </button>
                            {showLogoutMessage && (
                                <p className={styles.logoutMessage}>
                                    Clique <a href="https://www.mercadolibre.com/jms/mlb/lgz/logout?go=https://www.mercadolivre.com.br#menu-user" target="_blank" rel="noopener noreferrer">aqui</a> para sair da sua conta atual e poder acessar a nova conta.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className={styles.section}>
                        <h4>Identificar ID de usuários</h4>
                        <p>Insira a URL de um de seus anúncios ou o MLB do anúncio do usuário que gostaria de verificar:</p>
                        <input 
                            type="text" 
                            value={adUrl} 
                            onChange={handleAdUrlChange} 
                            className={styles.inputField}
                            placeholder="Insira a URL ou ID do anúncio" 
                        />
                        <button onClick={fetchSellerId} className={styles.fetchButton}>Localizar Conta</button>
                        {sellerId && (
                            <div className={styles.resultContainer}>
                                <p>Conta Localizada: {sellerId}</p>
                            </div>
                        )}
                    </div>
                    {showConfirmModal && (
                        <div className={styles.modal}>
                            <div className={styles.modalContent}>
                                <h4>Você já está logado na conta do Mercado Livre que deseja conectar?</h4>
                                <button onClick={handleConfirmYes} className={styles.yesButton}>Sim</button>
                                <button onClick={handleConfirmNo} className={styles.noButton}>Não</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
