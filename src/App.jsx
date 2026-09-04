import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { ScrollTrigger } from '@/lib/gsap';
import SmoothScroll, { useLenis } from '@/components/layout/SmoothScroll';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollProgress from '@/components/layout/ScrollProgress';
import DriveMode from '@/components/drivemode/DriveMode';
import Home from '@/pages/Home';
import Catalog from '@/pages/Catalog';
import Vehicle from '@/pages/Vehicle';
import Sell from '@/pages/Sell';
import Financing from '@/pages/Financing';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';

function RouteEffects() {
  const { pathname } = useLocation();
  const lenis = useLenis();
  const scroll = useRef(lenis);
  scroll.current = lenis;
  useEffect(() => {
    if (scroll.current) scroll.current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    let cancelled = false;
    let frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    document.fonts?.ready.then(() => {
      if (!cancelled) { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => ScrollTrigger.refresh()); }
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [pathname]);
  return null;
}
function Shell() {
  const [driveMode, setDriveMode] = useState(false);
  return <>
    <ScrollProgress /><RouteEffects />
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <Header onOpenDriveMode={() => setDriveMode(true)} />
    <Routes>
      <Route path="/" element={<Home onAbrirModoImersivo={() => setDriveMode(true)} />} />
      <Route path="/colecao" element={<Catalog />} />
      <Route path="/veiculo/:slug" element={<Vehicle />} />
      <Route path="/vender" element={<Sell />} />
      <Route path="/financiamento" element={<Financing />} />
      <Route path="/polly" element={<About />} />
      <Route path="/phd" element={<Navigate to="/polly" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer /><DriveMode open={driveMode} onClose={() => setDriveMode(false)} />
  </>;
}
export default function App() {
  return <MotionConfig reducedMotion="user"><SmoothScroll><Shell /></SmoothScroll></MotionConfig>;
}
