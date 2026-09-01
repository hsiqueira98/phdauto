import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { ScrollTrigger } from '@/lib/gsap';
import SmoothScroll, { useLenis } from '@/components/layout/SmoothScroll';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Cursor from '@/components/layout/Cursor';
import ScrollProgress from '@/components/layout/ScrollProgress';
import Preloader from '@/components/layout/Preloader';
import DriveMode from '@/components/drivemode/DriveMode';
import Home from '@/pages/Home';
import Catalog from '@/pages/Catalog';
import Vehicle from '@/pages/Vehicle';
import Sell from '@/pages/Sell';
import Financing from '@/pages/Financing';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';

/**
 * Ao trocar de rota: topo da página e recalculo das medidas do ScrollTrigger.
 * Sem isso, seções pinadas herdam offsets da rota anterior.
 */
function RouteEffects() {
  const location = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);

    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [location.pathname, lenis]);

  return null;
}

function Shell() {
  const [loading, setLoading] = useState(true);
  const [driveMode, setDriveMode] = useState(false);
  const location = useLocation();

  const abrirModoImersivo = () => setDriveMode(true);
  const fecharModoImersivo = () => setDriveMode(false);

  // Após o preloader, as medidas mudam — recalcula uma vez.
  useEffect(() => {
    if (!loading) {
      const id = setTimeout(() => ScrollTrigger.refresh(), 120);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [loading]);

  return (
    <>
      <AnimatePresence>{loading && <Preloader onDone={() => setLoading(false)} />}</AnimatePresence>

      <ScrollProgress />
      <Cursor />
      <RouteEffects />

      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <Header onOpenDriveMode={abrirModoImersivo} />

      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home onAbrirModoImersivo={abrirModoImersivo} />} />
        <Route path="/colecao" element={<Catalog />} />
        <Route path="/veiculo/:slug" element={<Vehicle />} />
        <Route path="/vender" element={<Sell />} />
        <Route path="/financiamento" element={<Financing />} />
        <Route path="/phd" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />

      <DriveMode open={driveMode} onClose={fecharModoImersivo} />
    </>
  );
}

export default function App() {
  return (
    <SmoothScroll>
      <Shell />
    </SmoothScroll>
  );
}
