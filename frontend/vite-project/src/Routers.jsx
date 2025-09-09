import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx';
import Register from './components/Register.jsx';

function Routers() {
    return ( 
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
     );
}

export default Routers;