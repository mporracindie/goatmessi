import { goalsList } from '../data/goalsList';
import { Goal } from '../types/Goal';

const FIRST_GOAL = 1;
const LAST_GOAL = goalsList.length;

/**
 * The easter eggs
 */
const easterEggs: Record<string, string> = {
  'montiel': '18-12-2022'
};

export type GoalFilters = {
  day?: number;
  month?: number;
  year?: number;
  team?: string;
  competition?: string;
  opponent?: string;
  type?: string;
  how?: string;
  minuteMin?: number;
  minuteMax?: number;
};

/** Base minute for filtering — "90+2" → 90 so stoppage matches its period. */
const parseGoalMinute = (minute: number | string): number | null => {
  if (typeof minute === 'number' && Number.isFinite(minute)) {
    return minute;
  }
  if (typeof minute === 'string') {
    const match = minute.trim().match(/^(\d+)/);
    if (match) return Number(match[1]);
  }
  return null;
};

const uniqueSorted = (values: Array<string | null | undefined>) =>
  [...new Set(values.filter((value): value is string => Boolean(value)))].sort((a, b) =>
    a.localeCompare(b),
  );

const filterOptions = {
  teams: uniqueSorted(goalsList.map((goal) => goal.team)),
  competitions: uniqueSorted(goalsList.map((goal) => goal.competition)),
  opponents: uniqueSorted(goalsList.map((goal) => goal.opponent)),
  types: uniqueSorted(goalsList.map((goal) => goal.type)),
  hows: uniqueSorted(goalsList.map((goal) => goal.how)),
  years: [
    ...new Set(
      goalsList.map((goal) => {
        const [, , year] = goal.date.split('-');
        return year;
      }),
    ),
  ].sort((a, b) => Number(b) - Number(a)),
};

const hasActiveFilters = (filters: GoalFilters) =>
  Boolean(
    filters.day ||
      filters.month ||
      filters.year ||
      filters.team ||
      filters.competition ||
      filters.opponent ||
      filters.type ||
      filters.how ||
      filters.minuteMin !== undefined ||
      filters.minuteMax !== undefined,
  );

/**
 * Get the goal (date and number) by its number
 * @param goalNumber The number of the goal
 * @returns The date of the goal
 */
const getGoalByNumber = (goalNumber: string): Goal | undefined => {
  if (goalNumber in easterEggs) {
    return {
      goalNumber: goalNumber.padStart(4, '0'),
      date: easterEggs[goalNumber],
      competitionCode: '',
      competition: '',
      team: '',
      opponent: '',
      home: '',
      away: '',
      result: '',
      minute: '',
      scoreAtGoal: '',
      type: null,
      how: null,
    };
  }

  const goalNumberString = goalNumber.padStart(4, '0');
  return goalsList.find((goal: Goal) => goal.goalNumber === goalNumberString);
};

/**
 * Get the goals by a specific date
 * @param day The day to filter
 * @param month The month to filter
 * @param year The year to filter
 * @returns The goals of the specified date
 */
const getGoalsByDate = (day?: number, month?: number, year?: number) => {
  return searchGoals({ day, month, year });
};

/**
 * Filter goals by any combination of date and match details.
 * Returns the full list when no filters are active.
 */
const filterGoals = (filters: GoalFilters): Goal[] => {
  if (!hasActiveFilters(filters)) {
    return goalsList;
  }

  return goalsList.filter((goal: Goal) => {
    const [goalDay, goalMonth, goalYear] = goal.date.split('-').map(Number);

    if (filters.day !== undefined && goalDay !== filters.day) return false;
    if (filters.month !== undefined && goalMonth !== filters.month) return false;
    if (filters.year !== undefined && goalYear !== filters.year) return false;
    if (filters.team && goal.team !== filters.team) return false;
    if (filters.competition && goal.competition !== filters.competition) return false;
    if (filters.opponent && goal.opponent !== filters.opponent) return false;
    if (filters.type && goal.type !== filters.type) return false;
    if (filters.how && goal.how !== filters.how) return false;

    if (filters.minuteMin !== undefined || filters.minuteMax !== undefined) {
      const goalMinute = parseGoalMinute(goal.minute);
      if (goalMinute === null) return false;

      let min = filters.minuteMin;
      let max = filters.minuteMax;
      if (min !== undefined && max !== undefined && min > max) {
        [min, max] = [max, min];
      }

      if (min !== undefined && goalMinute < min) return false;
      if (max !== undefined && goalMinute > max) return false;
    }

    return true;
  });
};

/**
 * Search goals by any combination of date and match details.
 * Returns an empty list when no filters are active (search requires a query).
 */
const searchGoals = (filters: GoalFilters): Goal[] => {
  if (!hasActiveFilters(filters)) {
    return [];
  }

  return filterGoals(filters);
};

const getRandomGoal = () => {
  return Math.floor(Math.random() * (LAST_GOAL - FIRST_GOAL + 1)) + FIRST_GOAL;
};

export {
  FIRST_GOAL,
  LAST_GOAL,
  filterGoals,
  filterOptions,
  getGoalByNumber,
  getGoalsByDate,
  getRandomGoal,
  hasActiveFilters,
  searchGoals,
};
