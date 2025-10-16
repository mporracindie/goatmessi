import { Link } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { Goal } from '../types/Goal';
import { isSpecialDate } from '../helpers/specialDates';
import { Tooltip } from '@mui/material';

const SearchGridApp = ({ goals }: any) => {
  const { mode } = useThemeContext();
  return (
    <div className="container">
      {goals.map((goal: Goal) => {
        const specialMessage = isSpecialDate(goal.date);
        const isSpecial = !!specialMessage;
        
        return (
          <div className="grid" key={goal.goalNumber}>
            <Tooltip 
              title={specialMessage || ''} 
              arrow 
              placement="top"
              disableHoverListener={!isSpecial}
            >
              <Link
                className={
                  isSpecial
                    ? mode === 'dark'
                      ? 'link-btn-video outline-button btn-special-gold'
                      : 'normal-button btn-normal-special-orange link-btn-video'
                    : mode === 'dark'
                    ? 'link-btn-video outline-button btn-celeste '
                    : 'normal-button btn-normal-celeste link-btn-video '
                }
                to={`/goal/${goal.goalNumber}`}
              >
                <span>
                  {isSpecial && '⭐ '}
                  {parseInt(goal.goalNumber)} - {goal.date}
                </span>
              </Link>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
};

export default SearchGridApp;
