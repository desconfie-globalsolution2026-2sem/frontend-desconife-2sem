/* /categorias: tipos de golpe que agrupam os padroes (cadastrados na Minha conta). */
import type { CategoriaRequest, CategoriaResponse } from '../../types/Api/dtos'
import { del, get, post } from '../api'

export const listarCategorias = () => get<CategoriaResponse[]>('/categorias')

export const cadastrarCategoria = (dados: CategoriaRequest) =>
  post<CategoriaResponse>('/categorias', dados)

export const excluirCategoria = (id: number) => del(`/categorias/${id}`)
