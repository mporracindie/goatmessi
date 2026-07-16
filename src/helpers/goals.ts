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
      filters.how,
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
 * Search goals by any combination of date and match details
 */
const searchGoals = (filters: GoalFilters): Goal[] => {
  if (!hasActiveFilters(filters)) {
    return [];
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

    return true;
  });
};

const getRandomGoal = () => {
  return Math.floor(Math.random() * (LAST_GOAL - FIRST_GOAL + 1)) + FIRST_GOAL;
};

export {
  FIRST_GOAL,
  LAST_GOAL,
  filterOptions,
  getGoalByNumber,
  getGoalsByDate,
  getRandomGoal,
  hasActiveFilters,
  searchGoals,
};
