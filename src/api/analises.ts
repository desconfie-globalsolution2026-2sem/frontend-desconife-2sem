/*
 * O que as telas chamam. Elas nao sabem se a resposta veio da API ou do mock:
 * so pedem "analisa isso" e "me da o historico".
 */
import type { Analise, NovaAnalise } from '../types/Analise/analise'
import { endpointDefinido, endpoints, requisicao } from './api'
import { analisarLocal, lerHistorico, limparHistorico, salvarNoHistorico } from './mockAnalises'
import { mascararDados } from '../utils/mascarar'

export async function enviarAnalise(nova: NovaAnalise): Promise<Analise> {
  const corpo: NovaAnalise = { ...nova, mensagem: mascararDados(nova.mensagem) }

  if (endpointDefinido(endpoints.criarAnalise)) {
    return requisicao<Analise>(endpoints.criarAnalise, {
      method: 'POST',
      body: JSON.stringify(corpo),
    })
  }

  const analise = analisarLocal(corpo)
  salvarNoHistorico(analise)
  return analise
}

export async function listarAnalises(): Promise<Analise[]> {
  if (endpointDefinido(endpoints.listarAnalises)) {
    return requisicao<Analise[]>(endpoints.listarAnalises)
  }

  return lerHistorico()
}

/* Apagar e local por enquanto. Com a API, vira DELETE no endpoint do historico. */
export async function apagarAnalises(): Promise<void> {
  limparHistorico()
}

/* True quando nada da API foi ligado ainda: as telas avisam que e demonstracao. */
export function modoDemonstracao() {
  return !endpointDefinido(endpoints.criarAnalise)
}
