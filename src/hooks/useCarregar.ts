import { useEffect, useState } from 'react'
import { mensagemDeErro } from '../api/api'

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

  /* O estado so muda depois do await, e 'ativo' impede setState depois de a
     tela sair do ar. 'buscar' fica fora das dependencias de proposito: ela
     nasce nova a cada render, e quem decide quando rebuscar e a 'chave'. */
  useEffect(() => {
    let ativo = true
    buscar()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave, tentativa])

  function recarregar() {
    setCarregando(true)
    setErro('')
    setTentativa((n) => n + 1)
  }

  return { dados, setDados, carregando, erro, recarregar }
}
