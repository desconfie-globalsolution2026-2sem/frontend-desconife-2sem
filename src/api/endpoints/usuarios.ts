/* /usuarios: cadastro, consulta e login da conta. */
import type {
  LoginRequest,
  UsuarioRequest,
  UsuarioResponse,
  UsuarioUpdateRequest,
} from '../../types/Api/dtos'
import { del, get, post, put } from '../api'

export const listarUsuarios = () => get<UsuarioResponse[]>('/usuarios')

export const buscarUsuario = (id: number) => get<UsuarioResponse>(`/usuarios/${id}`)

export const cadastrarUsuario = (dados: UsuarioRequest) => post<UsuarioResponse>('/usuarios', dados)

export const atualizarUsuario = (id: number, dados: UsuarioUpdateRequest) =>
  put<UsuarioResponse>(`/usuarios/${id}`, dados)

export const excluirUsuario = (id: number) => del(`/usuarios/${id}`)

export const login = (dados: LoginRequest) => post<UsuarioResponse>('/usuarios/login', dados)
