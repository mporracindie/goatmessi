import { goalsList } from '../data/goalsList';
import { Goal } from '../types/Goal';

const DAYS_IN_MONTH = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const TEAM_COLORS: Record<string, string> = {
  Barcelona: '#A50044',
  Argentina: '#6CACE4',
  PSG: '#004170',
  'Inter Miami': '#F7B5CD',
};

export const TEAM_ORDER = ['Barcelona', 'Argentina', 'Inter Miami', 'PSG'] as const;

export const HOW_COLORS: Record<string, string> = {
  'Left foot': '#1fc3e7',
  'Right foot': '#EDBB00',
  Head: '#F7B5CD',
  Chest: '#7CFFB2',
  Hand: '#A50044',
  Hip: '#9B7EDE',
};

export const HOW_ORDER = ['Left foot', 'Right foot', 'Head', 'Chest', 'Hand', 'Hip'] as const;

export type DayOfYearPoint = {
  key: string;
  month: number;
  day: number;
  dayOfYear: number;
  goals: number;
};

export type MonthPoint = {
  month: number;
  goals: number;
};

export type YearTeamPoint = {
  year: number;
  total: number;
} & Record<string, number>;

export type MinuteHowPoint = {
  minute: number;
  label: string;
  total: number;
  [how: string]: string | number;
};

export type NamedCount = {
  name: string;
  goals: number;
};

const parseParts = (date: string) => {
  const [day, month, year] = date.split('-').map(Number);
  return { day, month, year };
};

const monthDayKey = (month: number, day: number) =>
  `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

/** Day-of-year index treating every year as leap (Feb 29 = day 60). */
const dayOfYearIndex = (month: number, day: number) => {
  let index = day;
  for (let m = 1; m < month; m += 1) index += DAYS_IN_MONTH[m];
  return index;
};

const parseMinute = (minute: number | string): number | null => {
  if (typeof minute === 'number' && Number.isFinite(minute)) return minute;
  if (typeof minute === 'string') {
    const match = minute.trim().match(/^(\d+)/);
    if (match) return Number(match[1]);
  }
  return null;
};

export const getGoalsByDayOfYear = (goals: Goal[] = goalsList) => {
  const counts = new Map<string, number>();

  for (const goal of goals) {
    const { day, month } = parseParts(goal.date);
    const key = monthDayKey(month, day);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const points: DayOfYearPoint[] = [];
  for (let month = 1; month <= 12; month += 1) {
    for (let day = 1; day <= DAYS_IN_MONTH[month]; day += 1) {
      const key = monthDayKey(month, day);
      points.push({
        key,
        month,
        day,
        dayOfYear: dayOfYearIndex(month, day),
        goals: counts.get(key) || 0,
      });
    }
  }

  const emptyDays = points.filter((point) => point.goals === 0).length;
  const scoredDays = points.length - emptyDays;
  const busiest = points.reduce(
    (best, point) => (point.goals > best.goals ? point : best),
    points[0],
  );

  return { points, emptyDays, scoredDays, busiest, totalDays: points.length };
};

export const getGoalsByMonth = (goals: Goal[] = goalsList): MonthPoint[] => {
  const counts = Array.from({ length: 12 }, () => 0);

  for (const goal of goals) {
    const { month } = parseParts(goal.date);
    if (month >= 1 && month <= 12) counts[month - 1] += 1;
  }

  return counts.map((goalCount, index) => ({
    month: index + 1,
    goals: goalCount,
  }));
};

export const getGoalsByYearAndTeam = (goals: Goal[] = goalsList) => {
  const years = new Map<number, Record<string, number>>();

  for (const goal of goals) {
    const { year } = parseParts(goal.date);
    const row = years.get(year) || {};
    row[goal.team] = (row[goal.team] || 0) + 1;
    years.set(year, row);
  }

  const teams = [
    ...TEAM_ORDER.filter((team) => goals.some((goal) => goal.team === team)),
    ...[...new Set(goals.map((goal) => goal.team))]
      .filter((team) => !(TEAM_ORDER as readonly string[]).includes(team))
      .sort(),
  ];

  const points: YearTeamPoint[] = [...years.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, counts]) => {
      const point: YearTeamPoint = { year, total: 0 };
      for (const team of teams) {
        const value = counts[team] || 0;
        point[team] = value;
        point.total += value;
      }
      return point;
    });

  return { points, teams };
};

/** Per-minute distribution (1–90 + stoppage), stacked by how the goal was scored. */
export const getGoalsByMinuteAndHow = (goals: Goal[] = goalsList) => {
  const presentHows = new Set<string>();
  const tallies = new Map<number, Map<string, number>>();
  for (let minute = 1; minute <= 91; minute += 1) {
    tallies.set(minute, new Map());
  }

  for (const goal of goals) {
    const parsed = parseMinute(goal.minute);
    if (parsed === null) continue;

    const isStoppageString = typeof goal.minute === 'string' && goal.minute.includes('+');
    const minuteKey =
      isStoppageString || parsed > 90 ? 91 : Math.min(Math.max(parsed, 1), 90);
    const how = goal.how || 'Unknown';
    presentHows.add(how);

    const row = tallies.get(minuteKey);
    if (!row) continue;
    row.set(how, (row.get(how) || 0) + 1);
  }

  const hows = [
    ...HOW_ORDER.filter((how) => presentHows.has(how)),
    ...[...presentHows]
      .filter((how) => !(HOW_ORDER as readonly string[]).includes(how))
      .sort(),
  ];

  const points: MinuteHowPoint[] = [...tallies.entries()].map(([minute, counts]) => {
    const point: MinuteHowPoint = {
      minute,
      label: minute === 91 ? '90+' : String(minute),
      total: 0,
    };
    for (const how of hows) {
      const value = counts.get(how) || 0;
      point[how] = value;
      point.total += value;
    }
    return point;
  });

  return { points, hows };
};

export const getGoalsByHow = (goals: Goal[] = goalsList): NamedCount[] => {
  const counts = new Map<string, number>();
  for (const goal of goals) {
    if (!goal.how) continue;
    counts.set(goal.how, (counts.get(goal.how) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, goalCount]) => ({ name, goals: goalCount }))
    .sort((a, b) => b.goals - a.goals);
};

export const getGoalsByType = (goals: Goal[] = goalsList): NamedCount[] => {
  const counts = new Map<string, number>();
  for (const goal of goals) {
    const name = goal.type || 'Unknown';
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, goalCount]) => ({ name, goals: goalCount }))
    .sort((a, b) => b.goals - a.goals);
};

export const getTopOpponents = (goals: Goal[] = goalsList, limit = 12): NamedCount[] => {
  const counts = new Map<string, number>();
  for (const goal of goals) {
    counts.set(goal.opponent, (counts.get(goal.opponent) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, goalCount]) => ({ name, goals: goalCount }))
    .sort((a, b) => b.goals - a.goals)
    .slice(0, limit);
};

export const getGoalsByCompetition = (goals: Goal[] = goalsList, limit = 10): NamedCount[] => {
  const counts = new Map<string, number>();
  for (const goal of goals) {
    counts.set(goal.competition, (counts.get(goal.competition) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, goalCount]) => ({ name, goals: goalCount }))
    .sort((a, b) => b.goals - a.goals)
    .slice(0, limit);
};
