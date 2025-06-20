'use client'

import { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { registrarDemanda, getProximoProtocolo } from './action'
import { getToken, parseJwt } from '../../utils/auth'

interface CadastroDemandaProps {
  setShowCreateForm: (value: boolean) => void
  editData?: any | null
}


export default function NovaDemandaPage({ setShowCreateForm, editData }: CadastroDemandaProps) {
  const [focusedSelect, setFocusedSelect] = useState('')
  const [obs, setObs] = useState('')
  const [form, setForm] = useState({
    protocolo: '',
    setor: '',
    prioridade: 'P0',
    status: 'Pendente',
    dataSolicitacao: '',
    dataTermino: '',
    solicitant: '',
    nomeCompleto: '',
    cpf: '',
    reincidencia: 'N_o', // Valor correto do enum
    meioSolicitacao: 'WhatsApp',
    anexarDocumentos: '',
    envioCobranca1: '',
    envioCobranca2: '',
    envioParaResponsavel: '',
    observacoes: ''
  })

  const token = getToken();

  if (!token) {
    console.error('Sessão expirada. Faça login novamente.');
    return;
  }

  useEffect(() => {
    const token = getToken()
    if (token) {
      const decoded = parseJwt(token)
      const userId = decoded?.id
      if (userId) {
        setForm(prev => ({ ...prev, solicitantId: userId }))
      }
    }

    // Se for edição, preenche os campos
    if (editData) {
      setForm({
        protocolo: editData.protocolo || '',
        setor: editData.setor || '',
        prioridade: editData.prioridade || 'P0',
        status: editData.status || 'Pendente',
        dataSolicitacao: editData.dataSolicitacao?.split('T')[0] || '',
        dataTermino: editData.dataTermino?.split('T')[0] || '',
        solicitant: editData.solicitant || '',
        nomeCompleto: editData.solicitantes?.nomeCompleto || '',
        cpf: editData.solicitantes?.cpf || '',
        reincidencia: editData.reincidencia || 'N_o',
        meioSolicitacao: editData.meioSolicitacao || 'WhatsApp',
        anexarDocumentos: editData.anexarDocumentos || '',
        envioCobranca1: editData.envioCobranca1 || '',
        envioCobranca2: editData.envioCobranca2 || '',
        envioParaResponsavel: editData.envioParaResponsavel || '',
        observacoes: editData.observacoes || ''
      })
      setObs(editData.observacoes || '')
    }
  }, [editData])


  // Mapeia valores internos para exibição amigável
  const mapEnumToDisplay = (value: string) => {
    const mappings: Record<string, string> = {
      'N_o': 'Não',
      'Aguardando_Retorno': 'Aguardando Retorno',
      'Conclu_da': 'Concluída'
    }
    return mappings[value] || value
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'observacoes') setObs(value)
  }

  const handleSubmit = async () => {
    try {
      const protocolo = await getProximoProtocolo(token)
      const payload = {
        ...form,
        protocolo,
        // Garante que os enums estão nos valores corretos
        reincidencia: form.reincidencia,
        status: form.status === 'Aguardando Retorno' ? 'Aguardando_Retorno' :
          form.status === 'Concluída' ? 'Conclu_da' : form.status
      }
      await registrarDemanda(payload, token)
      setShowCreateForm(false)
    } catch (error) {
      alert('Erro ao registrar a demanda.')
      console.error(error)
    }
  }

  const renderSelect = (name: string, value: string, options: string[]) => (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={() => setFocusedSelect(name)}
        onBlur={() => setFocusedSelect('')}
        className="w-full appearance-none bg-white border border-[#007cb2] rounded px-3 py-2 pr-8 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#007cb2]"
      >
        {options.map(opt => (
          <option key={opt} value={opt === 'Selecione' ? '' : opt}>
            {mapEnumToDisplay(opt)}
          </option>
        ))}
      </select>
      <FaChevronDown
        className={`absolute right-3 top-3.5 text-[#007cb2] pointer-events-none transition-transform duration-200 ${focusedSelect === name ? 'rotate-180' : ''}`}
        size={14}
      />
    </div>
  )

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#b5e4f1] px-4 py-10">
      <div className="bg-white w-full max-w-6xl p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-[#007cb2] border-b border-black pb-1 mb-6">Demanda</h2>

        {/* Dados da Demanda */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3">Dados da Demanda</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium block mb-1">Setor:</label>
              {renderSelect('setor', form.setor, [
                'Selecione', 'FINANCEIRO', 'SUPORTE', 'EMPREGABILIDADE', 'DEMANDAS',
                'Animal', 'Saúde', 'Educação', 'Cadastro Eleitoral', 'Esportes',
                'Abastecimento de Água Zona Rural', 'Primeiro Título',
                'Transferência de Título', 'Saneamento'
              ])}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Prioridade:</label>
              {renderSelect('prioridade', form.prioridade, ['P0', 'P1', 'P2'])}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Status:</label>
              {renderSelect('status', form.status, ['Pendente', 'Aguardando_Retorno', 'Cancelada', 'Conclu_da'])}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Data da Solicitação:</label>
              <input
                type="date"
                name="dataSolicitacao"
                value={form.dataSolicitacao}
                onChange={handleChange}
                className="w-full border border-[#007cb2] rounded px-3 py-2 focus:ring-2 focus:ring-[#007cb2] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Data de Término:</label>
              <input
                type="date"
                name="dataTermino"
                value={form.dataTermino}
                onChange={handleChange}
                className="w-full border border-[#007cb2] rounded px-3 py-2 focus:ring-2 focus:ring-[#007cb2] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Solicitante:</label>
              <input
                type="text"
                name="solicitant"
                value={form.solicitant}
                onChange={handleChange}
                className="w-full border border-[#007cb2] rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Dados do Solicitante */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3">Dados do Solicitante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium block mb-1">Nome Completo:</label>
              <input
                type="text"
                name="nomeCompleto"
                value={form.nomeCompleto}
                onChange={handleChange}
                className="w-full border border-[#007cb2] rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">CPF:</label>
              <input
                type="text"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                className="w-full border border-[#007cb2] rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Informações Extras */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3">Informações Extras</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium block mb-1">Reincidência:</label>
              {renderSelect('reincidencia', form.reincidencia, ['N_o', 'Sim'])}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Meio de Solicitação:</label>
              {renderSelect('meioSolicitacao', form.meioSolicitacao, ['WhatsApp', 'Presencial'])}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Anexar Documentos:</label>
              <input
                type="text"
                name="anexarDocumentos"
                value={form.anexarDocumentos}
                onChange={handleChange}
                className="w-full border border-[#007cb2] rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Envio Cobrança 1:</label>
              <input
                type="text"
                name="envioCobranca1"
                value={form.envioCobranca1}
                onChange={handleChange}
                className="w-full border border-[#007cb2] rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Envio Cobrança 2:</label>
              <input
                type="text"
                name="envioCobranca2"
                value={form.envioCobranca2}
                onChange={handleChange}
                className="w-full border border-[#007cb2] rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Envio para o Responsável:</label>
              <input
                type="text"
                name="envioParaResponsavel"
                value={form.envioParaResponsavel}
                onChange={handleChange}
                className="w-full border border-[#007cb2] rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium block mb-1">Observações:</label>
            <textarea
              name="observacoes"
              maxLength={300}
              rows={4}
              value={form.observacoes}
              onChange={handleChange}
              className="w-full border border-[#007cb2] rounded px-3 py-2"
              placeholder="Digite aqui..."
            />
            <div className="text-right text-sm text-gray-500">{obs.length}/300 caracteres</div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowCreateForm(false)}
            className="bg-gray-100 border border-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-200 transition"
          >
            Voltar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#007cb2] text-white px-6 py-2 rounded hover:bg-[#00689c] transition"
          >
            Gravar
          </button>
        </div>
      </div>
    </div>
  )
}