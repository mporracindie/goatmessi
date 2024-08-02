// src/Goal.tsx
import React from 'react';
import { useThemeContext } from '../context/ThemeContext';

import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { getGoalByNumber, getRandomGoal } from '../helpers/goals';
import background from '../assets/la10.jpg';
import background_dark from '../assets/la10_negra.jpg';

const Goal: React.FC = () => {
  const { mode } = useThemeContext();

  // get the goal number from the URL
  const goalNumber = window.location.pathname.split('/').pop();

  const goal = getGoalByNumber(goalNumber || '');
  if (!goal.date) {
    // redirect to the home page if the goal is not found
    window.location.href = '/';
  }

  const redirectToRandomGoal = () => {
    window.location.href = `/goal/${getRandomGoal()}`;
  };

  const videoSrc = `https://messi.aws.porracin.com/${goal.goalNumber}_${goal.date}.mp4`;
  return (
    <>
      <div className="background-overlay">
        <img src={mode === 'dark' ? background_dark : background} alt="fondo" />
      </div>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" gutterBottom>
          Goal #{goalNumber} - {goal.date}
        </Typography>
        <Box
          sx={{
            width: '100%',
            height: 0,
            paddingBottom: '56.25%',
            position: 'relative',
            mb: 4,
            backgroundColor: 'black',
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
            }}
          />
        </Box>
        <Box>
          <Button variant="contained" color="primary" sx={{ mr: 2 }} component={Link} to={`/`}>
            Search Again
          </Button>
          <Button variant="contained" color="secondary" onClick={redirectToRandomGoal}>
            Random
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Goal;
