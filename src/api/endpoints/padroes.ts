/* /padroes: termos e sinais que o motor de regras procura nas mensagens. */
import type { PadraoRequest, PadraoResponse } from '../../types/Api/dtos'
import { del, get, post, put } from '../api'

export const listarPadroes = () => get<PadraoResponse[]>('/padroes')

export const buscarPadrao = (id: number) => get<PadraoResponse>(`/padroes/${id}`)

export const cadastrarPadrao = (dados: PadraoRequest) => post<PadraoResponse>('/padroes', dados)

export const atualizarPadrao = (id: number, dados: PadraoRequest) =>
  put<PadraoResponse>(`/padroes/${id}`, dados)

export const excluirPadrao = (id: number) => del(`/padroes/${id}`)
