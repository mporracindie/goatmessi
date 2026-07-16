export type Goal = {
  goalNumber: string;
  date: string;
  competitionCode: string;
  competition: string;
  team: string;
  opponent: string;
  home: string;
  away: string;
  result: string;
  minute: number | string;
  scoreAtGoal: string;
  type: string | null;
  how: string | null;
};

export type GoalStats = Omit<Goal, 'goalNumber'> & {
  goalNumber: number;
};
