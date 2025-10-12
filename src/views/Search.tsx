// src/Search.tsx
import React, { useState, useMemo } from 'react';
import LogoApp from '../components/LogoApp';
import { useThemeContext } from '../context/ThemeContext';
import { Button, Container, Typography, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Link } from 'react-router-dom';
import { getGoalsByDate } from '../helpers/goals';
import background from '../assets/la10.jpg';
import background_dark from '../assets/la10_negra.jpg';
import SearchGridApp from '../components/SearchGridApp';

const Search: React.FC = () => {
  const { mode } = useThemeContext();
  const [sortBy, setSortBy] = useState<'number' | 'date'>('number');

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
  const goalsData = getGoalsByDate(dayNumber, monthNumber, yearNumber);

  // Sort goals based on the selected sort method
  const goals = useMemo(() => {
    const sortedGoals = [...goalsData];
    if (sortBy === 'number') {
      // Sort by goal number (ascending)
      sortedGoals.sort((a, b) => parseInt(a.goalNumber) - parseInt(b.goalNumber));
    } else {
      // Sort by date (most recent first)
      sortedGoals.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('-').map(Number);
        const [dayB, monthB, yearB] = b.date.split('-').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateB.getTime() - dateA.getTime();
      });
    }
    return sortedGoals;
  }, [goalsData, sortBy]);

  const isMessisBirthday = dayNumber === 24 && monthNumber === 6;

  const handleSortChange = (_event: React.MouseEvent<HTMLElement>, newSortBy: 'number' | 'date') => {
    if (newSortBy !== null) {
      setSortBy(newSortBy);
    }
  };

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
        {/* Top section - non-sticky */}
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
          <>
            {/* Sticky header for title and sort controls */}
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backdropFilter: 'blur(10px)',
                padding: '16px 0',
                width: '100%',
                marginBottom: '100px',
                borderBottom: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  marginBottom: '16px',
                }}
              >
                Select a Goal
              </Typography>
              <ToggleButtonGroup
                value={sortBy}
                exclusive
                onChange={handleSortChange}
                aria-label="sort by"
                color="primary"
              >
                <ToggleButton value="number" aria-label="sort by goal number">
                  Sort by Goal Number
                </ToggleButton>
                <ToggleButton value="date" aria-label="sort by date">
                  Sort by Date
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <SearchGridApp goals={goals} />
          </>
        )}
      
      </Container>
    </>
  );
};

export default Search;
