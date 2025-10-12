import { Link } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { Goal } from '../types/Goal';

const SearchGridApp = ({ goals }: any) => {
  const { mode } = useThemeContext();
  return (
    <div className="container">
      {goals.map((goal: Goal) => (
        <div className="grid" key={goal.goalNumber}>
          <Link
            className={
              mode === 'dark'
                ? 'link-btn-video outline-button btn-celeste '
                : 'normal-button btn-normal-celeste link-btn-video '
            }
            to={`/goal/${goal.goalNumber}`}
          >
            <span>
              {parseInt(goal.goalNumber)} - {goal.date}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SearchGridApp;
