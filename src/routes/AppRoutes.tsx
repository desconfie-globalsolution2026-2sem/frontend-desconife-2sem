import { Routes, Route } from "react-router-dom";
import Layout from '../components/layout/Layout.tsx';
import Contato from '../pages/Contato/Contato.tsx';
import Home from '../pages/Home/Home.tsx';

function Pagina({ titulo }: { titulo: string }) {
  return <main style={{ padding: '24px' }}><h1>{titulo}</h1></main>
}

export default function AppRoutes() {
  return (
    <Routes>
        <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/quem-somos" element={<Pagina titulo="Quem Somos" />} />
            <Route path="/sobre" element={<Pagina titulo="Sobre" />} />
            <Route path="/faq" element={<Pagina titulo="FAQ" />} />
            <Route path="/contato" element={<Contato />} />
        </Route>
    </Routes>
  )
}
