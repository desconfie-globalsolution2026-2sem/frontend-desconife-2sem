/* /health: confere se a API esta no ar (o Render "acorda" o servico na primeira chamada). */
import { get } from '../api'

export const verificarSaude = () => get<Record<string, string>>('/health')
