import { useState, type ReactNode } from 'react'
import type { UsuarioResponse } from '../types/Api/dtos'
import { SessaoContext, apagarUsuario, gravarUsuario, lerUsuario } from './sessao'

export default function SessaoProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState(lerUsuario)

  function entrar(novo: UsuarioResponse, lembrar = true) {
    gravarUsuario(novo, lembrar)
    setUsuario(novo)
  }

  function sair() {
    apagarUsuario()
    setUsuario(null)
  }

  return <SessaoContext value={{ usuario, entrar, sair }}>{children}</SessaoContext>
}
