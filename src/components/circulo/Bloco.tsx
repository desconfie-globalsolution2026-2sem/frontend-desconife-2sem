import type { ReactNode } from 'react'

interface Props {
  titulo: string
  texto: string
  /* Algo ao lado do titulo, como o contador de alertas. */
  extra?: ReactNode
  children: ReactNode
}

/* Moldura de cada parte da tela do circulo: titulo, explicacao curta e conteudo. */
export default function Bloco({ titulo, texto, extra, children }: Props) {
  return (
    <section className="grid content-start gap-4 rounded-[28px] bg-surface p-6 md:p-7">
      <div className="grid gap-1">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-[1.4rem] font-semibold">{titulo}</h2>
          {extra}
        </div>
        <p className="max-w-[60ch] text-[.98rem] text-muted">{texto}</p>
      </div>
      {children}
    </section>
  )
}
