import { Link } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { Goal } from '../types/Goal';
import { isSpecialDate } from '../helpers/specialDates';
import { Tooltip } from '@mui/material';
import { TranslationKey } from '../i18n/translations';

const SearchGridApp = ({ goals }: { goals: Goal[] }) => {
  const { locale, t } = useLocale();

  const translateMeta = (value: string | null) => {
    if (!value) return null;
    const key = `goalMeta.${value}` as TranslationKey;
    const translated = t(key);
    return translated === key ? value : translated;
  };

  const formatGoalLabel = (goal: Goal) => {
    const number = parseInt(goal.goalNumber);
    const match = goal.team && goal.opponent ? `${goal.team} vs ${goal.opponent}` : null;
    const detail = [translateMeta(goal.type), translateMeta(goal.how)].filter(Boolean).join(' · ');

    return [number, goal.date, match, detail].filter(Boolean).join(' · ');
  };

  return (
    <div className="goals-grid">
      {goals.map((goal: Goal) => {
        const specialMessage = isSpecialDate(goal.date, locale);
        const isSpecial = !!specialMessage;
        const label = formatGoalLabel(goal);

        return (
          <Tooltip key={goal.goalNumber} title={specialMessage || label} arrow placement="top">
            <Link
              className={`goal-chip link-btn-video${isSpecial ? ' goal-chip-special' : ''}`}
              to={`/goal/${goal.goalNumber}`}
            >
              {isSpecial && '⭐ '}
              {label}
            </Link>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default SearchGridApp;
