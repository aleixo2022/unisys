import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/home/Home';
import { Login } from './pages/Login/Login';
import { Indicadores } from './pages/Indicadores/Indicadores';
import Register from './pages/register/Register';
import { ConnectMeli } from './components/connect/Connect';
import { Activeaccount } from './components/Activeaccount/Activeaccount';
import { Indicadores as Kpis } from './pages/initial/Indicadores/Indicadores';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { Integrations } from './pages/initial/Integrations/Integrations';
import { Orders } from './pages/initial/Order/Orders';
import { CmpP } from './pages/cmpPrincipal/Cmp';
import { SettingsPage } from './pages/initial/settingsPage/SettingsPage';
import { CostProfileTable } from './pages/initial/costProfileTable/CostProfileTable';
 

export function PrincipalRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/indicadores" element={<Indicadores />} />
            <Route path="/13a2828b3adecc1c32ea3888d08afa51e147b3f3" element={<Register />} />
            <Route path="/connect" element={<ConnectMeli />} />
            <Route path="/activated" element={<Activeaccount />} />
            <Route path="/initial" element={<ProtectedRoute />}>
                <Route path="indicadores" element={<Kpis />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="orders" element={<Orders />} />    
                <Route path="configuration" element={<SettingsPage />} />     
                <Route path="custos-estados" element={<CostProfileTable />} />     
            </Route>
            <Route path="/cmp/principal" element={<CmpP />} /> 
       
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
