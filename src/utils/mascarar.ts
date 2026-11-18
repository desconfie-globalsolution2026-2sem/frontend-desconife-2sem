/*
 * Mascara dado pessoal antes de a mensagem sair do navegador.
 *
 * A API tambem mascara, mas quem cola o texto costuma colar o proprio CPF junto.
 * Tirar aqui evita mandar o dado para a rede uma vez sequer.
 */

const REGRAS: [RegExp, string][] = [
  /* Cartao: 13 a 16 digitos, aceitando espaco ou hifen entre eles. */
  [/\b(?:\d[ -]?){13,16}\b/g, '[cartão]'],
  /* CPF com ou sem pontuacao. */
  [/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, '[CPF]'],
  [/\b[^\s@]+@[^\s@]+\.[^\s@]+\b/g, '[e-mail]'],
  /* Telefone brasileiro, com DDD e nono digito opcionais. */
  [/(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}\b/g, '[telefone]'],
]

export function mascararDados(texto: string) {
  return REGRAS.reduce((acc, [regex, troca]) => acc.replace(regex, troca), texto)
}
