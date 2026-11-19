import { BrowserRouter } from 'react-router-dom'
import SessaoProvider from './context/SessaoProvider.tsx'
import AppRoutes from './routes/AppRoutes.tsx'

export default function App() {
  return (
    <SessaoProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SessaoProvider>
  )
}
