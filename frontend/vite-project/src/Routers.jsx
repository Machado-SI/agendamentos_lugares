import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx';
import Register from './Register.jsx';
import Login from './login.jsx';

// Importação do middleware de rota protegida
import ProtectedRoute from './components/ProtectedRoute.jsx';

function Routers() {
    return ( 
        <BrowserRouter>
            <Routes>
                {/* Rota protegida */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <App />
                    </ProtectedRoute>
                } />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
     );
}

export default Routers;