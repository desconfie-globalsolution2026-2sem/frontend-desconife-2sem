/* /analises: analisar mensagem, link ou imagem, historico e feedback. */
import type {
  AnaliseRequest,
  AnaliseResponse,
  AnaliseResumoResponse,
  FeedbackRequest,
} from '../../types/Api/dtos'
import { del, get, post, put } from '../api'

export const analisar = (usuarioId: number, dados: AnaliseRequest) =>
  post<AnaliseResponse>(`/usuarios/${usuarioId}/analises`, dados)

export const listarAnalisesDoUsuario = (usuarioId: number) =>
  get<AnaliseResumoResponse[]>(`/usuarios/${usuarioId}/analises`)

export const listarTodasAnalises = () => get<AnaliseResumoResponse[]>('/analises')

export const buscarAnalise = (id: number) => get<AnaliseResponse>(`/analises/${id}`)

export const enviarFeedback = (id: number, dados: FeedbackRequest) =>
  put<AnaliseResponse>(`/analises/${id}`, dados)

export const excluirAnalise = (id: number) => del(`/analises/${id}`)
