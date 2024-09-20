import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './register.module.css';
import logo from "../../assets/images/logo.svg";
import { setEmail } from '../../features/email/emailSlice';
import { setPassword } from '../../features/password/passwordSlice';
import { useDispatch } from 'react-redux';
import { setUsername } from '../../features/username/usernameSlice';
import { resetIdentityVerify } from '../../features/identity/identityVerify';
const Register = () => {
    const [username, setUsernameState] = useState('');
    const [email, setEmailState] = useState('');
    const [password, setPasswordState] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const API_URL= import.meta.env.VITE_NGROK_LINK;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('As senhas não coincidem!');
            return;
        }

        setLoading(true);

        const requestBody = {
            username,
            email,
            password,
            confirm: confirmPassword
        };

        try {
            // const response = await fetch('https://unisys-7981816f1ad6.herokuapp.com/auth/register', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Accept': 'application/json',
            //     },
            //     body: JSON.stringify(requestBody)
            // });
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            setLoading(false);

            if (response.status !== 201) {
                setMessage(data.message);
                return;
            }

            dispatch(setEmail(email));
            dispatch(setPassword(password));
            dispatch(setUsername(username));
            dispatch(resetIdentityVerify());
            setShowSuccess(true);
            setTimeout(() => {                
                navigate('/connect'); // Redireciona para a página de conexão após 2 segundos
            }, 2000); // tempo duração da animação
        } catch (error) {
            setLoading(false);
            console.error(error.response ? error.response.data : error.message);
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Erro ao conectar ao servidor');
            }
        }
    };

    return (
        <div className={styles.container}>
            {showSuccess ? (
                <div className={styles.successMessage}>
                    <h2>Cadastro realizado com sucesso!</h2>
                    <p>Você será redirecionado em breve.</p>
                </div>
            ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <img src={logo} alt="Logo" className={styles.logo} />
                    <h2>Register</h2>
                    <input
                        type="text"
                        placeholder="Usuário"
                        value={username}
                        onChange={(e) => setUsernameState(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmailState(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPasswordState(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirmar Senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {message && <p className={styles.message}>{message}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Registrando...' : 'Register'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Register;
