import { useContext } from 'react'
import { SessaoContext } from '../context/sessao'

/* Usuario logado (ou null), mais entrar e sair. */
export function useSessao() {
  const sessao = useContext(SessaoContext)
  if (!sessao) throw new Error('useSessao precisa estar dentro do SessaoProvider.')
  return sessao
}
