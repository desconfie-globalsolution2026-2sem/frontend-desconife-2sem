import Button from '../../components/button/Button'

/* Qualquer endereco que nao bate com uma rota cai aqui. */
export default function NaoEncontrada() {
  return (
    <main className="mx-auto grid max-w-[1080px] justify-items-start gap-5 px-5 pt-18 pb-24">
      <p className="font-mono text-[.95rem] font-semibold text-amber-text">Erro 404</p>
      <h1 className="max-w-[20ch] text-[clamp(2.4rem,5.4vw,4rem)] font-bold">
        Essa página não existe
      </h1>
      <p className="max-w-[52ch] text-[clamp(1.1rem,1.6vw,1.25rem)] text-muted">
        O endereço pode estar errado ou a página mudou de lugar. E se alguém mandou esse link por
        mensagem, desconfie.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button to="/">Voltar ao início</Button>
        <Button to="/analisar" variante="secundario">
          Analisar uma mensagem
        </Button>
      </div>
    </main>
  )
}
