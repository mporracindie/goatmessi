// src/MainPage.tsx
import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { getRandomGoal } from '../helpers/goals';

type DateType = {
  day: Dayjs | null;
  month: Dayjs | null;
  year: Dayjs | null;
};

const MainPage: React.FC = () => {
  const [date, setDate] = React.useState<DateType>({
    day: null,
    month: null,
    year: null,
  });

  const handleDateChange = (key: keyof DateType) => (newValue: Dayjs | null) => {
    setDate((prevDate) => ({
      ...prevDate,
      [key]: newValue,
    }));
  };

  const handleDateSearch = () => {
    const day = date.day?.format('DD');
    const month = date.month?.format('MM');
    const year = date.year?.format('YYYY');
    if (!day && !month && !year) {
      return;
    }

    window.location.href = `/search?${day ? `day=${day}` : ''}${month ? `&month=${month}` : ''}${year ? `&year=${year}` : ''}`;
  };


  const redirectToRandomGoal = () => {
    window.location.href = `/goal/${getRandomGoal()}`;
  }

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h2" gutterBottom>
        Messi GOAT 🐐⚽
      </Typography>
      <Grid container spacing={0} justifyContent="center">
        <Grid item sx={{
            margin: 0,
            padding: 0,
        }}>
          <Container
            sx={{
              width: '128px',
            }}
          >
            <DatePicker label={'DD'} views={['day']} value={date.day} onChange={handleDateChange('day')} />
            <Typography variant="caption">Optional</Typography>
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
            <Typography variant="caption">Optional</Typography>
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
            <Typography variant="caption">Optional</Typography>
          </Container>
        </Grid>
      </Grid>
      <Box mt={4}>
        <Button variant="contained" sx={{ mr: 2 }} onClick={handleDateSearch}>
          By Date
        </Button>
        <Button variant="contained" color="secondary" onClick={redirectToRandomGoal}>
          Random
        </Button>
      </Box>
    </Container>
  );
};

export default MainPage;
