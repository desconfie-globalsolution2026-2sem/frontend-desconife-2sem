import { useState } from 'react'

interface Props {
  id: string
  name: string
  label: string
  autoComplete: string
  dica?: string
  erro?: string
  /* Avisa o pai a cada tecla, para a barra de forca do cadastro */
  onChange?: (valor: string) => void
}

export default function CampoSenha({
  id,
  name,
  label,
  autoComplete,
  dica,
  erro,
  onChange,
}: Props) {
  const [visivel, setVisivel] = useState(false)
  const idDica = `${id}-dica`

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="font-semibold text-navy">
        {label}
      </label>

      {dica && (
        <span id={idDica} className="text-[.9rem] text-muted">
          {dica}
        </span>
      )}

      <div className="relative">
        <input
          id={id}
          name={name}
          type={visivel ? 'text' : 'password'}
          autoComplete={autoComplete}
          aria-invalid={!!erro}
          aria-describedby={dica ? idDica : undefined}
          onChange={(e) => onChange?.(e.target.value)}
          className={[
            'min-h-[50px] w-full rounded-xl border bg-white py-3 pr-24 pl-4 text-[1.05rem] text-ink',
            erro ? 'border-danger' : 'border-line',
          ].join(' ')}
        />
        <button
          type="button"
          onClick={() => setVisivel(!visivel)}
          aria-controls={id}
          aria-pressed={visivel}
          className="absolute top-1/2 right-1.5 min-h-10 -translate-y-1/2 rounded-[10px] px-3.5 text-[.95rem] font-semibold text-navy hover:bg-surface-2"
        >
          {visivel ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      {erro && <span className="text-[.92rem] font-medium text-danger">{erro}</span>}
    </div>
  )
}
