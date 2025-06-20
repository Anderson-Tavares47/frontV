'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginSolicitante } from './action'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Preencha todos os campos!')
      return
    }

    setLoading(true)
    try {
      const response = await loginSolicitante({ email, senha: password })

      if (!response.token) {
        throw new Error('Token não recebido do servidor.')
      }

      localStorage.setItem('token', response.token)
      localStorage.setItem('solicitante', JSON.stringify(response.solicitante))

      router.push('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        alert(`Erro: ${err.message}`)
      } else {
        alert('Erro desconhecido ao tentar login.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterRedirect = () => {
    window.location.href = '/register'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#b5e4f1] px-4">
      <div className="bg-white shadow-md rounded-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#007cb2]">Entrar</h2>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Email ou CPF</label>
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-[#007cb2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007cb2]"
            placeholder="seu@email.com ou CPF"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-gray-700">Senha</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-[#007cb2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007cb2]"
            placeholder="********"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#007cb2] text-white py-2 rounded-lg font-semibold hover:bg-[#00689c] transition disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <div className="mt-4 text-center">
          <span className="text-gray-600">Não tem conta?</span>{' '}
          <button
            onClick={handleRegisterRedirect}
            className="text-[#007cb2] hover:underline font-medium"
          >
            Criar conta
          </button>
        </div>
      </div>
    </div>
  )
}
