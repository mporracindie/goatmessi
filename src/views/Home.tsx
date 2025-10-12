// src/MainPage.tsx
import React from 'react';
import { useThemeContext } from '../context/ThemeContext';
import LogoApp from '../components/LogoApp';

import { Box, Container, Typography, Grid, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { getRandomGoal } from '../helpers/goals';
import background from '../assets/la10.jpg';
import background_dark from '../assets/la10_negra.jpg';

type DateType = {
  day: Dayjs | null;
  month: Dayjs | null;
  year: Dayjs | null;
};

const MainPage: React.FC = () => {
  const { mode } = useThemeContext();
  const [date, setDate] = React.useState<DateType>({
    day: null,
    month: null,
    year: null,
  });
  const [goalNumber, setGoalNumber] = React.useState<string>('');
  const [goalNumberError, setGoalNumberError] = React.useState<string>('');

  const handleDateChange = (key: keyof DateType) => (newValue: Dayjs | null) => {
    setDate((prevDate) => ({
      ...prevDate,
      [key]: newValue,
    }));
  };

  const handleGoalNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setGoalNumber(value);
    setGoalNumberError('');
  };

  const handleDateSearch = () => {
    const day = date.day?.format('DD');
    const month = date.month?.format('MM');
    const year = date.year?.format('YYYY');
    if (!day && !month && !year) {
      return;
    }

    window.location.href = `/search?${day ? `day=${day}` : ''}${month ? `&month=${month}` : ''}${year ? `&year=${year}` : ''
      }`;
  };

  const redirectToRandomGoal = () => {
    window.location.href = `/goal/${getRandomGoal()}`;
  };

  const handleGoalNumberSearch = () => {
    const num = parseInt(goalNumber);
    if (isNaN(num)) {
      setGoalNumberError('Please enter a valid number');
      return;
    }
    if (num < 1 || num > 800) {
      setGoalNumberError('Please enter a number between 1 and 800');
      return;
    }
    window.location.href = `/goal/${num}`;
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
        }}
      >
        <LogoApp />
        <Typography variant="h6" textAlign="center" mb={2}>
          Search by date
        </Typography>
        <Grid container spacing={0} justifyContent="center">
          <div className={`bg-grid ${mode === 'dark' ? 'bg-grid-dark' : 'bg-grid-light '}`}>
            <Grid
              item
              sx={{
                margin: 0,
                padding: 0,
              }}
            >
              <Container
                sx={{
                  width: '128px',
                }}
              >
                <DatePicker label={'DD'} views={['day']} value={date.day} onChange={handleDateChange('day')} />
                <Typography variant="caption" textAlign={'center'}>
                  Optional
                </Typography>
              </Container>
            </Grid>
            <Grid item>
              <Container
                sx={{
                  width: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'end',
                }}
              >
                <DatePicker label={'MM'} views={['month']} value={date.month} onChange={handleDateChange('month')} />
                <Typography variant="caption" textAlign={'center'}>
                  Optional
                </Typography>
              </Container>
            </Grid>
            <Grid item>
              <Container
                sx={{
                  width: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'end',
                }}
              >
                <DatePicker
                  label={'YYYY'}
                  views={['year']}
                  value={date.year}
                  onChange={handleDateChange('year')}
                  disableFuture
                />
                <Typography variant="caption" textAlign={'center'}>
                  Optional
                </Typography>
              </Container>
            </Grid>
          </div>
        </Grid>
        <Box mt={4}>
          <button
            className={mode === 'dark' ? 'outline-button btn-celeste ' : 'normal-button btn-normal-celeste'}
            onClick={handleDateSearch}
          >
            <span>BY DATE</span>
          </button>
          <button
            className={mode === 'dark' ? 'outline-button btn-violeta ' : 'normal-button btn-normal-violeta'}
            onClick={redirectToRandomGoal}
          >
            <span>RANDOM</span>
          </button>
        </Box>

        <Box mt={4} width="100%">
          <Typography variant="h6" textAlign="center" mb={2}>
            Or search by goal number
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <TextField
              label="Goal Number"
              type="number"
              value={goalNumber}
              onChange={handleGoalNumberChange}
              error={!!goalNumberError}
              helperText={goalNumberError}
              sx={{ width: '250px' }}
              inputProps={{ min: 1, max: 800 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleGoalNumberSearch();
                }
              }}
            />
            <button
              className={mode === 'dark' ? 'outline-button btn-celeste' : 'normal-button btn-normal-celeste'}
              onClick={handleGoalNumberSearch}
            >
              <span>SEARCH BY NUMBER</span>
            </button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default MainPage;
