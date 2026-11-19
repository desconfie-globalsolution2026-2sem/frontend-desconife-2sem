/*
 * Usuario logado. A API nao usa token: o login devolve o usuario e as outras
 * chamadas levam o id dele no caminho. Por isso a sessao e so guardar esse objeto.
 *
 * "Manter conectado" grava em localStorage (sobrevive a fechar o navegador);
 * sem ele, em sessionStorage (some ao fechar a aba).
 */
import { createContext } from 'react'
import type { UsuarioResponse } from '../types/Api/dtos'

export interface Sessao {
  usuario: UsuarioResponse | null
  entrar: (usuario: UsuarioResponse, lembrar?: boolean) => void
  /* Troca os dados guardados (ex.: depois de editar a conta) sem mudar o "manter conectado". */
  atualizar: (usuario: UsuarioResponse) => void
  sair: () => void
}

export const SessaoContext = createContext<Sessao | null>(null)

const CHAVE = 'desconfie:usuario'

/* O storage pode falhar (modo privado, cota). Sem ele, a sessao vive so na memoria. */
export function lerUsuario(): UsuarioResponse | null {
  try {
    const bruto = localStorage.getItem(CHAVE) ?? sessionStorage.getItem(CHAVE)
    return bruto ? (JSON.parse(bruto) as UsuarioResponse) : null
  } catch {
    return null
  }
}

export function gravarUsuario(usuario: UsuarioResponse, lembrar: boolean) {
  try {
    apagarUsuario()
    ;(lembrar ? localStorage : sessionStorage).setItem(CHAVE, JSON.stringify(usuario))
  } catch {
    /* segue logado so nesta aba */
  }
}

/* true se a sessao atual foi gravada com "manter conectado". */
export function estaLembrado() {
  try {
    return localStorage.getItem(CHAVE) !== null
  } catch {
    return false
  }
}

export function apagarUsuario() {
  try {
    localStorage.removeItem(CHAVE)
    sessionStorage.removeItem(CHAVE)
  } catch {
    /* nada a fazer */
  }
}
