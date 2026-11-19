/* /analises: mandar uma mensagem para analise, listar o historico, abrir uma e dar feedback. */
import type {
  AnaliseRequest,
  AnaliseResponse,
  AnaliseResumoResponse,
  Feedback,
} from '../../types/Api/dtos'
import { mascararDados } from '../../utils/mascarar'
import { del, get, post, put } from '../api'

/* A API tambem mascara, mas aqui o CPF nem chega a sair do navegador. */
export const criarAnalise = (usuarioId: number, dados: AnaliseRequest) =>
  post<AnaliseResponse>(`/usuarios/${usuarioId}/analises`, {
    ...dados,
    conteudo: dados.conteudo && mascararDados(dados.conteudo),
  })

export const listarAnalisesDoUsuario = (usuarioId: number) =>
  get<AnaliseResumoResponse[]>(`/usuarios/${usuarioId}/analises`)

export const buscarAnalise = (id: number) => get<AnaliseResponse>(`/analises/${id}`)

export const enviarFeedback = (id: number, feedback: Feedback) =>
  put<AnaliseResponse>(`/analises/${id}`, { feedback })

export const excluirAnalise = (id: number) => del(`/analises/${id}`)
