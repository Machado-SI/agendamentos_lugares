import React from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthToken } from '../services/AuthService';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = checkAuthToken();
    const navigate = useNavigate();

    React.useEffect(() => {
        let timer

        if (!isAuthenticated) {
            timer = setTimeout(() => {
                navigate('/login', { replace: true })
            }, 5000)
        }

        return () => {
            // Caso o componente seja desmontado antes do timeout
            clearTimeout(timer)
        }
    }, [isAuthenticated, navigate])

    if (!isAuthenticated) {
        return <div className='bg-blue-700 h-screen flex items-center justify-center'>
            <h1 className='text-white text-2xl'>Redirecionando...</h1>
        </div>
    }

    return children;
}

export default ProtectedRoute;