'use client'

import { useEffect, useState } from 'react'
import CadastroDemanda from '../cadastroDemanda/CadastroDemanda'
import { FaChevronDown } from 'react-icons/fa'
import { getTodasDemandas, excluirDemanda } from './action'
import { getToken, parseJwt } from '../../utils/auth'

const ITEMS_PER_PAGE = 20

export default function ListaDemandas() {
  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [allData, setAllData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [focusedSelect, setFocusedSelect] = useState('')
  const [editData, setEditData] = useState<any | null>(null)
  const [isAdmin2, setIsAdmin] = useState(false)

  const token = getToken()

  if (!token) {
    console.error('Sessão expirada. Faça login novamente.');
    return;
  }


  const loadData = async () => {
    try {
      const token = getToken()
      const decoded = token ? parseJwt(token) : null
      const id = decoded?.id || ''
      const isAdmin = decoded?.adm === true

      if (!token) {
        alert('Sessão expirada. Faça login novamente.');
        return;
      }

      setIsAdmin(isAdmin)

      const res = await getTodasDemandas(id, isAdmin, token)
      setAllData(res)
      setFilteredData(res)
    } catch (err) {
      alert('Erro ao carregar demandas')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const filtered = allData.filter(item => {
      const nome = item.solicitantes?.nomeCompleto?.toLowerCase() || ''
      const solicitante = item.solicitantes?.solicitante?.toLowerCase() || ''
      const searchMatch = nome.includes(search.toLowerCase()) || solicitante.includes(search.toLowerCase())
      const statusMatch = statusFilter === 'Todos' || item.status === statusFilter
      const dateMatch = !date || item.dataSolicitacao?.startsWith(date)
      return searchMatch && statusMatch && dateMatch
    })

    setFilteredData(filtered)
    setCurrentPage(1)
  }, [search, statusFilter, date, allData])

  const handleClear = () => {
    setSearch('')
    setDate('')
    setStatusFilter('Todos')
    setFilteredData(allData)
    setCurrentPage(1)
  }

  const handleNew = () => {
    setEditData(null)
    setShowCreateForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente excluir esta demanda?')) {
      try {
        await excluirDemanda(id, token)
        await loadData()
      } catch (error) {
        alert('Erro ao excluir demanda')
        console.error(error)
      }
    }
  }

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (showCreateForm) {
    return <CadastroDemanda setShowCreateForm={setShowCreateForm} editData={editData} />
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#17686f] mb-6">Lista de Demandas</h2>
        {isAdmin2 && (
          <span className="text-xs px-3 py-1 bg-green-100 text-green-700 border border-green-400 rounded-full">
            Administrador
          </span>
        )}
      </div>


      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Buscar por nome ou solicitante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-[#007cb2] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#007cb2] w-full lg:w-64"
          />
          <div className="relative w-full lg:w-56">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              onFocus={() => setFocusedSelect('status')}
              onBlur={() => setFocusedSelect('')}
              className="w-full appearance-none border border-[#007cb2] rounded px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#007cb2]"
            >
              <option value="Todos">Todos</option>
              <option value="Pendente">Pendente</option>
              <option value="Aguardando Retorno">Aguardando Retorno</option>
              <option value="Cancelada">Cancelada</option>
              <option value="Concluída">Concluída</option>
            </select>
            <FaChevronDown
              className={`absolute right-3 top-3.5 text-[#007cb2] pointer-events-none transition-transform duration-200 ${focusedSelect === 'status' ? 'rotate-180' : ''}`}
              size={14}
            />
          </div>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-[#007cb2] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#007cb2] w-full lg:w-48"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="bg-gray-100 border border-gray-300 text-gray-800 px-5 py-2 rounded hover:bg-gray-200 transition"
          >
            Limpar
          </button>
          <button
            onClick={handleNew}
            className="bg-[#007cb2] text-white px-6 py-2 rounded hover:bg-[#00689c] transition"
          >
            Novo
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-[#1c7d87] text-white">
            <tr>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Protocolo</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Contato</th>
              <th className="px-4 py-3">Prioridade</th>
              <th className="px-4 py-3">Data Solicitação</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(item => (
              <tr key={item.id} className="even:bg-[#c4f9ff]">
                <td className="px-4 py-3 text-gray-700">{item.status}</td>
                <td className="px-4 py-3 text-gray-700">{item.protocolo}</td>
                <td className="px-4 py-3 text-gray-800 font-medium">{item.solicitantes?.nomeCompleto || '-'}</td>
                <td className="px-4 py-3 text-gray-700">{item.solicitantes?.telefoneContato || '-'}</td>
                <td className="px-4 py-3 text-gray-700">{item.prioridade}</td>
                <td className="px-4 py-3 text-gray-700">
                  {item.dataSolicitacao ? new Date(item.dataSolicitacao).toLocaleDateString('pt-BR') : '-'}
                </td>
                <td className="px-4 py-3 text-center space-x-3">
                  <button
                    className="text-[#007cb2] hover:underline"
                    onClick={() => {
                      setEditData(item)
                      setShowCreateForm(true)
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(item.id)}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-4">
                  Nenhuma demanda encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center items-center gap-3">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className="px-3 py-1 rounded bg-[#007cb2] text-white hover:bg-[#00689c] disabled:bg-gray-400"
        >
          Anterior
        </button>
        <span className="text-gray-700">Página {currentPage} de {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 rounded bg-[#007cb2] text-white hover:bg-[#00689c] disabled:bg-gray-400"
        >
          Próxima
        </button>
      </div>
    </div>
  )
}
