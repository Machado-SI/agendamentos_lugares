import React, {useState, useEffect} from 'react';

function App() {
  const [locais, setLocaisList] = useState([]);
  const [LocalSelecionado, setLocalSelecionado] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API || 'http://localhost:8888';

  async function buscaLocais() {
    setLocaisList([])
    setErrorMessage('')
    setLoading(true);
    try {
      const response =  await fetch(`${API}/lugares`)
      if(!response.ok) {
        throw new Error(`Erro ao buscar locais: ${response.status}`)
      }
      const data = await response.json();
      setLocaisList(data);
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
      <main className='mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-1'>
            <div>
              <h2 className='font-semibold text-[1.5rem]'>Locais Disponíveis</h2>
              <div className='space-y-4'>
              {locais.map((local) => (
               <div  key={local.id_local} className={`border-2 rounded-lg p-4 cursor-pointer ${LocalSelecionado === local.id_local ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} onClick={() => setLocalSelecionado(local.id_local)}>
                  <div className='flex justify-between'>
                    <h3 className='font-semibold text-lg'>{local.local}</h3>
                    <span className='bg-green-300 py-1 px-2 rounded-full'>Ativo</span>
                  </div>
                  <div className='my-3'>
                    <p>{local.descricao}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#b3b3b3"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                    <p>{`Capacidade: ${local.capacidade} pessoas`}</p>
                  </div>
               </div> 
              ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;