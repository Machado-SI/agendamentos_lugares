import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import App from './App.jsx';
import Register from './Register.jsx';
import Login from './login.jsx';

// Importação do middleware de rota protegida
import ProtectedRoute from './components/ProtectedRoute.jsx';

function Navbar() {
    const location = useLocation();

    // Verifica a localização atual
    const showTitle = location.pathname === '/'
    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="py-6 px-14">
                <div className="flex justify-between items-center">
                    {showTitle ? (
                        <div>
                            <h1 className="font-bold text-2xl">Sistema de Agendamentos de Locais</h1>
                            <p className="text-md text-white ">Reserve salas e espaços facilmente</p>
                        </div>
                    ) : (
                        <div></div>
                    )}
                    <ul className="flex space-x-12 font-semibold mr-[69rem]">
                        <li>
                            <Link to="/" className="hover:text-blue-200 transition duration-300">Home</Link>
                        </li>
                        <li>
                            <Link to="/login" className="hover:text-blue-200 transition duration-300">Login</Link>
                        </li>
                        <li>
                            <Link to="/register" className="hover:text-blue-200 transition duration-300">Register</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

function Routers() {
    return (
        <BrowserRouter>
            <Navbar />
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