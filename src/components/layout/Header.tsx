import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../../assets/desconfie-logo.svg'
import MenuConta from './MenuConta'

const navItems = [
  { path: '/', label: 'Início' },
  { path: '/integrantes', label: 'Integrantes' },
  { path: '/analisar', label: 'Analisar' },
  { path: '/minhas-analises', label: 'Minhas análises' },
  { path: '/sobre', label: 'Sobre' },
  { path: '/faq', label: 'Perguntas' },
  { path: '/contato', label: 'Contato' },
]

const classeLink = ({ isActive }: { isActive: boolean }) =>
  [
    'flex min-h-11 items-center rounded-full px-3.5 text-[.98rem] no-underline transition-colors',
    isActive
      ? 'bg-surface font-semibold text-navy'
      : 'font-medium text-muted hover:bg-surface hover:text-navy',
  ].join(' ')

/*
 * Desktop (lg+): links em linha. Celular e tablet: botao de menu que abre a
 * lista empilhada embaixo do header. Clicar num link ou apertar Esc fecha.
 */
export default function Header() {
  const [aberto, setAberto] = useState(false)
  const fechar = () => setAberto(false)

  return (
    <header
      onKeyDown={(e) => e.key === 'Escape' && fechar()}
      className="glass sticky top-0 z-20 border-b border-black/10 bg-white/82 backdrop-blur-xl backdrop-saturate-[1.8]"
    >
      <div className="mx-auto flex min-h-16 max-w-[1080px] items-center justify-between gap-4 px-5">
        <NavLink
          to="/"
          onClick={fechar}
          aria-label="Desconfie, ir para o início"
          className="flex items-center"
        >
          <img src={Logo} alt="" className="h-10 w-auto" />
        </NavLink>

        <div className="flex items-center gap-2">
          {/* Desktop */}
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex list-none gap-0.5 p-0">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink to={item.path} end={item.path === '/'} className={classeLink}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Um so: o popover da conta tem id fixo. */}
          <MenuConta />

          {/* Celular e tablet: botao do menu */}
          <button
            type="button"
            onClick={() => setAberto((a) => !a)}
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            className="grid size-11 place-items-center rounded-full text-navy lg:hidden transition-colors hover:bg-surface"
          >
            {/* Tres barras que viram um X quando o menu abre. */}
            <span aria-hidden="true" className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded bg-current transition-transform ${aberto ? 'top-1.5 rotate-45' : 'top-0'}`}
              />
              <span
                className={`absolute top-1.5 left-0 block h-0.5 w-5 rounded bg-current transition-opacity ${aberto ? 'opacity-0' : ''}`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded bg-current transition-transform ${aberto ? 'top-1.5 -rotate-45' : 'top-3'}`}
              />
            </span>
          </button>
        </div>
      </div>

      {aberto && (
        <nav id="menu-mobile" aria-label="Principal" className="border-t border-black/10 lg:hidden">
          <ul className="mx-auto grid max-w-[1080px] list-none gap-1 px-5 py-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={fechar}
                  className={classeLink}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
