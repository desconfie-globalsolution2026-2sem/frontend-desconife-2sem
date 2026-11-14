import type { ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router-dom'

const base =
  'inline-flex min-h-[50px] items-center justify-center rounded-full px-[26px] text-[1.05rem] font-semibold no-underline transition-colors'

const variantes = {
  primario: 'bg-navy text-white hover:bg-[#163a60]',
  secundario: 'text-navy hover:bg-surface-2',
}

interface Props extends ComponentPropsWithoutRef<'button'> {
  variante?: keyof typeof variantes
  /** Se passado, o botão vira um link de rota. */
  to?: string
}

export default function Button({ variante = 'primario', to, className = '', ...props }: Props) {
  const classes = `${base} ${variantes[variante]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {props.children}
      </Link>
    )
  }

  return <button {...props} className={classes} />
}
