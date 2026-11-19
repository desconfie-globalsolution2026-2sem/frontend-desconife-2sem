import { useEffect, useEffectEvent, useState } from 'react'
import { mensagemDeErro } from '../services/api'

/*
 * Busca dados da API quando a tela abre (e de novo se 'chave' mudar).
 *
 * Devolve os dados, o "carregando", o erro ja em texto de tela, um setDados
 * para atualizar a lista depois de criar/apagar sem buscar tudo de novo, e
 * recarregar() para o botao de "tentar de novo".
 */
export function useCarregar<T>(buscar: () => Promise<T>, chave: unknown) {
  const [dados, setDados] = useState<T>()
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  /* 'buscar' nasce nova a cada render. Como Effect Event, o efeito chama sempre
     a versao mais recente sem depender dela: quem decide quando rebuscar e a
     'chave' (e o "tentar de novo"). */
  const executarBusca = useEffectEvent(() => buscar())

  /* O estado so muda depois do await, e 'ativo' impede setState depois de a
     tela sair do ar. */
  useEffect(() => {
    let ativo = true
    executarBusca()
      .then((resultado) => {
        if (!ativo) return
        setDados(resultado)
        setErro('')
      })
      .catch((e) => ativo && setErro(mensagemDeErro(e)))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [chave, tentativa])

  function recarregar() {
    setCarregando(true)
    setErro('')
    setTentativa((n) => n + 1)
  }

  return { dados, setDados, carregando, erro, recarregar }
}
