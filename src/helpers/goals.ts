import { goalsList } from '../data/goalsList';
import { Goal } from '../types/Goal';

const FIRST_GOAL = 1;
const LAST_GOAL = 800;

/**
 * Get the goal (date and number) by its number
 * @param goalNumber The number of the goal
 * @returns The date of the goal
 */
const getGoalByNumber = (goalNumber: string) => {
  const goalNumberString = goalNumber.padStart(4, '0');
  const goal = goalsList.find((goal: Goal) => goal.goalNumber === goalNumberString);
  return { date: goal?.date, goalNumber: goal?.goalNumber };
};

/**
 * Get the goals by a specific date
 * @param day The day to filter
 * @param month The month to filter
 * @param year The year to filter
 * @returns The goals of the specified date
 */
const getGoalsByDate = (day?: number, month?: number, year?: number) => {
  if (!day && !month && !year) {
    return [];
  }
  const goals = goalsList.filter((goal: Goal) => {
    const [goalDay, goalMonth, goalYear] = goal.date.split('-').map(Number);
    return (day === undefined || goalDay === month) && (month === undefined || goalMonth === month) && (year === undefined || goalYear === year);
  });
  console.log(goals)
  return goals;
};

const getRandomGoal = () => {
  return Math.floor(Math.random() * (LAST_GOAL - FIRST_GOAL + 1)) + FIRST_GOAL;
};

export { getGoalByNumber, getGoalsByDate, getRandomGoal };
