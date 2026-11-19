/* Alertas que o guardiao recebe quando um dependente analisa algo arriscado. */
import type { AlertaResponse } from '../../types/Api/dtos'
import { get, patch } from '../api'

export const listarAlertas = (usuarioId: number, somenteNaoLidos = false) =>
  get<AlertaResponse[]>(`/usuarios/${usuarioId}/alertas${somenteNaoLidos ? '?naoLidos=true' : ''}`)

export const marcarAlertaComoLido = (id: number) => patch<AlertaResponse>(`/alertas/${id}/lido`)
