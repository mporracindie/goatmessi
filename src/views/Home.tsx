import React from 'react';
import { useThemeContext } from '../context/ThemeContext';
import LogoApp from '../components/LogoApp';
import { Box, Container, Typography, Paper, TextField, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { getRandomGoal } from '../helpers/goals';
import background from '../assets/la10.jpg';
import background_dark from '../assets/la10_negra.jpg';
import { Search, SportsSoccer } from '@mui/icons-material';

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
    window.location.href = `/search?${day ? `day=${day}` : ''}${month ? `&month=${month}` : ''}${year ? `&year=${year}` : ''}`;
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

  const hasDateSelected = date.day || date.month || date.year;

  return (
    <>
      <div className="background-overlay">
        <img src={mode === 'dark' ? background_dark : background} alt="fondo" />
      </div>

      <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Hero Section */}
        <Box textAlign="center" mb={6} sx={{ flexShrink: 0 }}>
          <Box mb={3}>
            <LogoApp />
          </Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Explore Messi's goals
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}
          >
            Discover every goal from Lionel Messi's legendary career. Search by date, goal number, or explore randomly.
          </Typography>
        </Box>

        {/* Search Options */}
        <Stack spacing={4} sx={{ flex: 1, justifyContent: 'center' }}>
          {/* Quick Actions Section */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              backgroundColor: mode === 'dark' ? 'rgba(12, 12, 12, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
              Not sure where to start? Try these options to explore Messi's goals.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <button
                className={mode === 'dark' ? 'outline-button btn-violeta' : 'normal-button btn-normal-violeta'}
                onClick={redirectToRandomGoal}
              >
                <span>RANDOM GOAL</span>
              </button>
              <button
                className={mode === 'dark' ? 'outline-button btn-celeste' : 'normal-button btn-normal-celeste'}
                onClick={() => window.location.href = '/feed'}
              >
                <span>BROWSE FEED</span>
              </button>
            </Stack>
          </Paper>

          {/* Date Search Section */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              backgroundColor: mode === 'dark' ? 'rgba(12, 12, 12, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Search color="primary" />
              Search by Date
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Find goals from specific dates. All fields are optional - mix and match day, month, and year.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3
              }}
            >
              <Box sx={{ minWidth: { xs: '100%', sm: 140 } }}>
                <DatePicker
                  label="Day"
                  views={['day']}
                  value={date.day}
                  onChange={handleDateChange('day')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'medium'
                    }
                  }}
                />
              </Box>
              <Box sx={{ minWidth: { xs: '100%', sm: 140 } }}>
                <DatePicker
                  label="Month"
                  views={['month']}
                  value={date.month}
                  onChange={handleDateChange('month')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'medium'
                    }
                  }}
                />
              </Box>
              <Box sx={{ minWidth: { xs: '100%', sm: 140 } }}>
                <DatePicker
                  label="Year"
                  views={['year']}
                  value={date.year}
                  onChange={handleDateChange('year')}
                  disableFuture
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'medium'
                    }
                  }}
                />
              </Box>
            </Box>

            <Box textAlign="center">
              <button
                className={`${mode === 'dark' ? 'outline-button btn-celeste' : 'normal-button btn-normal-celeste'} primary-cta`}
                onClick={handleDateSearch}
                disabled={!hasDateSelected}
                style={{
                  opacity: hasDateSelected ? 1 : 0.6,
                  cursor: hasDateSelected ? 'pointer' : 'not-allowed'
                }}
              >
                <span>SEARCH BY DATE</span>
              </button>
            </Box>
          </Paper>

          {/* Goal Number Search Section */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              backgroundColor: mode === 'dark' ? 'rgba(12, 12, 12, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <SportsSoccer color="primary" />
              Search by Goal Number
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Know the exact goal number? Jump directly to any goal from 1 to 800.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                maxWidth: 400,
                mx: 'auto'
              }}
            >
              <TextField
                label="Goal Number (1-800)"
                type="number"
                value={goalNumber}
                onChange={handleGoalNumberChange}
                error={!!goalNumberError}
                helperText={goalNumberError}
                fullWidth
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
          </Paper>


        </Stack>
      </Container>
    </>
  );
};

export default MainPage;
