// src/Search.tsx
import React from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { getGoalsByDate } from '../helpers/goals';
import { Goal } from '../types/Goal';

const Search: React.FC = () => {
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

  return (
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
      <Typography variant="h4" gutterBottom>
        Select a Goal
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {goals.map((goal: Goal) => (
          <Grid item key={goal.goalNumber}>
            <Button variant="contained" color="primary" component={Link} to={`/goal/${goal.goalNumber}`}>
              {goal.goalNumber} - {goal.date}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Search;
