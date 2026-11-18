/*
 * Camada de rede. Toda chamada do site passa por aqui.
 *
 * Os caminhos ficam em um objeto so para nao espalhar string de URL pelas
 * telas: quando a API Java definir os endpoints, muda neste arquivo e pronto.
 *
 * Enquanto um caminho estiver vazio, o service correspondente usa o mock local
 * (src/api/mockAnalises.ts), para a tela continuar demonstravel.
 */

const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export const endpoints = {
  /* POST: recebe { canal, mensagem }, devolve a Analise com nota e sinais. */
  criarAnalise: '',
  /* GET: devolve a lista de Analise do usuario logado, mais recente primeiro. */
  listarAnalises: '',
  /* POST: feedback do usuario sobre um veredito. Ainda nao usado nas telas. */
  enviarFeedback: '',
}

export function endpointDefinido(caminho: string) {
  return caminho.trim() !== ''
}

export class ErroApi extends Error {
  status: number
  constructor(status: number, mensagem: string) {
    super(mensagem)
    this.status = status
  }
}

export async function requisicao<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const resposta = await fetch(`${BASE}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...opcoes.headers,
    },
  })

  if (!resposta.ok) {
    throw new ErroApi(resposta.status, `A API respondeu ${resposta.status}.`)
  }

  return (await resposta.json()) as T
}
