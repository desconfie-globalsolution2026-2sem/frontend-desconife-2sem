import Button from '../button/Button'

/* Aviso das telas que precisam do usuario: a API guarda cada analise no id de quem mandou. */
export default function PedirLogin({ texto }: { texto: string }) {
  return (
    <div className="grid justify-items-start gap-4 rounded-[28px] border border-line p-7">
      <h2 className="text-[1.4rem] font-semibold">Entre na sua conta</h2>
      <p className="max-w-[52ch] text-muted">{texto}</p>
      <div className="flex flex-wrap gap-2">
        <Button to="/entrar">Entrar</Button>
        <Button to="/cadastro" variante="secundario">
          Criar conta
        </Button>
      </div>
    </div>
  )
}
