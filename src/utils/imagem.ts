/*
 * Print da mensagem enviado para analise. A API le o texto da imagem (OCR),
 * que so aceita PNG e JPEG, e recebe o arquivo em base64 com no maximo ~2 MB.
 */

const FORMATOS = ['image/png', 'image/jpeg']
const MAX_MB = 2

/* Devolve o motivo de recusa, ou undefined se a imagem pode ser enviada. */
export function problemaNaImagem(arquivo: File) {
  if (!FORMATOS.includes(arquivo.type)) return 'Envie um print em PNG ou JPG.'
  if (arquivo.size > MAX_MB * 1024 * 1024) return `A imagem passou de ${MAX_MB} MB. Corte só a parte da mensagem.`
  return undefined
}

/* Arquivo -> "data:image/png;base64,...", que serve de preview na tela. */
export function lerImagem(arquivo: File): Promise<string> {
  return new Promise((resolver, rejeitar) => {
    const leitor = new FileReader()
    leitor.onload = () => resolver(String(leitor.result))
    leitor.onerror = () => rejeitar(leitor.error)
    leitor.readAsDataURL(arquivo)
  })
}

/* A API quer so o base64, sem o prefixo "data:...;base64,". */
export function base64De(dataUrl: string) {
  return dataUrl.slice(dataUrl.indexOf(',') + 1)
}
