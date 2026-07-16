import React from 'react';
import { useLocale } from '../context/LocaleContext';
import {
  Autocomplete,
  Box,
  Container,
  Typography,
  TextField,
  Stack,
  Divider,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { filterOptions, getRandomGoal, LAST_GOAL } from '../helpers/goals';
import { buildWebsiteJsonLd, homeMeta } from '../helpers/seo';
import background from '../assets/messi_argentina_dark.jpg';
import { CalendarMonth, FilterList, PlayArrow, SportsSoccer, Tag } from '@mui/icons-material';
import { TranslationKey } from '../i18n/translations';
import PageMeta from '../components/PageMeta';

type DateType = {
  day: Dayjs | null;
  month: Dayjs | null;
  year: Dayjs | null;
};

const panelBg = 'rgba(10, 12, 16, 0.72)';
const panelBorder = 'rgba(255, 255, 255, 0.08)';

const MainPage: React.FC = () => {
  const { locale, t } = useLocale();
  const meta = homeMeta(locale);
  const [date, setDate] = React.useState<DateType>({
    day: null,
    month: null,
    year: null,
  });
  const [team, setTeam] = React.useState('');
  const [competition, setCompetition] = React.useState<string | null>(null);
  const [opponent, setOpponent] = React.useState<string | null>(null);
  const [type, setType] = React.useState('');
  const [how, setHow] = React.useState('');
  const [goalNumber, setGoalNumber] = React.useState<string>('');
  const [goalNumberError, setGoalNumberError] = React.useState<string>('');

  const translateMeta = (value: string) => {
    const key = `goalMeta.${value}` as TranslationKey;
    const translated = t(key);
    return translated === key ? value : translated;
  };

  const stats = [
    { value: String(LAST_GOAL), label: t('home.statGoals') },
    { value: '18', label: t('home.statSeasons') },
    { value: '2005–26', label: t('home.statEra') },
  ];

  const handleDateChange = (key: keyof DateType) => (newValue: Dayjs | null) => {
    setDate((prevDate) => ({
      ...prevDate,
      [key]: newValue,
    }));
  };

  const handleGoalNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoalNumber(event.target.value);
    setGoalNumberError('');
  };

  const handleGoalSearch = () => {
    const params = new URLSearchParams();
    const day = date.day?.format('DD');
    const month = date.month?.format('MM');
    const year = date.year?.format('YYYY');

    if (day) params.set('day', day);
    if (month) params.set('month', month);
    if (year) params.set('year', year);
    if (team) params.set('team', team);
    if (competition) params.set('competition', competition);
    if (opponent) params.set('opponent', opponent);
    if (type) params.set('type', type);
    if (how) params.set('how', how);

    if ([...params.keys()].length === 0) {
      return;
    }

    window.location.href = `/search?${params.toString()}`;
  };

  const redirectToRandomGoal = () => {
    window.location.href = `/goal/${getRandomGoal()}`;
  };

  const handleGoalNumberSearch = () => {
    const num = parseInt(goalNumber);
    if (isNaN(num)) {
      setGoalNumberError(t('home.invalidNumber'));
      return;
    }
    if (num < 1 || num > LAST_GOAL) {
      setGoalNumberError(t('home.numberOutOfRange', { max: LAST_GOAL }));
      return;
    }
    window.location.href = `/goal/${num}`;
  };

  const hasSearchFilters = Boolean(
    date.day || date.month || date.year || team || competition || opponent || type || how,
  );

  return (
    <>
      <PageMeta {...meta} jsonLd={buildWebsiteJsonLd()} />
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
          justifyContent: { xs: 'flex-start', md: 'center' },
        }}
      >
        <Box textAlign="center" mb={{ xs: 4, md: 5 }}>
          <Typography component="p" className="hero-kicker">
            {t('home.kicker')}
          </Typography>

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              mb: 2,
              fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
            }}
          >
            {t('home.headlineGoals', { count: LAST_GOAL })}
            <br />
            <span className="gradient-text">{t('home.headlineGoat')}</span>
          </Typography>

          <Typography
            sx={{
              mb: 3,
              opacity: 0.85,
              maxWidth: 520,
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.1rem' },
            }}
          >
            {t('home.subtitle')}
          </Typography>

          <Stack
            direction="row"
            spacing={0}
            justifyContent="center"
            divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.25)', my: 0.5 }} />}
            sx={{ mb: 4 }}
          >
            {stats.map((stat) => (
              <Box key={stat.label} sx={{ px: { xs: 2.5, sm: 4 } }}>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.4rem', sm: '1.7rem' }, lineHeight: 1.1 }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.7 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
            <button className="cta-primary" onClick={redirectToRandomGoal}>
              <PlayArrow fontSize="small" />
              {t('home.watchRandom')}
            </button>
            <button className="cta-ghost" onClick={() => (window.location.href = '/feed')}>
              <SportsSoccer fontSize="small" />
              {t('home.browseFeed')}
            </button>
          </Stack>
        </Box>

        <Box
          sx={{
            borderRadius: 4,
            border: `1px solid ${panelBorder}`,
            backgroundColor: panelBg,
            backdropFilter: 'blur(14px)',
            p: { xs: 3, sm: 4 },
            boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
            color: 'text.primary',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', mb: 0.5 }}>
            {t('home.finderTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
            {t('home.finderSubtitle')}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="overline"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.75, letterSpacing: '0.12em', opacity: 0.8, mb: 1.5 }}
            >
              <CalendarMonth sx={{ fontSize: 16 }} color="primary" />
              {t('home.byDate')}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <DatePicker
                label={t('home.day')}
                views={['day']}
                value={date.day}
                onChange={handleDateChange('day')}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
              <DatePicker
                label={t('home.month')}
                views={['month']}
                value={date.month}
                onChange={handleDateChange('month')}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
              <DatePicker
                label={t('home.year')}
                views={['year']}
                value={date.year}
                onChange={handleDateChange('year')}
                disableFuture
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Stack>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="overline"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.75, letterSpacing: '0.12em', opacity: 0.8, mb: 1.5 }}
            >
              <FilterList sx={{ fontSize: 16 }} color="primary" />
              {t('home.byMatchDetails')}
            </Typography>
            <Stack spacing={1.5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <TextField
                  select
                  label={t('home.team')}
                  size="small"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">{t('home.anyTeam')}</MenuItem>
                  {filterOptions.teams.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <Autocomplete
                  options={filterOptions.competitions}
                  value={competition}
                  onChange={(_e, value) => setCompetition(value)}
                  renderInput={(params) => <TextField {...params} label={t('home.competition')} size="small" />}
                  fullWidth
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Autocomplete
                  options={filterOptions.opponents}
                  value={opponent}
                  onChange={(_e, value) => setOpponent(value)}
                  renderInput={(params) => <TextField {...params} label={t('home.opponent')} size="small" />}
                  fullWidth
                />
                <TextField
                  select
                  label={t('home.goalType')}
                  size="small"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">{t('home.anyType')}</MenuItem>
                  {filterOptions.types.map((option) => (
                    <MenuItem key={option} value={option}>
                      {translateMeta(option)}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label={t('home.scoredWith')}
                  size="small"
                  value={how}
                  onChange={(e) => setHow(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">{t('home.any')}</MenuItem>
                  {filterOptions.hows.map((option) => (
                    <MenuItem key={option} value={option}>
                      {translateMeta(option)}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>
          </Box>

          <button className="cta-secondary" onClick={handleGoalSearch} disabled={!hasSearchFilters}>
            {t('home.searchGoals')}
          </button>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography
              variant="overline"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.75, letterSpacing: '0.12em', opacity: 0.8, mb: 1.5 }}
            >
              <Tag sx={{ fontSize: 16 }} color="primary" />
              {t('home.byGoalNumber')}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'flex-start' }}>
              <TextField
                label={t('home.goalNumberLabel', { max: LAST_GOAL })}
                type="number"
                size="small"
                value={goalNumber}
                onChange={handleGoalNumberChange}
                error={!!goalNumberError}
                helperText={goalNumberError}
                fullWidth
                inputProps={{ min: 1, max: LAST_GOAL }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleGoalNumberSearch();
                  }
                }}
              />
              <button
                className="cta-secondary"
                onClick={handleGoalNumberSearch}
                disabled={!goalNumber}
                style={{ width: 'auto', minWidth: 140, flexShrink: 0 }}
              >
                {t('home.goToGoal')}
              </button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default MainPage;
