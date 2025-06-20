'use server'

import * as Demanda from '../../core/CadastrarDemanda'

export async function registrarDemanda(data: any, token:string) {
  return Demanda.criarDemanda(data, token)
}

export async function getProximoProtocolo(token:string) {
  return Demanda.getProximoProtocolo(token)
}
