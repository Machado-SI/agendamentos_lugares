import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Login() {
    const [error, setError] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [timer, setTimer] = useState(null);
    const navigate = useNavigate();

    // Variável de ambiente para a URL da API
    const url = import.meta.env.VITE_API

    const handleSubmit = async (e) => {
        // Impede o comportamento padrão do formulário, sempre deve ser a primeira linha
        e.preventDefault();
        try {
            setError('');
            setMensagem('');
            setLoading(true);

            const response = await fetch(`${url}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, senha }),
            })

            // Tenta converter a resposta para texto
            const responseText = await response.text();
            let data
            try {
                // Converte o texto para JSON caso a string seja um JSON válido
                data = JSON.parse(responseText);
            } catch (error) {
                throw new Error('Tipo de dados inválido recebido do servidor', error.message);
            }

            if (!response.ok) {
                const errMsg = data.message || data.error || 'Erro ao logar'
                throw new Error(errMsg);
            }

            setMensagem('Login realizado com sucesso! Redirecionando...');

            // Salva o token no localStorage
            if (data.token) {
                localStorage.setItem('token', data.token);
            } else {
                throw new Error('Token não recebido do servidor');
            }

            // Redireciona para a página principal após 3 segundos
            setTimer(setTimeout(() => {
                navigate('/')
            }, 3000))

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Caso o componente seja desmontado, limpa o timer
    useEffect(() => {
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        }
    })

    return (
        loading ? (
            // Spinner de carregamento
            <div className="min-h-screen flex items-center justify-center bg-purple-700 p-4">
                <svg
                    viewBox="25 25 50 50"
                    className="w-[3.25em] animate-spin"
                    style={{ transformOrigin: 'center' }}
                >
                    <circle
                        r="20"
                        cy="50"
                        cx="50"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="4"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: '1, 200',
                            strokeDashoffset: '0',
                            animation: 'dash 1.5s ease-in-out infinite'
                        }}
                    />
                </svg>
                <style>{`
            @keyframes dash {
              0% {
                stroke-dasharray: 1, 200;
                stroke-dashoffset: 0;
              }
              50% {
                stroke-dasharray: 90, 200;
                stroke-dashoffset: -35px;
              }
              100% {
                stroke-dashoffset: -125px;
              }
            }
          `}</style>
            </div>
        ) : (
            // Formulário de login
            <div className="min-h-screen flex items-center justify-center bg-blue-700 p-4">
                <form onSubmit={handleSubmit} className="max-w-sm w-full bg-white p-6 rounded-lg shadow-lg flex flex-col">
                    <span className="text-center text-2xl font-bold mb-6 text-gray-800">Login</span>

                    <label htmlFor="username" className="text-black mb-1 text-sm">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        onChange={(e) => setNome(e.target.value)}
                        className="px-3 py-2 mb-4 w-full text-base text-gray-600 outline-none border-2 rounded-lg transition ease-in-out duration-300 focus:bg-white focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />

                    <label htmlFor="password" className="text-black mb-1 text-sm">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        onChange={(e) => setSenha(e.target.value)}
                        className="px-3 py-2 mb-6 w-full text-base text-gray-600 outline-none border-2 rounded-lg transition ease-in-out duration-300 focus:bg-white focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />

                    <button
                        type="submit"
                        className="bg-gray-800 text-white border-none rounded py-2 px-4 text-lg cursor-pointer transition-all duration-200 hover:bg-gray-700" disabled={loading}
                    >
                        Login
                    </button>
                    {error ? <p className="text-red-500 text-md mt-4 font-semibold text-center">{error}</p> : <p className="text-green-500 text-md mt-4 font-semibold text-center">{mensagem}</p>}
                </form>
            </div>
        )

    );
}

export default Login;

