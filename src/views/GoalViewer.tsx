// src/Goal.tsx
import React from 'react';
import { useThemeContext } from '../context/ThemeContext';
import { Box, Typography, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { getGoalByNumber, getRandomGoal } from '../helpers/goals';
import background from '../assets/la10.jpg';
import background_dark from '../assets/la10_negra.jpg';
import { isSpecialDate } from '../helpers/specialDates';

const Goal: React.FC = () => {
  const { mode } = useThemeContext();

  // get the goal number from the URL
  const goalNumber = window.location.pathname.split('/').pop();

  const goal = getGoalByNumber(goalNumber || '');
  if (!goal.date) {
    // redirect to the home page if the goal is not found
    window.location.href = '/';
    return null;
  }

  const specialMessage = isSpecialDate(goal.date);
  const isSpecial = !!specialMessage;

  const redirectToRandomGoal = () => {
    window.location.href = `/goal/${getRandomGoal()}`;
  };

  const videoSrc = `https://messi.aws.porracin.com/${goal.goalNumber}_${goal.date}.mp4`;
  return (
    <>
      <div className="background-overlay">
        <img src={mode === 'dark' ? background_dark : background} alt="fondo" />
      </div>

      <div className="container-video">
        <Tooltip 
          title={specialMessage || ''} 
          arrow 
          placement="top"
          disableHoverListener={!isSpecial}
        >
          <Typography 
            variant="h2" 
            gutterBottom
            sx={{
              color: isSpecial 
                ? mode === 'dark' 
                  ? '#FFD700' 
                  : '#FF6B00'
                : 'inherit',
              cursor: isSpecial ? 'pointer' : 'default',
            }}
          >
            {isSpecial && '⭐ '}Goal #{goalNumber} - {goal.date}
          </Typography>
        </Tooltip>
        {isSpecial && (
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              color: mode === 'dark' ? '#FFD700' : '#FF6B00',
              marginTop: '-10px',
              marginBottom: '20px',
            }}
          >
            🎉 {specialMessage}
          </Typography>
        )}
        <Box
          sx={{
            width: '100%',
            paddingBottom: '56.25%',
            position: 'relative',
            mb: 4,
            backgroundColor: 'black',
            borderRadius: '10px',
            border: 'none',
          }}
        >
          <video
            src={videoSrc}
            autoPlay
            loop
            controls
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '10px',
            }}
          />
        </Box>
        <Box>
          <Link
            className={
              mode === 'dark'
                ? 'link-btn-video outline-button btn-celeste '
                : 'normal-button btn-normal-celeste link-btn-video '
            }
            to={`/`}
          >
            <span>SEARCH AGAIN</span>
          </Link>
          <button
            className={mode === 'dark' ? 'outline-button btn-violeta ' : 'normal-button btn-normal-violeta'}
            onClick={redirectToRandomGoal}
          >
            <span>RANDOM</span>
          </button>
        </Box>
      </div>
    </>
  );
};

export default Goal;
