import React, { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowUp, ArrowUpDown, Home, Play, X } from 'lucide-react';
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
import ClearableField from '../components/ClearableField';
import background from '../assets/messi_argentina_dark.jpg';
import { Goal } from '../types/Goal';
import { Combobox } from '../components/ui/combobox';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { cn } from '../lib/utils';

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

const SortIcon: React.FC<{ active: boolean; dir: SortDir }> = ({ active, dir }) => {
  if (!active) return <ArrowUpDown className="size-3.5 opacity-50" />;
  return dir === 'asc' ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />;
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
  const pageCount = Math.max(1, Math.ceil(sorted.length / rowsPerPage));

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

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-stretch px-4 py-8 md:py-10">
        <div className="mb-6 text-center">
          <p className="hero-kicker">{t('table.kicker')}</p>
          <h1 className="mb-2 text-[2rem] leading-tight font-extrabold tracking-tight sm:text-[2.6rem]">
            <span className="gradient-text">{sorted.length}</span>{' '}
            {t(sorted.length === 1 ? 'table.goalLabel' : 'table.goalsLabel')}
          </h1>
          <p className="mx-auto max-w-[520px] opacity-80">{t('table.subtitle')}</p>
        </div>

        <div
          className="relative z-20 mb-4 w-full overflow-visible rounded-2xl border p-4 text-left shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[14px] sm:p-6"
          style={{ borderColor: panelBorder, backgroundColor: panelBg }}
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="w-full space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t('home.team')}</Label>
                <ClearableField
                  hasValue={Boolean(team)}
                  onClear={() => onFilterChange(setTeam)('')}
                  trailing="select"
                  clearLabel={t('common.clear')}
                >
                  <Select value={team || undefined} onValueChange={onFilterChange(setTeam)}>
                    <SelectTrigger className={cn('w-full', team && 'pr-14')}>
                      <SelectValue placeholder={t('home.anyTeam')} />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.teams.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ClearableField>
              </div>
              <div className="w-full space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t('home.competition')}</Label>
                <Combobox
                  options={filterOptions.competitions}
                  value={competition}
                  onChange={onFilterChange(setCompetition)}
                  placeholder={t('home.competition')}
                  clearLabel={t('common.clear')}
                />
              </div>
              <div className="w-full space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t('home.opponent')}</Label>
                <Combobox
                  options={filterOptions.opponents}
                  value={opponent}
                  onChange={onFilterChange(setOpponent)}
                  placeholder={t('home.opponent')}
                  clearLabel={t('common.clear')}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="w-full space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t('home.year')}</Label>
                <ClearableField
                  hasValue={Boolean(year)}
                  onClear={() => onFilterChange(setYear)('')}
                  trailing="select"
                  clearLabel={t('common.clear')}
                >
                  <Select value={year || undefined} onValueChange={onFilterChange(setYear)}>
                    <SelectTrigger className={cn('w-full', year && 'pr-14')}>
                      <SelectValue placeholder={t('table.anyYear')} />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.years.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ClearableField>
              </div>
              <div className="w-full space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t('home.goalType')}</Label>
                <ClearableField
                  hasValue={Boolean(type)}
                  onClear={() => onFilterChange(setType)('')}
                  trailing="select"
                  clearLabel={t('common.clear')}
                >
                  <Select value={type || undefined} onValueChange={onFilterChange(setType)}>
                    <SelectTrigger className={cn('w-full', type && 'pr-14')}>
                      <SelectValue placeholder={t('home.anyType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.types.map((option) => (
                        <SelectItem key={option} value={option}>
                          {translateMeta(option)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ClearableField>
              </div>
              <div className="w-full space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t('home.scoredWith')}</Label>
                <ClearableField
                  hasValue={Boolean(how)}
                  onClear={() => onFilterChange(setHow)('')}
                  trailing="select"
                  clearLabel={t('common.clear')}
                >
                  <Select value={how || undefined} onValueChange={onFilterChange(setHow)}>
                    <SelectTrigger className={cn('w-full', how && 'pr-14')}>
                      <SelectValue placeholder={t('home.any')} />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.hows.map((option) => (
                        <SelectItem key={option} value={option}>
                          {translateMeta(option)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ClearableField>
              </div>
              <div className="w-full space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t('home.minuteFrom')}</Label>
                <ClearableField
                  hasValue={Boolean(minuteMin)}
                  onClear={() => onFilterChange(setMinuteMin)('')}
                  clearLabel={t('common.clear')}
                >
                  <Input
                    type="number"
                    min={1}
                    max={120}
                    value={minuteMin}
                    onChange={(e) => onFilterChange(setMinuteMin)(e.target.value)}
                    className={cn(minuteMin && 'pr-8')}
                  />
                </ClearableField>
              </div>
              <div className="w-full space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t('home.minuteTo')}</Label>
                <ClearableField
                  hasValue={Boolean(minuteMax)}
                  onClear={() => onFilterChange(setMinuteMax)('')}
                  clearLabel={t('common.clear')}
                >
                  <Input
                    type="number"
                    min={1}
                    max={120}
                    value={minuteMax}
                    onChange={(e) => onFilterChange(setMinuteMax)(e.target.value)}
                    className={cn(minuteMax && 'pr-8')}
                  />
                </ClearableField>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              {sorted.length > 0 && (
                <button
                  className="cta-secondary"
                  onClick={playFilteredFeed}
                  style={{ width: 'auto', minWidth: 140, padding: '6px 16px', fontSize: '0.85rem' }}
                >
                  <Play className="size-4" />
                  {t('table.playFeed')}
                </button>
              )}
              {filtersActive && (
                <button
                  className="cta-ghost"
                  onClick={clearFilters}
                  style={{ width: 'auto', minWidth: 120, padding: '6px 16px', fontSize: '0.85rem' }}
                >
                  <X className="size-4" />
                  {t('table.clearFilters')}
                </button>
              )}
            </div>
          </div>
        </div>

        <div
          className="relative z-0 mb-6 w-full overflow-hidden rounded-2xl border shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[14px]"
          style={{ borderColor: panelBorder, backgroundColor: panelBg }}
        >
          {sorted.length === 0 ? (
            <div className="p-8 text-center">
              <p className="mb-1 font-bold">{t('table.noGoalsFound')}</p>
              <p className="mb-4 opacity-75">{t('table.tryClearing')}</p>
              <button className="cta-ghost" onClick={clearFilters} style={{ width: 'auto' }}>
                <X className="size-4" />
                {t('table.clearFilters')}
              </button>
            </div>
          ) : (
            <>
              <div className="max-h-[60vh] overflow-auto md:max-h-[65vh]">
                <Table aria-label={t('table.kicker')}>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      {(
                        [
                          { field: 'goalNumber' as const, label: t('table.colNumber'), sortable: true },
                          { field: 'date' as const, label: t('table.colDate'), sortable: true },
                          { field: null, label: t('table.colTeam'), sortable: false },
                          { field: null, label: t('table.colOpponent'), sortable: false },
                          { field: null, label: t('table.colCompetition'), sortable: false },
                          { field: 'minute' as const, label: t('table.colMinute'), sortable: true },
                          { field: null, label: t('table.colResult'), sortable: false },
                          { field: null, label: t('table.colScore'), sortable: false },
                          { field: null, label: t('table.colType'), sortable: false },
                          { field: null, label: t('table.colHow'), sortable: false },
                        ] as const
                      ).map((col) => (
                        <TableHead
                          key={col.label}
                          className="sticky top-0 z-[2] bg-[#14181f] text-foreground"
                        >
                          {col.sortable && col.field ? (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 font-bold hover:text-primary"
                              onClick={() => handleSort(col.field)}
                            >
                              {col.label}
                              <SortIcon active={sortField === col.field} dir={sortDir} />
                            </button>
                          ) : (
                            <span className="font-bold">{col.label}</span>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((goal) => (
                      <TableRow
                        key={goal.goalNumber}
                        className="cursor-pointer hover:bg-[rgba(31,195,231,0.08)]"
                        onClick={() => openGoal(goal)}
                      >
                        <TableCell className="font-bold whitespace-nowrap">
                          <RouterLink
                            to={`/goal/${parseInt(goal.goalNumber, 10)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-bold text-primary hover:underline"
                          >
                            {parseInt(goal.goalNumber, 10)}
                          </RouterLink>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{goal.date}</TableCell>
                        <TableCell className="whitespace-nowrap">{goal.team}</TableCell>
                        <TableCell className="whitespace-nowrap">{goal.opponent}</TableCell>
                        <TableCell className="min-w-[140px]">{goal.competition}</TableCell>
                        <TableCell className="whitespace-nowrap">{goal.minute}</TableCell>
                        <TableCell className="whitespace-nowrap">{goal.result || '—'}</TableCell>
                        <TableCell className="whitespace-nowrap">{goal.scoreAtGoal || '—'}</TableCell>
                        <TableCell className="whitespace-nowrap">{translateMeta(goal.type)}</TableCell>
                        <TableCell className="whitespace-nowrap">{translateMeta(goal.how)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div
                className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 text-sm sm:flex-row"
                style={{ borderColor: panelBorder }}
              >
                <div className="flex items-center gap-2">
                  <span className="opacity-80">{t('table.rowsPerPage')}</span>
                  <Select
                    value={String(rowsPerPage)}
                    onValueChange={(value) => {
                      setRowsPerPage(parseInt(value, 10));
                      setPage(0);
                    }}
                  >
                    <SelectTrigger className="h-8 w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[25, 50, 100].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="opacity-80">
                    {page * rowsPerPage + 1}–
                    {Math.min((page + 1) * rowsPerPage, sorted.length)} / {sorted.length}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className={cn(page === 0 && 'opacity-40')}
                  >
                    ‹
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= pageCount - 1}
                    onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                    className={cn(page >= pageCount - 1 && 'opacity-40')}
                  >
                    ›
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center">
          <button className="cta-ghost" onClick={() => navigate('/')}>
            <Home className="size-4" />
            {t('table.backHome')}
          </button>
        </div>
      </div>
    </>
  );
};

export default GoalsTable;
