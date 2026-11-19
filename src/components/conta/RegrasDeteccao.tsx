import { useCarregar } from '../../hooks/useCarregar'
import { listarCategorias } from '../../services/endpoints/categorias'
import { listarPadroes } from '../../services/endpoints/padroes'
import EstadoCarga from '../layout/EstadoCarga'
import Categorias from './Categorias'
import Padroes from './Padroes'

/*
 * Regras de deteccao na Minha conta: categorias e padroes que o motor de
 * regras usa em toda analise. As duas listas carregam aqui porque uma depende
 * da outra (o padrao escolhe a categoria; a categoria conta os padroes).
 */
export default function RegrasDeteccao() {
  const categorias = useCarregar(listarCategorias, 'categorias')
  const padroes = useCarregar(listarPadroes, 'padroes')

  const carregando = categorias.carregando || padroes.carregando
  const erro = categorias.erro || padroes.erro
  function recarregar() {
    categorias.recarregar()
    padroes.recarregar()
  }

  return (
    <section aria-labelledby="titulo-regras" className="grid gap-5">
      <div className="grid gap-2">
        <h2 id="titulo-regras" className="text-[clamp(1.6rem,3vw,2.2rem)] font-bold">
          Regras de detecção
        </h2>
        <p className="max-w-[62ch] text-muted">
          O que o Desconfie procura em toda mensagem. Uma mudança aqui vale na hora para todas as
          análises e aparece na página inicial.
        </p>
      </div>

      <EstadoCarga carregando={carregando} erro={erro} recarregar={recarregar} />

      {categorias.dados && padroes.dados && (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <Categorias
            categorias={categorias.dados}
            setCategorias={categorias.setDados}
            padroes={padroes.dados}
          />
          <Padroes padroes={padroes.dados} setPadroes={padroes.setDados} categorias={categorias.dados} />
        </div>
      )}
    </section>
  )
}
