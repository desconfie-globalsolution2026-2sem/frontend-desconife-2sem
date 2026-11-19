/*
 * Camada de rede. Toda chamada do site passa por aqui.
 * Os caminhos de cada recurso ficam em src/services/endpoints.
 */

const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export class ErroApi extends Error {
  status: number
  constructor(status: number, mensagem: string) {
    super(mensagem)
    this.status = status
  }
}

/* Texto para mostrar na tela: o que a API explicou ou, se nem chegou nela, um aviso geral. */
export function mensagemDeErro(erro: unknown) {
  return erro instanceof ErroApi
    ? erro.message
    : 'Não conseguimos falar com o Desconfie agora. Tente de novo em instantes.'
}

export async function requisicao<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const resposta = await fetch(`${BASE}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...opcoes.headers,
    },
  })

  /* DELETE e alguns PATCH voltam sem corpo. */
  const texto = await resposta.text()
  const corpo = texto ? JSON.parse(texto) : undefined

  if (!resposta.ok) {
    /* A API manda { status, erro, mensagem, campos } em todo erro. */
    throw new ErroApi(resposta.status, corpo?.mensagem ?? `A API respondeu ${resposta.status}.`)
  }

  return corpo as T
}

/* Atalhos por metodo HTTP, usados pelos arquivos de src/services/endpoints. */
export const get = <T>(caminho: string) => requisicao<T>(caminho)

export const post = <T>(caminho: string, dados?: unknown) =>
  requisicao<T>(caminho, { method: 'POST', body: JSON.stringify(dados) })

export const put = <T>(caminho: string, dados: unknown) =>
  requisicao<T>(caminho, { method: 'PUT', body: JSON.stringify(dados) })

export const patch = <T>(caminho: string) => requisicao<T>(caminho, { method: 'PATCH' })

export const del = (caminho: string) => requisicao<void>(caminho, { method: 'DELETE' })
