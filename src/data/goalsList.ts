import goalsStats from './goalsStats.json';
import { Goal } from '../types/Goal';

export const goalsList: Goal[] = goalsStats.map((goal) => ({
  ...goal,
  goalNumber: String(goal.goalNumber).padStart(4, '0'),
}));
