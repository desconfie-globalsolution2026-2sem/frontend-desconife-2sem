import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSessao } from '../../hooks/useSessao'

/* Mesmo formato do botao "Entrar", para o header nao mudar de largura. */
const pilula =
  'ml-2 flex min-h-11 items-center rounded-full bg-navy px-4.5 text-[.98rem] font-medium text-white no-underline transition-colors hover:bg-[#163a60]'

const itemMenu =
  'flex min-h-10 w-full items-center rounded-lg px-3 text-left text-[.95rem] no-underline transition-colors hover:bg-surface'

/*
 * Ponta direita do header: "Entrar" para quem nao esta logado; logado, o
 * primeiro nome, que abre um menu com o circulo, a conta e o sair.
 *
 * O menu usa a Popover API do navegador: fechar ao clicar fora e no Esc vem
 * de graca, sem estado nem listener.
 */
export default function MenuConta() {
  const { usuario, sair } = useSessao()
  const navegar = useNavigate()
  const menu = useRef<HTMLDivElement>(null)

  if (!usuario) {
    return (
      <Link to="/entrar" className={pilula}>
        Entrar
      </Link>
    )
  }

  const fechar = () => menu.current?.hidePopover()

  function aoSair() {
    fechar()
    sair()
    navegar('/')
  }

  return (
    <>
      <button type="button" popoverTarget="menu-conta" className={pilula}>
        {usuario.nome.split(' ')[0]}
      </button>

      {/* Fica na camada de cima da pagina; o right acompanha a coluna de 1080px do header. */}
      <div
        ref={menu}
        id="menu-conta"
        popover="auto"
        className="fixed inset-auto top-[4.25rem] right-[max(1.25rem,calc((100vw-1080px)/2+1.25rem))] m-0 w-64 rounded-2xl border border-black/10 bg-white/90 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,.14)] backdrop-blur-xl backdrop-saturate-[1.8]"
      >
        <div className="px-3 pt-2 pb-2.5">
          <p className="font-semibold text-ink">{usuario.nome}</p>
          <p className="truncate text-[.88rem] text-muted">{usuario.email}</p>
        </div>
        <div className="my-1 h-px bg-black/10" />
        <Link to="/circulo" onClick={fechar} className={`${itemMenu} text-ink`}>
          Círculo de confiança
        </Link>
        <Link to="/minhas-analises" onClick={fechar} className={`${itemMenu} text-ink`}>
          Minhas análises
        </Link>
        <Link to="/minha-conta" onClick={fechar} className={`${itemMenu} text-ink`}>
          Minha conta
        </Link>
        <div className="my-1 h-px bg-black/10" />
        <button type="button" onClick={aoSair} className={`${itemMenu} text-danger`}>
          Sair
        </button>
      </div>
    </>
  )
}
