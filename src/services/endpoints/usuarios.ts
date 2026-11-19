/* /usuarios: conta, login e circulo de confianca (guardiao e dependentes). */
import type {
  DependenteRequest,
  LoginRequest,
  MembroCirculoResponse,
  UsuarioRequest,
  UsuarioResponse,
  UsuarioUpdateRequest,
  VinculoResponse,
} from '../../types/Api/dtos'
import { ErroApi, del, get, post, put } from '../api'

export const cadastrarUsuario = (dados: UsuarioRequest) => post<UsuarioResponse>('/usuarios', dados)

export const atualizarUsuario = (id: number, dados: UsuarioUpdateRequest) =>
  put<UsuarioResponse>(`/usuarios/${id}`, dados)

export const excluirUsuario = (id: number) => del(`/usuarios/${id}`)

export const login = (dados: LoginRequest) => post<UsuarioResponse>('/usuarios/login', dados)

/* Circulo de confianca */

/* Sem guardiao a API responde 404; para a tela isso e so "ninguem", nao um erro. */
export const buscarGuardiao = (id: number) =>
  get<MembroCirculoResponse>(`/usuarios/${id}/guardiao`).catch((erro) => {
    if (erro instanceof ErroApi && erro.status === 404) return null
    throw erro
  })

export const listarDependentes = (id: number) =>
  get<MembroCirculoResponse[]>(`/usuarios/${id}/dependentes`)

export const adicionarDependente = (id: number, dados: DependenteRequest) =>
  post<VinculoResponse>(`/usuarios/${id}/dependentes`, dados)

export const removerDependente = (id: number, dependenteId: number) =>
  del(`/usuarios/${id}/dependentes/${dependenteId}`)
