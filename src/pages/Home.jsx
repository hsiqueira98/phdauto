import Hero from '@/components/home/Hero';
import Manifesto from '@/components/home/Manifesto';
import Universes from '@/components/home/Universes';
import Collection from '@/components/home/Collection';
import DriveModeTeaser from '@/components/home/DriveModeTeaser';
import SmartFind from '@/components/home/SmartFind';
import SellYourCar from '@/components/home/SellYourCar';
import Timeline from '@/components/home/Timeline';
import Showroom from '@/components/home/Showroom';
import FinalCta from '@/components/home/FinalCta';

/**
 * Sequência da experiência:
 * Abertura → Manifesto → Universos → A coleção → Modo imersivo →
 * Encontrar meu carro → Vender → História → Showroom → Chamada final
 */
export default function Home({ onAbrirModoImersivo }) {
  return (
    <main id="conteudo">
      <Hero onAbrirModoImersivo={onAbrirModoImersivo} />
      <Manifesto />
      <Universes />
      <Collection />
      <DriveModeTeaser onAbrir={onAbrirModoImersivo} />
      <SmartFind />
      <SellYourCar />
      <Timeline />
      <Showroom />
      <FinalCta onAbrirModoImersivo={onAbrirModoImersivo} />
    </main>
  );
}
