import { useState, type ReactNode } from 'react'
import type { UsuarioResponse } from '../types/Api/dtos'
import { SessaoContext, apagarUsuario, estaLembrado, gravarUsuario, lerUsuario } from './sessao'

export default function SessaoProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState(lerUsuario)

  function entrar(novo: UsuarioResponse, lembrar = true) {
    gravarUsuario(novo, lembrar)
    setUsuario(novo)
  }

  function atualizar(novo: UsuarioResponse) {
    gravarUsuario(novo, estaLembrado())
    setUsuario(novo)
  }

  function sair() {
    apagarUsuario()
    setUsuario(null)
  }

  return <SessaoContext value={{ usuario, entrar, atualizar, sair }}>{children}</SessaoContext>
}
