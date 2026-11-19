/* /padroes: termos e sinais que o motor de regras procura nas mensagens (mostrados na Home). */
import type { PadraoResponse } from '../../types/Api/dtos'
import { get } from '../api'

export const listarPadroes = () => get<PadraoResponse[]>('/padroes')
