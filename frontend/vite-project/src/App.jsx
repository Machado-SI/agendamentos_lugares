import React, {useState, useEffect} from 'react'

function App() {
  const [locais, setLocaisList] = useState([])
  const [LocalSelecionado, setLocalSelecionado] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)
  const [dataHoraInicio, setDataHoraInicio] = useState('')
  const [dataHoraFim, setDataHoraFim] = useState('')
  const [agendamentos, setAgendamentos] = useState([])
  const API = import.meta.env.VITE_API || 'http://localhost:8888'

  const handleAgendar = async (e) => {
    e.preventDefault()
    setMensagem('')
    setErrorMessage('')
    try {
      if (LocalSelecionado && dataHoraInicio && dataHoraFim) {
      const novoAgendamento = {
        local: LocalSelecionado.local,
        dataHoraInicio,
        dataHoraFim,
      }

      const response = await fetch(`${API}/agendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoAgendamento),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`${errorData.error}`)
      }
      setMensagem('Agendamento realizado com sucesso!')
    }
    } catch (error) {
      console.error('Erro ao agendar local:', error.message)
      setErrorMessage(error.message)
      setMensagem('')
    }
  }

  async function buscaLocais() {
    setLocaisList([])
    setErrorMessage('')
    setMensagem('')
    setLoading(true)
    try {
      const response =  await fetch(`${API}/lugares`)
      if(!response.ok) {
        throw new Error(`Erro ao buscar locais: ${response.status}`)
      }
      const data = await response.json()
      setLocaisList(data)
    } catch (error) {
      console.error('Erro ao buscar locais:', error.message)
      setErrorMessage('Erro ao buscar locais: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    buscaLocais()
  }, [])

  return (  

    <div className='min-h-screen bg-gray-50'>
      {/* Cabeçalho */}
      <header className='bg-blue-600 text-white shadow-md'>
        <div className='py-8 px-14'>
          <h1 className='font-bold text-2xl'>Sistema de Agendamentos de Locais</h1>
          <p className='mt-1'>Reserve salas e espaços facilmente</p>
        </div>
      </header>

      {/* Cards lugares */}
      <main className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-1'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='font-semibold text-[1.5rem]'>Locais Disponíveis</h2>
              <div className='space-y-4 mt-4'>
              {locais.map((local) => (
               <div  key={local.id_local} className={`border-2 rounded-lg p-4 cursor-pointer ${LocalSelecionado?.id_local === local.id_local ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} onClick={() => setLocalSelecionado(local)}>
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

          {/* Formulário de agendamento */}
          <div className='lg:col-span-2 space-y-8'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='font-semibold text-[1.5rem] mb-2'>{LocalSelecionado ? `Agendar ${LocalSelecionado.local}` : 'Selecione um local para agendar'}</h2>

              {LocalSelecionado ? (
                <form onSubmit={handleAgendar}>
                  <div className='space-y-4'>
                    <div> 
                      <label className='block text-sm font-medium'>Data e Hora de Início</label>
                      <input type="datetime-local" value={dataHoraInicio} onChange={(e) => setDataHoraInicio(e.target.value)} className='border-2 border-gray-300 focus:outline-none transition ease-in-out duration-300 focus:border-blue-500 py-2 px-3 rounded-lg w-full mt-[2px]' required/>
                    </div>

                    <div> 
                      <label className='block text-sm font-medium'>Data e Hora de Término</label>
                      <input type="datetime-local" value={dataHoraFim} onChange={(e) => setDataHoraFim(e.target.value)} className='border-2 border-gray-300 focus:outline-none transition ease-in-out duration-300 focus:border-blue-500 py-2 px-3 rounded-lg w-full mt-[2px]' required/>
                    </div>
                    <button type='submit' className='w-full bg-blue-600 py-2 px-4 rounded-lg text-white hover:bg-blue-700 hover:cursor-pointer transition ease-in-out duration-300'>Confirmar Agendamento</button>
                    {errorMessage && (
                      <p className='font-semibold text-red-500 text-md text-center'>{errorMessage}</p>
                    )}
                    {mensagem && (
                      <p className='font-semibold text-green-500 text-md text-center'>{mensagem}</p>
                    )}
                  </div>
                </form>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App