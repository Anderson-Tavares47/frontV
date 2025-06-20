'use server'

import * as Register from '../../core/Register'

import type { SolicitanteData } from '../../core/Register'

export async function registrarSolicitante(data: SolicitanteData, token: string) {
  return Register.registrarSolicitante(data, token)
}
