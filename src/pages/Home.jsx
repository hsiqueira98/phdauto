import Hero from '@/components/home/Hero';
import Manifesto from '@/components/home/Manifesto';
import Universes from '@/components/home/Universes';
import Collection from '@/components/home/Collection';
import DriveModeTeaser from '@/components/home/DriveModeTeaser';
import SmartFind from '@/components/home/SmartFind';
import SellYourCar from '@/components/home/SellYourCar';
import NextChapter from '@/components/home/NextChapter';
import Showroom from '@/components/home/Showroom';
import FinalCta from '@/components/home/FinalCta';
export default function Home({ onAbrirModoImersivo }) {
  return <main id="conteudo"><Hero onAbrirModoImersivo={onAbrirModoImersivo} /><Manifesto /><Universes /><Collection /><DriveModeTeaser onAbrir={onAbrirModoImersivo} /><SmartFind /><SellYourCar /><NextChapter /><Showroom /><FinalCta onAbrirModoImersivo={onAbrirModoImersivo} /></main>;
}
