'use server'

import * as Demanda from '../../core/CadastrarDemanda'

export async function registrarDemanda(data: any, token: string, isAdmin: boolean) {
  if (isAdmin) {
    return await Demanda.editarDemanda(data, token);
  } else {
    return await Demanda.criarDemanda(data, token);
  }
}

export async function getProximoProtocolo(token:string) {
  return Demanda.getProximoProtocolo(token)
}


