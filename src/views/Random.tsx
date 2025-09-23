// src/views/Random.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomGoal } from '../helpers/goals';

const Random: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const randomGoalNumber = getRandomGoal();
    navigate(`/goal/${randomGoalNumber}`, { replace: true });
  }, [navigate]);

  // Show nothing while redirecting
  return null;
};

export default Random;
