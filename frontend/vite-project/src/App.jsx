import React, {useState, useEffect} from 'react';

function App() {
  const [local, setLocalList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API || 'http://localhost:8888';

  async function buscaLocais() {
    setLocalList([])
    setErrorMessage('')
    setLoading(true);
    try {
      const response =  await fetch(`${API}/lugares`)
      if(!response.ok) {
        throw new Error(`Erro ao buscar locais: ${response.status}`)
      }
      const data = await response.json();
      setLocalList(data);
    } catch (error) {
      console.error('Erro ao buscar locais:', error.message);
      setErrorMessage('Erro ao buscar locais: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscaLocais()
  }, [])

  return (  
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-blue-600 text-white shadow-md'>
        <div className='py-8 px-14'>
          <h1 className='font-bold text-2xl'>Sistema de Agendamentos de Locais</h1>
          <p className='mt-1'>Reserve salas e espaços facilmente</p>
        </div>
      </header>
    </div>
  );
}

export default App;