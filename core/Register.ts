'use server'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json.error || 'Erro ao registrar solicitante');
    return json;
  } catch (err: any) {
    console.error('Erro no registro:', err.message);
    throw err;
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
    if (!response.ok) throw new Error(json.error || 'Erro ao fazer login');
    return json;
  } catch (err: any) {
    console.error('Erro no login:', err.message);
    throw err;
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
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json.error || 'Erro ao atualizar solicitante');
    return json;
  } catch (err: any) {
    console.error('Erro ao atualizar solicitante:', err.message);
    throw err;
  }
}
