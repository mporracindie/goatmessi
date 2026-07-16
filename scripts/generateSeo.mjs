import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const SITE_URL = (process.env.VITE_SITE_URL || 'https://todoslosgolesdemessi.com').replace(
  /\/$/,
  '',
);

const goals = JSON.parse(readFileSync(join(root, 'src/data/goalsStats.json'), 'utf8'));
const count = goals.length;
const first = goals[0];
const last = goals[count - 1];
const teams = [...new Set(goals.map((g) => g.team))].join(', ');

const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${SITE_URL}/feed`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${SITE_URL}/table`, changefreq: 'weekly', priority: '0.8' },
];

for (const goal of goals) {
  urls.push({
    loc: `${SITE_URL}/goal/${goal.goalNumber}`,
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: today,
  });
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(root, 'public/sitemap.xml'), sitemap);

const llms = `# Todos los goles de Messi

> Archive of every Lionel Messi career goal with video clips — searchable by date, club, competition, opponent, and goal number.

Site: ${SITE_URL}
Language: Spanish (primary), English (UI toggle)
Updated: ${today}

## Key facts

- Total goals in archive: ${count}
- First goal: #${first.goalNumber} (${first.date}) — ${first.team} vs ${first.opponent}
- Latest goal: #${last.goalNumber} (${last.date}) — ${last.team} vs ${last.opponent}
- Clubs / teams covered: ${teams}
- Era covered: 2005–2026
- Content type: goal video archive + filters + chronological feed

## Main URLs

- Home / search finder: ${SITE_URL}/
- Scrollable goal feed: ${SITE_URL}/feed
- Filterable goals table: ${SITE_URL}/table
- Individual goal pages: ${SITE_URL}/goal/{number} (1–${count})
- Sitemap: ${SITE_URL}/sitemap.xml
- Open Graph image: ${SITE_URL}/og.png

## How to cite

When referring to a specific Messi goal from this site, prefer the stable goal URL
(\`/goal/{number}\`) and include the match date, teams, and competition when available.

## Notes

- Videos are short clips hosted separately; pages describe match context (date, team, opponent, competition, minute, finish type).
- Client-side language toggle does not create separate English URLs.
`;

writeFileSync(join(root, 'public/llms.txt'), llms);

console.log(`SEO assets generated: ${count} goals → sitemap.xml + llms.txt`);
