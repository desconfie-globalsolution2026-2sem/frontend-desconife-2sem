/* /categorias: tipos de golpe, com descricao e orientacao para o usuario. */
import type { CategoriaRequest, CategoriaResponse, PadraoRequest, PadraoResponse } from '../../types/Api/dtos'
import { del, get, post, put } from '../api'

export const listarCategorias = () => get<CategoriaResponse[]>('/categorias')

export const buscarCategoria = (id: number) => get<CategoriaResponse>(`/categorias/${id}`)

export const cadastrarCategoria = (dados: CategoriaRequest) =>
  post<CategoriaResponse>('/categorias', dados)

export const atualizarCategoria = (id: number, dados: CategoriaRequest) =>
  put<CategoriaResponse>(`/categorias/${id}`, dados)

export const excluirCategoria = (id: number) => del(`/categorias/${id}`)

export const listarPadroesDaCategoria = (id: number) =>
  get<PadraoResponse[]>(`/categorias/${id}/padroes`)

export const cadastrarPadraoNaCategoria = (id: number, dados: PadraoRequest) =>
  post<PadraoResponse>(`/categorias/${id}/padroes`, dados)
