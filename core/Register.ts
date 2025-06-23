'use server'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export interface SolicitanteData {
  nomeCompleto?: string
  cpf: string
  email?: string
  senha: string
  telefoneContato?: string
  titulo?: string
  cep?: string
  endereco?: string
  bairro?: string
  num?: string
  zona?: string
  pontoReferencia?: string
  secaoEleitoral?: string
}

interface LoginResponse {
  message: string
  solicitante: {
    id: number
    nomeCompleto: string
    cpf: string
    email?: string
    telefoneContato?: string
    adm: boolean
    [key: string]: any
  }
  token: string
}

export async function registrarSolicitante(data: SolicitanteData): Promise<LoginResponse> {
  try {
    const response = await fetch(`${BASE_URL}/solicitantes/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })

    const json = await response.json()

    if (!response.ok) {
      const message = json?.message || json?.error || 'Erro ao registrar solicitante'
      throw new Error(message)
    }

    return json
  } catch (err) {
    console.error('Erro no registro:', err)
    if (err instanceof Error) throw new Error(err.message)
    throw new Error('Erro inesperado no registro')
  }
}

export async function loginSolicitante({
  email,
  senha,
}: {
  email: string
  senha: string
}): Promise<LoginResponse> {
  try {
    const response = await fetch(`${BASE_URL}/solicitantes/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha }),
    });

    const json = await response.json();

    if (!response.ok) {
      // Captura o erro corretamente para o front
      const message = json?.message || json?.error || 'Erro ao fazer login';
      throw new Error(message);
    }

    return {
      message: json.message,
      token: json.token,
      solicitante: json.usuario // ← o frontend espera "solicitante"
    };
  } catch (err: any) {
    console.error('[CORE] Erro no loginSolicitante:', err.message);
    throw new Error(err.message || 'Erro desconhecido no login');
  }
}


export async function updateSolicitante(id: number, data: any) {
  try {
    const response = await fetch(`${BASE_URL}/solicitantes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const json = await response.json()

    if (!response.ok) {
      const message = json?.message || json?.error || 'Erro ao atualizar solicitante'
      throw new Error(message)
    }

    return json
  } catch (err) {
    console.error('Erro ao atualizar solicitante:', err)
    if (err instanceof Error) throw new Error(err.message)
    throw new Error('Erro inesperado ao atualizar solicitante')
  }
}
