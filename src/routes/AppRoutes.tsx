import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Analisar from '../pages/Analisar/Analisar'
import Cadastro from '../pages/Cadastro/Cadastro'
import Circulo from '../pages/Circulo/Circulo'
import Contato from '../pages/Contato/Contato'
import DetalheAnalise from '../pages/DetalheAnalise/DetalheAnalise'
import Entrar from '../pages/Entrar/Entrar'
import FAQ from '../pages/FAQ/FAQ'
import Home from '../pages/Home/Home'
import Integrantes from '../pages/Integrantes/Integrantes'
import MinhaConta from '../pages/MinhaConta/MinhaConta'
import MinhasAnalises from '../pages/MinhasAnalises/MinhasAnalises'
import NaoEncontrada from '../pages/NaoEncontrada/NaoEncontrada'
import Sobre from '../pages/Sobre/Sobre'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/integrantes" element={<Integrantes />} />
        <Route path="/quem-somos" element={<Navigate to="/integrantes" replace />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/analisar" element={<Analisar />} />
        <Route path="/minhas-analises" element={<MinhasAnalises />} />
        <Route path="/circulo" element={<Circulo />} />
        <Route path="/minha-conta" element={<MinhaConta />} />
        <Route path="/analises/:id" element={<DetalheAnalise />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}
