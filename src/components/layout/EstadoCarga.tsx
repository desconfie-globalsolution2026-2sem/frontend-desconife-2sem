import Button from '../button/Button'

interface Props {
  carregando: boolean
  erro: string
  recarregar: () => void
  texto?: string
}

/* "Carregando…" ou o erro com "tentar de novo". Some quando os dados chegam. */
export default function EstadoCarga({ carregando, erro, recarregar, texto = 'Carregando…' }: Props) {
  if (carregando) {
    return (
      <p role="status" className="rounded-2xl bg-surface p-5 text-muted">
        {texto}
      </p>
    )
  }

  if (erro) {
    return (
      <div role="alert" className="grid justify-items-start gap-3 rounded-2xl bg-danger-bg p-5">
        <p className="text-ink">
          <strong className="text-danger">Deu erro.</strong> {erro}
        </p>
        <Button type="button" onClick={recarregar}>
          Tentar de novo
        </Button>
      </div>
    )
  }

  return null
}
