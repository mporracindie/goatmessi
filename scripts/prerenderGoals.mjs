import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const SITE_URL = (process.env.VITE_SITE_URL || 'https://todoslosgolesdemessi.com').replace(
  /\/$/,
  '',
);

const goals = JSON.parse(readFileSync(join(root, 'src/data/goalsStats.json'), 'utf8'));
const indexHtml = readFileSync(join(dist, 'index.html'), 'utf8');

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const replaceMeta = (html, { title, description, url, jsonLd, noscript }) => {
  let next = html;
  next = next.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  next = next.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  );
  next = next.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
  );
  next = next.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
  );
  next = next.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
  );
  next = next.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
  );
  next = next.replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:type" content="video.other" />`,
  );
  next = next.replace(
    /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image:alt" content="${escapeHtml(title)}" />`,
  );
  next = next.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
  );
  next = next.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
  );

  const jsonLdTag = `<script type="application/ld+json" id="page-json-ld">${JSON.stringify(jsonLd)}</script>`;
  if (next.includes('id="website-json-ld"')) {
    next = next.replace(
      /<script type="application\/ld\+json" id="website-json-ld">[\s\S]*?<\/script>/,
      jsonLdTag,
    );
  } else {
    next = next.replace('</head>', `    ${jsonLdTag}\n  </head>`);
  }

  next = next.replace(
    /<noscript>[\s\S]*?<\/noscript>/,
    `<noscript>\n${noscript}\n    </noscript>`,
  );

  return next;
};

let written = 0;

for (const goal of goals) {
  const n = goal.goalNumber;
  const url = `${SITE_URL}/goal/${n}`;
  const videoUrl = `https://messi.aws.porracin.com/${String(n).padStart(4, '0')}_${goal.date}.mp4`;
  const title = `Gol #${n} · Messi · ${goal.team} vs ${goal.opponent} | Todos los goles de Messi`;
  const description = `Video del gol #${n} de Lionel Messi (${goal.date}): ${goal.team} ${goal.result} ${goal.opponent}, ${goal.competition}, minuto ${goal.minute}.`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `Lionel Messi gol #${n} — ${goal.team} vs ${goal.opponent}`,
    description,
    thumbnailUrl: `${SITE_URL}/og.png`,
    uploadDate: `${goal.date.split('-').reverse().join('-')}`,
    contentUrl: videoUrl,
    embedUrl: url,
    url,
    about: {
      '@type': 'Person',
      name: 'Lionel Messi',
    },
  };

  const noscript = `      <main>
        <h1>Gol #${n} de Lionel Messi</h1>
        <p>${escapeHtml(description)}</p>
        <ul>
          <li>Fecha: ${escapeHtml(goal.date)}</li>
          <li>Equipo: ${escapeHtml(goal.team)}</li>
          <li>Rival: ${escapeHtml(goal.opponent)}</li>
          <li>Competición: ${escapeHtml(goal.competition)}</li>
          <li>Resultado: ${escapeHtml(goal.result)}</li>
          <li>Minuto: ${escapeHtml(String(goal.minute))}</li>
        </ul>
        <p><a href="${escapeHtml(url)}">Ver el video del gol #${n}</a> · <a href="${SITE_URL}/">Volver al archivo</a></p>
      </main>`;

  const html = replaceMeta(indexHtml, { title, description, url, jsonLd, noscript });
  const outDir = join(dist, 'goal', String(n));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  written += 1;
}

console.log(`Prerendered ${written} goal pages into dist/goal/{n}/`);
