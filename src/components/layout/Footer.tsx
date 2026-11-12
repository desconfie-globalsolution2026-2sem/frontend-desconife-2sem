import { Link } from 'react-router-dom'
import Logo from '../../assets/favicon.svg'

const links = [
  { path: '/quem-somos', label: 'Quem somos' },
  { path: '/sobre', label: 'Sobre' },
  { path: '/faq', label: 'Perguntas' },
  { path: '/contato', label: 'Contato' },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface py-9 text-[.92rem] text-muted">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-5 px-5">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-navy no-underline"
          aria-label="Desconfie, ir para o início"
        >
          <img src={Logo} alt="" className="size-9 shrink-0" />
          <span className="text-[1.45rem] font-extrabold leading-none tracking-[-0.045em]">
            desconfie
          </span>
        </Link>

        <nav className="flex flex-wrap gap-5" aria-label="Rodapé">
          {links.map((l) => (
            <Link key={l.path} to={l.path} className="text-ink no-underline hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>

        <p className="w-full text-[.88rem]">
          Projeto acadêmico · Global Solution 2026/2 · FIAP 1TDS. Na dúvida, desconfie e confirme
          pelo canal oficial.
        </p>
      </div>
    </footer>
  )
}
