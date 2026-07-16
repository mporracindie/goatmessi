import React, { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Autocomplete,
  Box,
  Container,
  Link,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import { Clear, Home as HomeIcon, PlayArrow } from '@mui/icons-material';
import { useLocale } from '../context/LocaleContext';
import {
  filterGoals,
  filterOptions,
  GoalFilters,
  hasActiveFilters,
} from '../helpers/goals';
import { savePlaylist } from '../helpers/playlist';
import { TranslationKey } from '../i18n/translations';
import PageMeta from '../components/PageMeta';
import background from '../assets/messi_argentina_dark.jpg';
import { Goal } from '../types/Goal';

const panelBg = 'rgba(10, 12, 16, 0.72)';
const panelBorder = 'rgba(255, 255, 255, 0.08)';

type SortField = 'goalNumber' | 'date' | 'minute';
type SortDir = 'asc' | 'desc';

const parseGoalDate = (date: string) => {
  const [day, month, year] = date.split('-').map(Number);
  return new Date(year, month - 1, day).getTime();
};

const parseMinuteSort = (minute: number | string): number => {
  if (typeof minute === 'number' && Number.isFinite(minute)) return minute;
  if (typeof minute === 'string') {
    const match = minute.trim().match(/^(\d+)/);
    if (match) return Number(match[1]);
  }
  return -1;
};

const GoalsTable: React.FC = () => {
  const { t } = useLocale();
  const navigate = useNavigate();

  const [team, setTeam] = useState('');
  const [competition, setCompetition] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<string | null>(null);
  const [type, setType] = useState('');
  const [how, setHow] = useState('');
  const [year, setYear] = useState('');
  const [minuteMin, setMinuteMin] = useState('');
  const [minuteMax, setMinuteMax] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortField, setSortField] = useState<SortField>('goalNumber');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const translateMeta = (value?: string | null) => {
    if (!value) return '—';
    const key = `goalMeta.${value}` as TranslationKey;
    const translated = t(key);
    return translated === key ? value : translated;
  };

  const filters: GoalFilters = useMemo(() => {
    const parsedMinuteMin = minuteMin ? parseInt(minuteMin, 10) : NaN;
    const parsedMinuteMax = minuteMax ? parseInt(minuteMax, 10) : NaN;
    const parsedYear = year ? parseInt(year, 10) : NaN;

    return {
      team: team || undefined,
      competition: competition || undefined,
      opponent: opponent || undefined,
      type: type || undefined,
      how: how || undefined,
      year: !Number.isNaN(parsedYear) ? parsedYear : undefined,
      minuteMin: !Number.isNaN(parsedMinuteMin) ? parsedMinuteMin : undefined,
      minuteMax: !Number.isNaN(parsedMinuteMax) ? parsedMinuteMax : undefined,
    };
  }, [team, competition, opponent, type, how, year, minuteMin, minuteMax]);

  const filtered = useMemo(() => filterGoals(filters), [filters]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    const dir = sortDir === 'asc' ? 1 : -1;

    list.sort((a, b) => {
      if (sortField === 'goalNumber') {
        return (parseInt(a.goalNumber, 10) - parseInt(b.goalNumber, 10)) * dir;
      }
      if (sortField === 'date') {
        return (parseGoalDate(a.date) - parseGoalDate(b.date)) * dir;
      }
      return (parseMinuteSort(a.minute) - parseMinuteSort(b.minute)) * dir;
    });

    return list;
  }, [filtered, sortField, sortDir]);

  const pageRows = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const filtersActive = hasActiveFilters(filters);

  const clearFilters = () => {
    setTeam('');
    setCompetition(null);
    setOpponent(null);
    setType('');
    setHow('');
    setYear('');
    setMinuteMin('');
    setMinuteMax('');
    setPage(0);
  };

  const playFilteredFeed = () => {
    if (sorted.length === 0) return;
    savePlaylist(
      sorted.map((goal) => ({ goalNumber: goal.goalNumber, date: goal.date })),
      `${window.location.pathname}${window.location.search}`,
    );
    navigate('/feed?playlist=1');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir(field === 'date' ? 'desc' : 'asc');
    }
    setPage(0);
  };

  const onFilterChange = <T,>(setter: (value: T) => void) => {
    return (value: T) => {
      setter(value);
      setPage(0);
    };
  };

  const openGoal = (goal: Goal) => {
    navigate(`/goal/${parseInt(goal.goalNumber, 10)}`);
  };

  const cellSx = {
    color: 'inherit',
    borderColor: 'rgba(255,255,255,0.08)',
    whiteSpace: 'nowrap' as const,
    fontSize: '0.875rem',
  };

  const headCellSx = {
    ...cellSx,
    fontWeight: 700,
    backgroundColor: '#14181f',
    backgroundImage: 'linear-gradient(#14181f, #14181f)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 2,
  };

  return (
    <>
      <PageMeta
        title={t('seo.tableTitle')}
        description={t('seo.tableDescription')}
        path="/table"
      />
      <div className="background-overlay hero-backdrop">
        <img src={background} alt="Lionel Messi with Argentina" />
      </div>

      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 4, md: 5 },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          width: '100%',
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography component="p" className="hero-kicker">
            {t('table.kicker')}
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              fontSize: { xs: '2rem', sm: '2.6rem' },
              lineHeight: 1.1,
              mb: 1,
            }}
          >
            <span className="gradient-text">{sorted.length}</span>{' '}
            {t(sorted.length === 1 ? 'table.goalLabel' : 'table.goalsLabel')}
          </Typography>
          <Typography sx={{ opacity: 0.8, maxWidth: 520, mx: 'auto' }}>
            {t('table.subtitle')}
          </Typography>
        </Box>

        <Box
          sx={{
            width: '100%',
            borderRadius: 4,
            border: `1px solid ${panelBorder}`,
            backgroundColor: panelBg,
            backdropFilter: 'blur(14px)',
            p: { xs: 2, sm: 3 },
            boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
            mb: 2,
            textAlign: 'left',
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField
                select
                label={t('home.team')}
                size="small"
                value={team}
                onChange={(e) => onFilterChange(setTeam)(e.target.value)}
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
                onChange={(_e, value) => onFilterChange(setCompetition)(value)}
                renderInput={(params) => (
                  <TextField {...params} label={t('home.competition')} size="small" />
                )}
                fullWidth
              />
              <Autocomplete
                options={filterOptions.opponents}
                value={opponent}
                onChange={(_e, value) => onFilterChange(setOpponent)(value)}
                renderInput={(params) => (
                  <TextField {...params} label={t('home.opponent')} size="small" />
                )}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField
                select
                label={t('home.year')}
                size="small"
                value={year}
                onChange={(e) => onFilterChange(setYear)(e.target.value)}
                fullWidth
              >
                <MenuItem value="">{t('table.anyYear')}</MenuItem>
                {filterOptions.years.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label={t('home.goalType')}
                size="small"
                value={type}
                onChange={(e) => onFilterChange(setType)(e.target.value)}
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
                onChange={(e) => onFilterChange(setHow)(e.target.value)}
                fullWidth
              >
                <MenuItem value="">{t('home.any')}</MenuItem>
                {filterOptions.hows.map((option) => (
                  <MenuItem key={option} value={option}>
                    {translateMeta(option)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={t('home.minuteFrom')}
                type="number"
                size="small"
                value={minuteMin}
                onChange={(e) => onFilterChange(setMinuteMin)(e.target.value)}
                fullWidth
                inputProps={{ min: 1, max: 120 }}
              />
              <TextField
                label={t('home.minuteTo')}
                type="number"
                size="small"
                value={minuteMax}
                onChange={(e) => onFilterChange(setMinuteMax)(e.target.value)}
                fullWidth
                inputProps={{ min: 1, max: 120 }}
              />
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'stretch', sm: 'center' }}
            >
              {sorted.length > 0 && (
                <button
                  className="cta-secondary"
                  onClick={playFilteredFeed}
                  style={{ width: 'auto', minWidth: 140, padding: '6px 16px', fontSize: '0.85rem' }}
                >
                  <PlayArrow sx={{ fontSize: 16 }} />
                  {t('table.playFeed')}
                </button>
              )}
              {filtersActive && (
                <button
                  className="cta-ghost"
                  onClick={clearFilters}
                  style={{ width: 'auto', minWidth: 120, padding: '6px 16px', fontSize: '0.85rem' }}
                >
                  <Clear sx={{ fontSize: 16 }} />
                  {t('table.clearFilters')}
                </button>
              )}
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            width: '100%',
            borderRadius: 4,
            border: `1px solid ${panelBorder}`,
            backgroundColor: panelBg,
            backdropFilter: 'blur(14px)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
            overflow: 'hidden',
            mb: 3,
          }}
        >
          {sorted.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>{t('table.noGoalsFound')}</Typography>
              <Typography sx={{ opacity: 0.75, mb: 2 }}>{t('table.tryClearing')}</Typography>
              <button className="cta-ghost" onClick={clearFilters} style={{ width: 'auto' }}>
                <Clear fontSize="small" />
                {t('table.clearFilters')}
              </button>
            </Box>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: { xs: '60vh', md: '65vh' } }}>
                <Table stickyHeader size="small" aria-label={t('table.kicker')}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={headCellSx} sortDirection={sortField === 'goalNumber' ? sortDir : false}>
                        <TableSortLabel
                          active={sortField === 'goalNumber'}
                          direction={sortField === 'goalNumber' ? sortDir : 'asc'}
                          onClick={() => handleSort('goalNumber')}
                          sx={{ color: 'inherit !important', '& .MuiTableSortLabel-icon': { color: 'inherit !important' } }}
                        >
                          {t('table.colNumber')}
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={headCellSx} sortDirection={sortField === 'date' ? sortDir : false}>
                        <TableSortLabel
                          active={sortField === 'date'}
                          direction={sortField === 'date' ? sortDir : 'asc'}
                          onClick={() => handleSort('date')}
                          sx={{ color: 'inherit !important', '& .MuiTableSortLabel-icon': { color: 'inherit !important' } }}
                        >
                          {t('table.colDate')}
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={headCellSx}>{t('table.colTeam')}</TableCell>
                      <TableCell sx={headCellSx}>{t('table.colOpponent')}</TableCell>
                      <TableCell sx={headCellSx}>{t('table.colCompetition')}</TableCell>
                      <TableCell sx={headCellSx} sortDirection={sortField === 'minute' ? sortDir : false}>
                        <TableSortLabel
                          active={sortField === 'minute'}
                          direction={sortField === 'minute' ? sortDir : 'asc'}
                          onClick={() => handleSort('minute')}
                          sx={{ color: 'inherit !important', '& .MuiTableSortLabel-icon': { color: 'inherit !important' } }}
                        >
                          {t('table.colMinute')}
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={headCellSx}>{t('table.colResult')}</TableCell>
                      <TableCell sx={headCellSx}>{t('table.colScore')}</TableCell>
                      <TableCell sx={headCellSx}>{t('table.colType')}</TableCell>
                      <TableCell sx={headCellSx}>{t('table.colHow')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pageRows.map((goal) => (
                      <TableRow
                        key={goal.goalNumber}
                        hover
                        onClick={() => openGoal(goal)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'rgba(31, 195, 231, 0.08)' },
                        }}
                      >
                        <TableCell sx={{ ...cellSx, fontWeight: 700 }}>
                          <Link
                            component={RouterLink}
                            to={`/goal/${parseInt(goal.goalNumber, 10)}`}
                            onClick={(e) => e.stopPropagation()}
                            underline="hover"
                            sx={{ color: '#1fc3e7', fontWeight: 700 }}
                          >
                            {parseInt(goal.goalNumber, 10)}
                          </Link>
                        </TableCell>
                        <TableCell sx={cellSx}>{goal.date}</TableCell>
                        <TableCell sx={cellSx}>{goal.team}</TableCell>
                        <TableCell sx={cellSx}>{goal.opponent}</TableCell>
                        <TableCell sx={{ ...cellSx, whiteSpace: 'normal', minWidth: 140 }}>
                          {goal.competition}
                        </TableCell>
                        <TableCell sx={cellSx}>{goal.minute}</TableCell>
                        <TableCell sx={cellSx}>{goal.result || '—'}</TableCell>
                        <TableCell sx={cellSx}>{goal.scoreAtGoal || '—'}</TableCell>
                        <TableCell sx={cellSx}>{translateMeta(goal.type)}</TableCell>
                        <TableCell sx={cellSx}>{translateMeta(goal.how)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={sorted.length}
                page={page}
                onPageChange={(_e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[25, 50, 100]}
                labelRowsPerPage={t('table.rowsPerPage')}
                sx={{
                  color: 'inherit',
                  borderTop: `1px solid ${panelBorder}`,
                  '.MuiTablePagination-selectIcon': { color: 'inherit' },
                  '.MuiIconButton-root': { color: 'inherit' },
                  '.Mui-disabled': { color: 'rgba(255,255,255,0.3) !important' },
                }}
              />
            </>
          )}
        </Box>

        <Stack direction="row" justifyContent="center">
          <button className="cta-ghost" onClick={() => navigate('/')}>
            <HomeIcon fontSize="small" />
            {t('table.backHome')}
          </button>
        </Stack>
      </Container>
    </>
  );
};

export default GoalsTable;
