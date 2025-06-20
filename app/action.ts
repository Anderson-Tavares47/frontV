'use server'

import * as Register from '../core/Register'

interface LoginData {
  email: string
  senha: string
}

export async function loginSolicitante(data: LoginData) {
  return Register.loginSolicitante(data)
}
