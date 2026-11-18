/* Mensagem de erro de um campo. Fica vazia (null) quando o campo esta certo,
   para o aria-describedby do input nunca apontar para um elemento inexistente. */
export default function MsgErro({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null
  return (
    <span id={id} className="text-[.92rem] font-medium text-danger">
      {texto}
    </span>
  )
}
