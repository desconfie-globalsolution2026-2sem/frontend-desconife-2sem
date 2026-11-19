import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { verificarSaude } from './services/endpoints/health'
import SessaoProvider from './context/SessaoProvider'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  /*
   * A API e a IA rodam no plano gratis do Render e "dormem" sem uso. Chamar o
   * /health assim que o site abre ja comeca a acordar o servidor, para a
   * primeira analise nao ficar esperando. O resultado nao importa: se falhar,
   * a tela de analise mostra o erro normalmente.
   */
  useEffect(() => {
    verificarSaude().catch(() => {})
  }, [])

  return (
    <SessaoProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SessaoProvider>
  )
}
