/* Classe do input, com a borda mudando quando o campo tem erro. */
export function classeCampo(temErro: boolean) {
  return [
    'min-h-[50px] w-full rounded-xl border bg-white px-4 py-3 text-[1.05rem] text-ink',
    temErro ? 'border-danger' : 'border-line',
  ].join(' ')
}
