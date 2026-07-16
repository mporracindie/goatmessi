import { Goal } from '../types/Goal';
import { LAST_GOAL } from './goals';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://todoslosgolesdemessi.com').replace(
  /\/$/,
  '',
);

export const OG_IMAGE_PATH = '/og.png';
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

export type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'video.other';
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  noindex?: boolean;
};

const JSON_LD_ID = 'page-json-ld';

const ensureMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const ensureLink = (rel: string, href: string) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
};

const absoluteUrl = (path: string) => {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const applyPageMeta = ({
  title,
  description,
  path,
  image = OG_IMAGE_URL,
  type = 'website',
  jsonLd,
  noindex = false,
}: PageMetaInput) => {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  document.title = title;
  ensureMeta('name', 'description', description);
  ensureLink('canonical', url);

  ensureMeta('property', 'og:type', type);
  ensureMeta('property', 'og:url', url);
  ensureMeta('property', 'og:title', title);
  ensureMeta('property', 'og:description', description);
  ensureMeta('property', 'og:image', imageUrl);
  ensureMeta('property', 'og:image:alt', title);

  ensureMeta('name', 'twitter:card', 'summary_large_image');
  ensureMeta('name', 'twitter:title', title);
  ensureMeta('name', 'twitter:description', description);
  ensureMeta('name', 'twitter:image', imageUrl);

  ensureMeta('name', 'robots', noindex ? 'noindex,follow' : 'index,follow');

  let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
  if (jsonLd) {
    if (!script) {
      script = document.createElement('script');
      script.id = JSON_LD_ID;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    const payload = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    script.textContent = JSON.stringify(payload.length === 1 ? payload[0] : payload);
  } else if (script) {
    script.remove();
  }
};

export const buildWebsiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Todos los goles de Messi',
  alternateName: ["All of Messi's goals", 'Goles Messi'],
  url: `${SITE_URL}/`,
  description: `Archivo con los ${LAST_GOAL} goles de Lionel Messi en video. Buscá por fecha, club, rival o número de gol.`,
  inLanguage: ['es', 'en'],
  about: {
    '@type': 'Person',
    name: 'Lionel Messi',
    alternateName: 'Leo Messi',
  },
  publisher: {
    '@type': 'Person',
    name: 'Marco Porracin',
    url: 'https://porracin.com/',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?team={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

export const buildGoalVideoJsonLd = (goal: Goal) => {
  const goalNo = Number(goal.goalNumber);
  const url = `${SITE_URL}/goal/${goalNo}`;
  const padded = String(goal.goalNumber).padStart(4, '0');
  const videoUrl = `https://messi.aws.porracin.com/${padded}_${goal.date}.mp4`;
  const [dd, mm, yyyy] = goal.date.split('-');
  const uploadDate = yyyy && mm && dd ? `${yyyy}-${mm}-${dd}` : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `Lionel Messi gol #${goalNo} — ${goal.team} vs ${goal.opponent}`,
    description: `Gol #${goalNo} de Lionel Messi el ${goal.date}: ${goal.team} ${goal.result} ${goal.opponent} (${goal.competition}), minuto ${goal.minute}.`,
    thumbnailUrl: OG_IMAGE_URL,
    ...(uploadDate ? { uploadDate } : {}),
    contentUrl: videoUrl,
    embedUrl: url,
    url,
    about: {
      '@type': 'Person',
      name: 'Lionel Messi',
    },
  };
};

export const homeMeta = (locale: 'es' | 'en') => {
  if (locale === 'en') {
    return {
      title: `All ${LAST_GOAL} of Messi's goals in one archive`,
      description: `Watch every Lionel Messi career goal (${LAST_GOAL} clips, 2005–2026). Search by date, club, competition, opponent, or jump to a goal number.`,
      path: '/',
    };
  }

  return {
    title: `Todos los goles de Messi — ${LAST_GOAL} goles en un archivo`,
    description: `Reviví los ${LAST_GOAL} goles de Lionel Messi (2005–2026) en video. Buscá por fecha, club, competencia, rival o número de gol.`,
    path: '/',
  };
};
