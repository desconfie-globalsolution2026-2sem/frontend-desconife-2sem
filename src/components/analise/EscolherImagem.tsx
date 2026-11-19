import type { ChangeEvent } from 'react'

interface Props {
  imagem: { nome: string; dataUrl: string } | null
  invalido: boolean
  aoEscolher: (evento: ChangeEvent<HTMLInputElement>) => void
}

/* Area de clique para escolher o print. O input fica escondido; o label e o alvo. */
export default function EscolherImagem({ imagem, invalido, aoEscolher }: Props) {
  return (
    <label
      htmlFor="imagem"
      className={[
        'flex min-h-[92px] w-full cursor-pointer items-center gap-4 rounded-2xl border border-dashed bg-white px-4 py-3 text-ink',
        invalido ? 'border-danger' : 'border-line',
      ].join(' ')}
    >
      <input
        id="imagem"
        type="file"
        accept="image/png,image/jpeg"
        onChange={aoEscolher}
        aria-invalid={invalido}
        aria-describedby={invalido ? 'erro-mensagem' : undefined}
        className="sr-only"
      />
      {imagem && <img src={imagem.dataUrl} alt="" className="size-16 rounded-lg object-cover" />}
      <span>
        <span className="font-medium text-navy">{imagem ? imagem.nome : 'Escolher print da mensagem'}</span>
        <span className="block text-[.9rem] text-muted">
          {imagem ? 'Clique para trocar' : 'PNG ou JPG, até 2 MB'}
        </span>
      </span>
    </label>
  )
}
