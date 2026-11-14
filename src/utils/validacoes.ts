/*
 * Regras de validacao compartilhadas pelos formularios.
 *
 * Sao funcoes puras: recebem valor e devolvem valor, sem estado nenhum. Por
 * isso ficam aqui e nao em hooks/ — hook e para logica que usa estado do React.
 */

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* As mensagens que aparecem em mais de um formulario ficam juntas, para o texto
   nao divergir de uma pagina para outra. */
export const mensagens = {
  nome: 'Escreva seu nome.',
  email: 'Esse e-mail parece incompleto. Confira se tem @ e um ponto depois.',
  senhaCurta: 'A senha tem pelo menos 6 caracteres.',
  senhaFraca: 'A senha precisa de pelo menos 8 caracteres, com letras e números.',
  senhasDiferentes: 'As duas senhas estão diferentes.',
}

export function emailValido(email: string) {
  return REGEX_EMAIL.test(email)
}

/* Le um campo de texto do formulario ja sem espaco sobrando nas pontas. */
export function textoDe(dados: FormData, campo: string) {
  return String(dados.get(campo) ?? '').trim()
}

/* Senha nao leva trim: espaco no inicio ou no fim faz parte da senha. */
export function senhaDe(dados: FormData, campo: string) {
  return String(dados.get(campo) ?? '')
}

/* Checkbox desmarcado nao vai no FormData, por isso o teste e contra null. */
export function marcado(dados: FormData, campo: string) {
  return dados.get(campo) !== null
}

/* Forca da senha para a barra do cadastro. 0 = vazia, 1 = fraca, 2 = media, 3 = boa. */
export function nivelSenha(valor: string) {
  if (valor === '') return 0
  let n = 0
  if (valor.length >= 8) n++
  if (/[a-zA-Z]/.test(valor) && /\d/.test(valor)) n++
  if (valor.length >= 12 || /[^a-zA-Z0-9]/.test(valor)) n++
  return Math.max(1, n)
}
