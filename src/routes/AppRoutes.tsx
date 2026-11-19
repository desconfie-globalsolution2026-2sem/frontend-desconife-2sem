import { Routes, Route } from "react-router-dom";
import Layout from '../components/layout/Layout.tsx';
import Analisar from '../pages/Analisar/Analisar.tsx';
import Cadastro from '../pages/Cadastro/Cadastro.tsx';
import Circulo from '../pages/Circulo/Circulo.tsx';
import Contato from '../pages/Contato/Contato.tsx';
import DetalheAnalise from '../pages/DetalheAnalise/DetalheAnalise.tsx';
import NaoEncontrada from '../pages/NaoEncontrada/NaoEncontrada.tsx';
import Entrar from '../pages/Entrar/Entrar.tsx';
import FAQ from '../pages/FAQ/FAQ.tsx';
import Home from '../pages/Home/Home.tsx';
import MinhasAnalises from '../pages/MinhasAnalises/MinhasAnalises.tsx';
import QuemSomos from '../pages/QuemSomos/QuemSomos.tsx';
import Sobre from '../pages/Sobre/Sobre.tsx';

export default function AppRoutes() {
  return (
    <Routes>
        <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/quem-somos" element={<QuemSomos />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/entrar" element={<Entrar />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/analisar" element={<Analisar />} />
            <Route path="/minhas-analises" element={<MinhasAnalises />} />
            <Route path="/circulo" element={<Circulo />} />
            <Route path="/analises/:id" element={<DetalheAnalise />} />
            <Route path="*" element={<NaoEncontrada />} />
        </Route>
    </Routes>
  )
}
