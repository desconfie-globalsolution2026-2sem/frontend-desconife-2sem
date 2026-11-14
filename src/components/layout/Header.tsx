import { NavLink } from 'react-router-dom'
import Logo from '../../assets/desconfie-logo.svg'

const navItems = [
  { path: '/', label: 'Início' },
  { path: '/quem-somos', label: 'Quem somos' },
  { path: '/sobre', label: 'Sobre' },
  { path: '/faq', label: 'Perguntas' },
  { path: '/contato', label: 'Contato' },
]

export default function Header() {
  return (
    <header className="glass sticky top-0 z-20 border-b border-black/10 bg-white/82 backdrop-blur-xl backdrop-saturate-[1.8]">
      <div className="mx-auto flex min-h-16 max-w-[1080px] flex-wrap items-center justify-between gap-4 px-5">
        <NavLink to="/" aria-label="Desconfie, ir para o início" className="flex items-center">
          <img src={Logo} alt="" className="h-10 w-auto" />
        </NavLink>

        <nav aria-label="Principal">
          <ul className="flex list-none flex-wrap gap-0.5 p-0">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    [
                      'flex min-h-11 items-center rounded-full px-3.5 text-[.98rem] no-underline transition-colors',
                      isActive
                        ? 'bg-surface font-semibold text-navy'
                        : 'font-medium text-muted hover:bg-surface hover:text-navy',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}

            <li>
              <NavLink
                to="/entrar"
                className="ml-2 flex min-h-11 items-center rounded-full bg-navy px-4.5 text-[.98rem] font-medium text-white no-underline transition-colors hover:bg-[#163a60]"
              >
                Entrar
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
