import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { Container, Typography, Box, ToggleButton, ToggleButtonGroup, Stack } from '@mui/material';
import { PlayArrow, Home as HomeIcon } from '@mui/icons-material';
import { getRandomGoal, hasActiveFilters, searchGoals } from '../helpers/goals';
import { savePlaylist } from '../helpers/playlist';
import background from '../assets/messi_argentina_dark.jpg';
import SearchGridApp from '../components/SearchGridApp';
import { getSpecialDateMessage } from '../helpers/specialDates';
import { TranslationKey } from '../i18n/translations';
import PageMeta from '../components/PageMeta';

const panelBg = 'rgba(10, 12, 16, 0.72)';
const panelBorder = 'rgba(255, 255, 255, 0.08)';
const specialColor = '#FFD700';

const Search: React.FC = () => {
  const { locale, t } = useLocale();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'number' | 'date'>('number');

  const params = new URLSearchParams(window.location.search);
  const day = params.get('day');
  const month = params.get('month');
  const year = params.get('year');
  const team = params.get('team') || undefined;
  const competition = params.get('competition') || undefined;
  const opponent = params.get('opponent') || undefined;
  const type = params.get('type') || undefined;
  const how = params.get('how') || undefined;
  const minuteMinParam = params.get('minuteMin');
  const minuteMaxParam = params.get('minuteMax');

  const dayNumber = day ? parseInt(day, 10) : undefined;
  const monthNumber = month ? parseInt(month, 10) : undefined;
  const yearNumber = year ? parseInt(year, 10) : undefined;
  const minuteMin = minuteMinParam ? parseInt(minuteMinParam, 10) : undefined;
  const minuteMax = minuteMaxParam ? parseInt(minuteMaxParam, 10) : undefined;
  const minuteMinNumber = minuteMin !== undefined && !Number.isNaN(minuteMin) ? minuteMin : undefined;
  const minuteMaxNumber = minuteMax !== undefined && !Number.isNaN(minuteMax) ? minuteMax : undefined;

  const filters = {
    day: dayNumber,
    month: monthNumber,
    year: yearNumber,
    team,
    competition,
    opponent,
    type,
    how,
    minuteMin: minuteMinNumber,
    minuteMax: minuteMaxNumber,
  };

  if (!hasActiveFilters(filters)) {
    window.location.href = '/';
  }

  const goalsData = searchGoals(filters);

  const translateMeta = (value?: string) => {
    if (!value) return value;
    const key = `goalMeta.${value}` as TranslationKey;
    const translated = t(key);
    return translated === key ? value : translated;
  };

  const minuteSummary =
    minuteMinNumber !== undefined && minuteMaxNumber !== undefined
      ? minuteMinNumber === minuteMaxNumber
        ? t('search.minuteExact', { value: minuteMinNumber })
        : t('search.minuteRange', { min: minuteMinNumber, max: minuteMaxNumber })
      : minuteMinNumber !== undefined
        ? t('search.minuteFrom', { value: minuteMinNumber })
        : minuteMaxNumber !== undefined
          ? t('search.minuteTo', { value: minuteMaxNumber })
          : null;

  const filterSummary = [
    dayNumber && monthNumber && yearNumber
      ? `${String(dayNumber).padStart(2, '0')}-${String(monthNumber).padStart(2, '0')}-${yearNumber}`
      : [
          dayNumber && t('search.day', { value: dayNumber }),
          monthNumber && t('search.month', { value: monthNumber }),
          yearNumber && t('search.year', { value: yearNumber }),
        ]
          .filter(Boolean)
          .join(', '),
    team,
    competition,
    opponent && t('search.vs', { opponent }),
    translateMeta(type),
    translateMeta(how),
    minuteSummary,
  ]
    .filter(Boolean)
    .join(' · ');

  const goals = useMemo(() => {
    const sortedGoals = [...goalsData];
    if (sortBy === 'number') {
      sortedGoals.sort((a, b) => parseInt(a.goalNumber) - parseInt(b.goalNumber));
    } else {
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
  const specialDateMessage = getSpecialDateMessage(dayNumber, monthNumber, yearNumber, locale);

  const handleSortChange = (_event: React.MouseEvent<HTMLElement>, newSortBy: 'number' | 'date') => {
    if (newSortBy !== null) {
      setSortBy(newSortBy);
    }
  };

  const redirectToRandomGoal = () => {
    window.location.href = `/goal/${getRandomGoal()}`;
  };

  const playAllResults = () => {
    savePlaylist(
      goals.map((goal) => ({ goalNumber: goal.goalNumber, date: goal.date })),
      `${window.location.pathname}${window.location.search}`,
    );
    navigate('/feed?playlist=1');
  };

  return (
    <>
      <PageMeta
        title={t('seo.searchTitle')}
        description={t('seo.searchDescription')}
        path={`/search${window.location.search}`}
        noindex
      />
      <div className="background-overlay hero-backdrop">
        <img src={background} alt="Lionel Messi with Argentina" />
      </div>

      <Container
        maxWidth="md"
        sx={{
          py: { xs: 4, md: 6 },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {isMessisBirthday && (
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.8rem', sm: '2.4rem' },
              mb: 2,
              color: specialColor,
            }}
          >
            {t('search.happyBirthday')}
          </Typography>
        )}

        {goals.length === 0 ? (
          <Box
            sx={{
              width: '100%',
              borderRadius: 4,
              border: `1px solid ${panelBorder}`,
              backgroundColor: panelBg,
              backdropFilter: 'blur(14px)',
              p: { xs: 3, sm: 4 },
              boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
            }}
          >
            <Typography component="p" className="hero-kicker">
              {t('search.kicker')}
            </Typography>
            {specialDateMessage && (
              <Typography
                sx={{
                  mb: 1.5,
                  color: specialColor,
                  fontWeight: 700,
                }}
              >
                🎉 {specialDateMessage}
              </Typography>
            )}
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontSize: { xs: '2rem', sm: '2.6rem' },
                lineHeight: 1.1,
                mb: 1.5,
              }}
            >
              {t('search.noGoalsFound')}
            </Typography>
            {filterSummary && (
              <Typography sx={{ opacity: 0.85, maxWidth: 480, mx: 'auto' }}>{filterSummary}</Typography>
            )}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 3 }}
            >
              <button className="cta-ghost" onClick={() => (window.location.href = '/')}>
                <HomeIcon fontSize="small" />
                {t('search.searchAgain')}
              </button>
              <button className="cta-primary" onClick={redirectToRandomGoal}>
                <PlayArrow fontSize="small" />
                {t('search.random')}
              </button>
            </Stack>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: { xs: 3, md: 4 }, width: '100%' }}>
              <Typography component="p" className="hero-kicker">
                {t('search.kicker')}
              </Typography>
              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '2.2rem', sm: '3rem' },
                  lineHeight: 1.1,
                  mb: 1.5,
                }}
              >
                <span className="gradient-text">{goals.length}</span>{' '}
                {t(goals.length === 1 ? 'search.goalLabel' : 'search.goalsLabel')}
              </Typography>
              {filterSummary && (
                <Typography sx={{ opacity: 0.85, mb: specialDateMessage ? 1.5 : 0, maxWidth: 520, mx: 'auto' }}>
                  {filterSummary}
                </Typography>
              )}
              {specialDateMessage && (
                <Typography sx={{ color: specialColor, fontWeight: 700 }}>🎉 {specialDateMessage}</Typography>
              )}
            </Box>

            <Box
              sx={{
                width: '100%',
                borderRadius: 4,
                border: `1px solid ${panelBorder}`,
                backgroundColor: panelBg,
                backdropFilter: 'blur(14px)',
                p: { xs: 2.5, sm: 3.5 },
                boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
                mb: 3,
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                justifyContent="center"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <ToggleButtonGroup
                  value={sortBy}
                  exclusive
                  onChange={handleSortChange}
                  aria-label={t('search.sortBy')}
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      color: 'inherit',
                      borderColor: 'rgba(255,255,255,0.25)',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2,
                      '&.Mui-selected': {
                        color: '#06131a',
                        bgcolor: '#1fc3e7',
                        borderColor: '#1fc3e7',
                        '&:hover': {
                          bgcolor: '#4fd8f5',
                        },
                      },
                    },
                  }}
                >
                  <ToggleButton value="number" aria-label={t('search.sortByNumber')}>
                    {t('search.sortByNumber')}
                  </ToggleButton>
                  <ToggleButton value="date" aria-label={t('search.sortByDate')}>
                    {t('search.sortByDate')}
                  </ToggleButton>
                </ToggleButtonGroup>

                {goals.length > 1 && (
                  <button
                    className="cta-secondary"
                    onClick={playAllResults}
                    style={{ width: 'auto', minWidth: 120, padding: '6px 16px', fontSize: '0.85rem' }}
                  >
                    <PlayArrow sx={{ fontSize: 16 }} />
                    {t('search.viewAll')}
                  </button>
                )}
              </Stack>

              <SearchGridApp goals={goals} />
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
              <button className="cta-ghost" onClick={() => (window.location.href = '/')}>
                <HomeIcon fontSize="small" />
                {t('search.searchAgain')}
              </button>
              {goals.length > 1 ? (
                <button className="cta-primary" onClick={playAllResults}>
                  <PlayArrow fontSize="small" />
                  {t('search.viewAll')}
                </button>
              ) : (
                <button className="cta-primary" onClick={redirectToRandomGoal}>
                  <PlayArrow fontSize="small" />
                  {t('search.random')}
                </button>
              )}
            </Stack>
          </>
        )}
      </Container>
    </>
  );
};

export default Search;
