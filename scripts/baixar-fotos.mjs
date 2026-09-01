/**
 * BAIXAR FOTOS — PHD Automóveis
 *
 * Busca no Wikimedia Commons fotografias reais dos modelos do estoque
 * mockado e salva em public/imagens/veiculos/.
 *
 * Por que Commons: é a fonte aberta, sem chave de API, que tem foto do
 * modelo certo (Golf GTI, Duster, Compass...). Banco de imagem genérico
 * mostraria "um SUV qualquer" — numa apresentação para a PHD isso salta
 * aos olhos.
 *
 * A busca do Commons casa por relevância frouxa: pesquisar "Volkswagen
 * Polo" devolve carro de rallycross. Por isso cada alvo declara `exigir`:
 * termos que PRECISAM estar no nome do arquivo. Sem isso o estoque enche
 * de carro errado.
 *
 * Estas imagens são PLACEHOLDER. Na produção dão lugar ao acervo
 * fotografado no showroom (PHD Photo Standard).
 *
 * Uso:
 *   node scripts/baixar-fotos.mjs --simular     # só lista o que escolheria
 *   node scripts/baixar-fotos.mjs               # baixa tudo
 *   node scripts/baixar-fotos.mjs <slug>        # atualiza um veículo só
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'PHD-Drive-Gallery-Prototype/1.0 (prototipo de apresentacao)';
const OUT = path.resolve('public/imagens/veiculos');
const LARGURA = 1400;
const POR_VEICULO = 4;

const ALVOS = [
  { slug: 'volkswagen-golf-gti-2005', ano: 2006, exigir: ['golf'], evitar: ['variant', 'plus', 'sportsvan', 'cabriolet', 'estate'], buscas: ['Volkswagen Golf GTI Mk5', 'Volkswagen Golf V GTI', 'Volkswagen Golf GTI'] },
  { slug: 'volkswagen-nivus-2021', ano: 2021, exigir: ['nivus', 'taigo'], buscas: ['Volkswagen Nivus', 'Volkswagen Taigo'] },
  { slug: 'honda-city-2019', ano: 2018, exigir: ['city'], buscas: ['Honda City 2017', 'Honda City sedan', 'Honda City GM6'] },
  { slug: 'mercedes-benz-gla-200-2016', ano: 2016, exigir: ['gla'], buscas: ['Mercedes-Benz GLA X156', 'Mercedes-Benz GLA'] },
  { slug: 'renault-duster-2021', ano: 2019, exigir: ['duster'], buscas: ['Dacia Duster 2018', 'Renault Duster'] },
  { slug: 'fiat-argo-2022', ano: 2020, exigir: ['argo'], buscas: ['Fiat Argo'] },
  { slug: 'fiat-500-2013', ano: 2012, exigir: ['500'], buscas: ['Fiat 500 2007', 'Fiat Nuova 500'] },
  { slug: 'jeep-compass-2020', ano: 2019, exigir: ['compass'], buscas: ['Jeep Compass MP', 'Jeep Compass'] },
  { slug: 'toyota-corolla-2020', ano: 2020, exigir: ['corolla'], evitar: ['cross', 'trek', 'touring', 'wagon', 'hatchback', 'verso'], buscas: ['Toyota Corolla Altis', 'Toyota Corolla 2020', 'Toyota Corolla E210'] },
  { slug: 'volkswagen-amarok-2019', ano: 2018, exigir: ['amarok'], buscas: ['Volkswagen Amarok V6', 'Volkswagen Amarok'] },
  { slug: 'hyundai-hb20-2021', ano: 2020, exigir: ['hb20'], buscas: ['Hyundai HB20'] },
  { slug: 'chevrolet-onix-2022', ano: 2021, exigir: ['onix'], buscas: ['Chevrolet Onix', 'Chevrolet Onix Plus'] },
  { slug: 'bmw-320i-2018', ano: 2017, exigir: ['320', '3 series', '3er', 'f30'], buscas: ['BMW F30 320i', 'BMW 3 Series F30'] },
  { slug: 'ford-ranger-2019', ano: 2018, exigir: ['ranger'], buscas: ['Ford Ranger T6', 'Ford Ranger Wildtrak'] },
  { slug: 'volkswagen-polo-2020', ano: 2019, exigir: ['polo'], buscas: ['Volkswagen Polo Mk6', 'Volkswagen Polo 2018', 'Volkswagen Polo AW'] },
  { slug: 'audi-a3-sedan-2017', ano: 2016, exigir: ['a3'], buscas: ['Audi A3 Sedan 8V', 'Audi A3 Limousine', 'Audi A3 8V'] },
  { slug: 'peugeot-208-2021', ano: 2020, exigir: ['208'], buscas: ['Peugeot 208 II', 'Peugeot 208 2020'] },
  { slug: 'jeep-renegade-2019', ano: 2018, exigir: ['renegade'], buscas: ['Jeep Renegade'] },
  { slug: 'honda-civic-2018', ano: 2017, exigir: ['civic'], evitar: ['type r', 'hatchback', 'coupe', 'si '], buscas: ['Honda Civic X sedan', 'Honda Civic 2016 sedan', 'Honda Civic FC'] },
  { slug: 'volkswagen-saveiro-2020', ano: 2019, exigir: ['saveiro'], buscas: ['Volkswagen Saveiro'] },
  { slug: 'fiat-toro-2021', ano: 2020, exigir: ['toro'], buscas: ['Fiat Toro'] },
  { slug: 'mini-cooper-s-2015', ano: 2016, exigir: ['mini'], evitar: ['countryman', 'clubman', 'paceman', 'electric', 'minivan'], buscas: ['Mini Hatch F56', 'Mini Cooper S F56'] },
  { slug: 'volkswagen-jetta-gli-2019', ano: 2019, exigir: ['jetta'], buscas: ['Volkswagen Jetta A7', 'Volkswagen Jetta 2019'] },
  { slug: 'nissan-kicks-2020', ano: 2019, exigir: ['kicks'], buscas: ['Nissan Kicks'] },
];

/* Fora: interior, detalhe, acidente, competição — queremos o carro inteiro. */
const VETADO = [
  'interior', 'dashboard', 'cockpit', 'engine', 'seat', 'boot', 'trunk',
  'badge', 'emblem', 'logo', 'wheel', 'headlamp', 'headlight', 'taillight', 'tail light',
  'rear light', 'grille', 'detail', 'crash', 'accident', 'damaged', 'wreck', 'burn',
  'rally', 'race', 'racing', 'circuit', 'police', 'polizei', 'taxi', 'ambulan',
  'fire brigade', 'army', 'military', 'toy', 'model car', 'miniature', 'diagram',
  'drawing', 'blueprint', 'assembly', 'factory', 'production line', 'chassis',
  'gearbox', 'suspension', 'junk', 'scrap', 'rust', 'cutaway', 'testing',
  'concept', 'prototype', 'camouflage', 'spy',
];

/* Fotógrafos automotivos do Commons com enquadramento consistente:
   carro inteiro, 3/4 dianteiro, fundo limpo. É o que mais aproxima o
   acervo emprestado do padrão que a PHD vai fotografar. */
const AUTORES_BONS = [
  'vauxford', 'alexander migl', 'charles01', 'kickaffe', 'thomas doerfer',
  'eurovisionnim', 'mr.choppers', 'dave_7', 'rutger van der maar',
  'matti blume', 'damian b hall', 'jengtingchen', 'navigator84',
];

/* Cenas candid: rua, evento, balsa. Boa foto, mas quebra a unidade do acervo. */
const CENA_RUIM = /(ferry|boat|street|traffic|parade|meeting|snow|flood|junkyard)/;

/* Casa por palavra inteira: 'toy' não pode vetar "Toyota", nem
   'race' vetar "Terrace". Foi exatamente esse bug que zerou a Toyota. */
const VETADO_RE = new RegExp(`\\b(${VETADO.join('|').replace(/[.*+?^${}()[\]\\]/g, '\\$&')})\\b`);
const vetado = (chave) => VETADO_RE.test(chave);

const normalizar = (s) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/** Commons responde 429 em rajada — espaçamos e tentamos de novo. */
async function comRetry(url, tentativas = 5) {
  for (let i = 0; i < tentativas; i += 1) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.ok) return res;
    if (res.status !== 429 && res.status < 500) throw new Error(`HTTP ${res.status}`);
    await dormir(2500 * 2 ** i);
  }
  throw new Error('esgotou as tentativas (429)');
}

async function consulta(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`;
  const res = await comRetry(url);
  await dormir(900);
  return res.json();
}

async function buscar(termo, exigir, anoAlvo, evitar = []) {
  const dados = await consulta({
    action: 'query',
    generator: 'search',
    gsrsearch: termo,
    gsrnamespace: '6',
    gsrlimit: '40',
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: String(LARGURA),
  });

  const paginas = dados?.query?.pages;
  if (!paginas) return [];

  return Object.values(paginas)
    .map((p) => {
      const info = p.imageinfo?.[0];
      if (!info) return null;

      const nome = p.title.replace(/^File:/, '');
      const chave = normalizar(nome);
      const proporcao = info.width / info.height;

      if (!/\.jpe?g$/i.test(nome)) return null;
      // O filtro que importa: o arquivo tem de ser DESTE modelo.
      if (!exigir.some((termoExigido) => chave.includes(termoExigido))) return null;
      if (vetado(chave)) return null;
      if (evitar.some((e) => chave.includes(e))) return null;
      if (info.width < 1100) return null;
      if (proporcao < 1.2 || proporcao > 2.1) return null;

      const meta = info.extmetadata ?? {};
      const limpar = (v) => String(v ?? '').replace(/<[^>]*>/g, '').trim();
      const autor = limpar(meta.Artist?.value) || 'Wikimedia Commons';

      /* Geração certa: um Polo 1991 não representa um Polo 2020.
         Quando o arquivo declara o ano, ele é eliminatório — não só
         penalizado. Foto de outra geração é, para quem olha a
         vitrine, simplesmente outro carro. */
      const anoArquivo = Number((nome.match(/\b(19|20)\d{2}\b/) || [])[0]);
      if (anoArquivo && Math.abs(anoArquivo - anoAlvo) > 7) return null;

      let nota = 0;
      if (proporcao > 1.3 && proporcao < 1.68) nota += 3;
      if (info.width >= 2000) nota += 2;
      if (/\b(front|side|profile|quarter)\b/.test(chave)) nota += 2;
      if (/\b(rear|back)\b/.test(chave)) nota -= 2;
      if (anoArquivo && Math.abs(anoArquivo - anoAlvo) <= 3) nota += 8;
      // "2019 Volkswagen Polo SE 1.0 Front.jpg" — convenção de foto de catálogo
      if (/^(19|20)\d{2}\s/.test(nome)) nota += 5;
      if (AUTORES_BONS.some((a) => normalizar(autor).includes(a))) nota += 6;
      // Importação do Flickr (número longo entre parênteses) costuma ser candid
      if (/\(\d{8,}\)/.test(nome)) nota -= 5;
      if (CENA_RUIM.test(chave)) nota -= 4;

      return {
        nome,
        nota,
        url: info.thumburl ?? info.url,
        largura: info.width,
        altura: info.height,
        autor,
        licenca: limpar(meta.LicenseShortName?.value) || 'ver página do arquivo',
        pagina: info.descriptionurl,
      };
    })
    .filter(Boolean);
}

async function baixar(url, destino) {
  const res = await comRetry(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 12000) throw new Error('arquivo pequeno demais');
  await fs.writeFile(destino, buffer);
  await dormir(250);
  return buffer.length;
}

async function escolher(alvo) {
  const candidatos = [];
  for (const termo of alvo.buscas) {
    try {
      candidatos.push(...(await buscar(termo, alvo.exigir, alvo.ano, alvo.evitar)));
    } catch (erro) {
      console.warn(`  ! busca "${termo}": ${erro.message}`);
    }
  }

  const vistos = new Set();
  return candidatos
    .filter((c) => {
      if (vistos.has(c.nome)) return false;
      vistos.add(c.nome);
      return true;
    })
    .sort((a, b) => b.nota - a.nota)
    .slice(0, POR_VEICULO);
}

async function main() {
  const args = process.argv.slice(2);
  const simular = args.includes('--simular');
  const filtro = args.find((a) => !a.startsWith('--'));
  const lista = filtro ? ALVOS.filter((a) => a.slug === filtro) : ALVOS;

  if (simular) {
    for (const alvo of lista) {
      const escolhidos = await escolher(alvo);
      console.log(`\n${alvo.slug}  (${escolhidos.length})`);
      escolhidos.forEach((c) => console.log(`   ${String(c.nota).padStart(3)}  ${c.nome.slice(0, 76)}`));
      if (!escolhidos.length) console.log('   NENHUMA — revisar buscas/exigir');
    }
    return;
  }

  await fs.mkdir(OUT, { recursive: true });

  const ler = async (arquivo, padrao) => {
    try {
      return JSON.parse(await fs.readFile(path.resolve(arquivo), 'utf8'));
    } catch {
      return padrao;
    }
  };

  // Mescla com o que já existe: rodar com filtro atualiza um veículo
  // sem descartar o manifesto e os créditos dos demais.
  const manifesto = await ler('src/data/fotos.json', {});
  const creditos = await ler('public/imagens/creditos.json', []);

  let total = 0;
  let bytes = 0;

  for (const alvo of lista) {
    const escolhidos = await escolher(alvo);
    const salvos = [];

    for (let i = creditos.length - 1; i >= 0; i -= 1) {
      if (creditos[i].arquivo.startsWith(`${alvo.slug}-`)) creditos.splice(i, 1);
    }

    for (const [i, foto] of escolhidos.entries()) {
      const arquivo = `${alvo.slug}-${String(i + 1).padStart(2, '0')}.jpg`;
      try {
        bytes += await baixar(foto.url, path.join(OUT, arquivo));
        salvos.push(`/imagens/veiculos/${arquivo}`);
        creditos.push({
          arquivo,
          nome: foto.nome,
          autor: foto.autor,
          licenca: foto.licenca,
          pagina: foto.pagina,
        });
        total += 1;
      } catch (erro) {
        console.warn(`  ! ${arquivo}: ${erro.message}`);
      }
    }

    manifesto[alvo.slug] = salvos;
    console.log(`${salvos.length ? '✓' : '✗'} ${alvo.slug.padEnd(34)} ${salvos.length} foto(s)`);
  }

  creditos.sort((a, b) => a.arquivo.localeCompare(b.arquivo));

  await fs.writeFile(path.resolve('src/data/fotos.json'), `${JSON.stringify(manifesto, null, 2)}\n`);
  await fs.writeFile(
    path.resolve('public/imagens/creditos.json'),
    `${JSON.stringify(creditos, null, 2)}\n`,
  );
  await fs.writeFile(
    path.resolve('public/imagens/CREDITOS.md'),
    [
      '# Créditos das fotografias',
      '',
      'Imagens de **placeholder** para o protótipo de apresentação, obtidas do',
      'Wikimedia Commons. Cada arquivo mantém a licença de origem — a maioria é',
      'Creative Commons, com exigência de atribuição.',
      '',
      '> Na produção, estas fotos dão lugar ao acervo próprio da PHD, fotografado',
      '> no showroom seguindo o PHD Photo Standard. Este arquivo existe para que',
      '> nada seja publicado sem o crédito devido enquanto isso não acontece.',
      '',
      `Total: ${creditos.length} arquivos.`,
      '',
      ...creditos.map(
        (c) => `- \`${c.arquivo}\` — ${c.nome}\n  ${c.autor} · ${c.licenca}\n  ${c.pagina}`,
      ),
      '',
    ].join('\n'),
  );

  console.log(`\n${total} fotos · ${(bytes / 1024 / 1024).toFixed(1)} MB`);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
