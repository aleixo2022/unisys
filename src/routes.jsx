import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/home/Home';
import { Login } from './pages/Login/Login';
import { Indicadores } from './pages/Indicadores/Indicadores';
import Register from './pages/register/Register';
import { ConnectMeli } from './components/connect/Connect';
import { Activeaccount } from './components/Activeaccount/Activeaccount';
import { Indicadores as Kpis } from './pages/meli/Indicadores/Indicadores';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { Integrations } from './pages/meli/Integrations/Integrations';
import { Orders } from './pages/meli/Order/Orders';
import { CmpP } from  './pages/cmpPrincipal/Cmp'

export function PrincipalRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/indicadores" element={<Indicadores />} />
            <Route path="/register" element={<Register />} />
            <Route path="/connect" element={<ConnectMeli />} />
            <Route path="/activated" element={<Activeaccount />} />
            <Route path="/meli" element={<ProtectedRoute />}>
                <Route path="indicadores" element={<Kpis />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="orders" element={<Orders />} />         
            </Route>
            <Route path="/cmp/principal" element={<CmpP />} />
        </Routes>
    );
}
