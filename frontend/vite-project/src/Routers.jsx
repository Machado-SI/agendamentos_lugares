import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx';
import Register from './Register.jsx';
import Login from './login.jsx';

function Routers() {
    return ( 
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
     );
}

export default Routers;