// src/views/Random.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomGoal } from '../helpers/goals';
import { useLocale } from '../context/LocaleContext';
import PageMeta from '../components/PageMeta';

const Random: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLocale();

  useEffect(() => {
    const randomGoalNumber = getRandomGoal();
    navigate(`/goal/${randomGoalNumber}`, { replace: true });
  }, [navigate]);

  return (
    <PageMeta
      title={t('seo.randomTitle')}
      description={t('seo.randomDescription')}
      path="/random"
      noindex
    />
  );
};

export default Random;
