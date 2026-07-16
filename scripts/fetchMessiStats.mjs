import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_URL = 'https://www.messistats.com/en/locationsscored';
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '../src/data/goalsStats.json');

const TEAM_CHECKS = [
  ['Inter Miami CF', 'Inter Miami'],
  ['Inter Miami', 'Inter Miami'],
  ['Paris Saint-Germain', 'PSG'],
  ['PSG', 'PSG'],
  ['FC Barcelona', 'Barcelona'],
  ['Argentina', 'Argentina'],
];

function cleanCell(text) {
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseCompetition(text) {
  const [competitionCode, ...rest] = text.split(' ');
  return {
    competitionCode: competitionCode ?? '',
    competition: rest.join(' ') || text,
  };
}

function getTeam(home, away) {
  for (const [needle, name] of TEAM_CHECKS) {
    if (home.includes(needle) || away.includes(needle)) {
      return name;
    }
  }
  return null;
}

function isMessiHome(home, team) {
  if (team === 'Barcelona') return home.includes('Barcelona');
  if (team === 'Argentina') return home.includes('Argentina');
  if (team === 'PSG') return home.includes('Paris') || home.includes('PSG');
  if (team === 'Inter Miami') return home.includes('Miami');
  return false;
}

function getOpponent(home, away, team) {
  return isMessiHome(home, team) ? away : home;
}

function parseGoals(html) {
  const rows = [...html.matchAll(/<tr[^>]*>(.*?)<\/tr>/gs)];
  const goals = [];

  for (const [row] of rows) {
    const cells = [...row.matchAll(/<td[^>]*>(.*?)<\/td>/gs)].map((match) => cleanCell(match[1]));
    if (!cells.length || !/^\d+$/.test(cells[0])) {
      continue;
    }

    const goalNumber = Number(cells[0]);
    const { competitionCode, competition } = parseCompetition(cells[2]);
    const home = cells[3];
    const away = cells[5];
    const team = getTeam(home, away);

    if (!team) {
      throw new Error(`Could not determine Messi's team for goal ${goalNumber}: ${home} vs ${away}`);
    }

    const minute = /^\d+$/.test(cells[6]) ? Number(cells[6]) : cells[6];

    goals.push({
      goalNumber,
      date: cells[1],
      competitionCode,
      competition,
      team,
      opponent: getOpponent(home, away, team),
      home,
      away,
      result: cells[4],
      minute,
      scoreAtGoal: cells[7],
      type: cells[8] || null,
      how: cells[9] || null,
    });
  }

  goals.sort((a, b) => a.goalNumber - b.goalNumber);
  return goals;
}

async function fetchMessiStats() {
  const response = await fetch(SOURCE_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; todoslosgolesdemessi/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch MessiStats (${response.status})`);
  }

  const html = await response.text();
  const goals = parseGoals(html);

  if (goals.length === 0) {
    throw new Error('No goals parsed from MessiStats');
  }

  writeFileSync(OUTPUT_PATH, `${JSON.stringify(goals, null, 2)}\n`);

  console.log(`Saved ${goals.length} goals to ${OUTPUT_PATH}`);
  console.log(`Range: #${goals[0].goalNumber} (${goals[0].date}) → #${goals.at(-1).goalNumber} (${goals.at(-1).date})`);
}

fetchMessiStats().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
