// src/Search.tsx
import React from 'react';
import LogoApp from '../components/LogoApp';
import { useThemeContext } from '../context/ThemeContext';
import { Button, Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { getGoalsByDate } from '../helpers/goals';
import background from '../assets/la10.jpg';
import background_dark from '../assets/la10_negra.jpg';
import SearchGridApp from '../components/SearchGridApp';

const Search: React.FC = () => {
  const { mode } = useThemeContext();

  // get from the URL the day, month and year and call getGoalsByDate
  // to get the goals for that date
  // if the day, month or year are not provided, get all the goals
  // from the API
  const day = new URLSearchParams(window.location.search).get('day');
  const month = new URLSearchParams(window.location.search).get('month');
  const year = new URLSearchParams(window.location.search).get('year');
  // convert them to numbers
  const dayNumber = day ? parseInt(day, 10) : undefined;
  const monthNumber = month ? parseInt(month, 10) : undefined;
  const yearNumber = year ? parseInt(year, 10) : undefined;
  // get the goals
  if (!dayNumber && !monthNumber && !yearNumber) {
    // redirect to the home page if the day is not provided
    window.location.href = '/';
  }
  const goals = getGoalsByDate(dayNumber, monthNumber, yearNumber);

  const isMessisBirthday = dayNumber === 24 && monthNumber === 6;

  const redirectToRandomGoal = () => {
    window.location.href = `/goal/${Math.floor(Math.random() * goals.length) + 1}`;
  };

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
          // height: '100vh',
          minHeight: '500px',
          padding: '50px',
          textAlign: 'center',
        }}
      >
        {goals.length <= 10 && <LogoApp />}
        {isMessisBirthday && (
          <Typography variant="h2" gutterBottom>
            Happy Birthday Messi!
          </Typography>
        )}
        {goals.length === 0 ? (
          <>
            <Typography variant="h4" gutterBottom>
              No goals found for this date
            </Typography>
            <Box>
              <Button variant="contained" color="primary" sx={{ mr: 2 }} component={Link} to={`/`}>
                Search Again
              </Button>
              <Button variant="contained" color="secondary" onClick={redirectToRandomGoal}>
                Random
              </Button>
            </Box>
          </>
        ) : (
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              marginBottom: '20px',
            }}
          >
            Select a Goal
          </Typography>
        )}

        <SearchGridApp goals={goals} />
      </Container>
    </>
  );
};

export default Search;
