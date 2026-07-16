import React from 'react';
import { useLocale } from '../context/LocaleContext';
import { filterOptions, getRandomGoal, LAST_GOAL } from '../helpers/goals';
import { buildWebsiteJsonLd, homeMeta } from '../helpers/seo';
import background from '../assets/messi_argentina_dark.jpg';
import { Calendar, Filter, Play, Goal, TableProperties, Hash } from 'lucide-react';
import { TranslationKey } from '../i18n/translations';
import PageMeta from '../components/PageMeta';
import ClearableField from '../components/ClearableField';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Combobox } from '../components/ui/combobox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { cn } from '../lib/utils';

const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

const monthLabel = (monthValue: string, locale: string) => {
  const name = new Intl.DateTimeFormat(locale, { month: 'long' }).format(
    new Date(2000, Number(monthValue) - 1, 1),
  );
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  return `${monthValue} · ${capitalized}`;
};

const MainPage: React.FC = () => {
  const { locale, t } = useLocale();
  const meta = homeMeta(locale);
  const [day, setDay] = React.useState('');
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('');
  const [team, setTeam] = React.useState('');
  const [competition, setCompetition] = React.useState<string | null>(null);
  const [opponent, setOpponent] = React.useState<string | null>(null);
  const [type, setType] = React.useState('');
  const [how, setHow] = React.useState('');
  const [minuteMin, setMinuteMin] = React.useState('');
  const [minuteMax, setMinuteMax] = React.useState('');
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

  const handleGoalNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoalNumber(event.target.value.replace(/\D/g, ''));
    setGoalNumberError('');
  };

  const handleGoalSearch = () => {
    const params = new URLSearchParams();

    if (day) params.set('day', day);
    if (month) params.set('month', month);
    if (year) params.set('year', year);
    if (team) params.set('team', team);
    if (competition) params.set('competition', competition);
    if (opponent) params.set('opponent', opponent);
    if (type) params.set('type', type);
    if (how) params.set('how', how);

    const parsedMinuteMin = minuteMin ? parseInt(minuteMin, 10) : NaN;
    const parsedMinuteMax = minuteMax ? parseInt(minuteMax, 10) : NaN;
    if (!Number.isNaN(parsedMinuteMin)) params.set('minuteMin', String(parsedMinuteMin));
    if (!Number.isNaN(parsedMinuteMax)) params.set('minuteMax', String(parsedMinuteMax));

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
    day || month || year || team || competition || opponent || type || how || minuteMin || minuteMax,
  );

  return (
    <>
      <PageMeta {...meta} jsonLd={buildWebsiteJsonLd()} />
      <div className="background-overlay hero-backdrop">
        <img src={background} alt="Lionel Messi with Argentina" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-start px-4 py-8 md:justify-center md:py-12">
        <div className="mb-8 text-center md:mb-10">
          <p className="hero-kicker">{t('home.kicker')}</p>

          <h1 className="mb-4 text-[2.4rem] leading-[1.05] font-extrabold tracking-tight sm:text-[3.2rem] md:text-[3.8rem]">
            {t('home.headlineGoals', { count: LAST_GOAL })}
            <br />
            <span className="gradient-text">{t('home.headlineGoat')}</span>
          </h1>

          <p className="mx-auto mb-6 max-w-[520px] text-base opacity-85 sm:text-lg">{t('home.subtitle')}</p>

          <div className="mb-8 flex items-stretch justify-center">
            {stats.map((stat, index) => (
              <React.Fragment key={stat.label}>
                {index > 0 && <Separator orientation="vertical" className="my-1 bg-white/25" />}
                <div className="px-5 sm:px-8">
                  <div className="text-[1.4rem] leading-tight font-extrabold sm:text-[1.7rem]">{stat.value}</div>
                  <div className="text-xs tracking-[0.12em] uppercase opacity-70">{stat.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="cta-primary" onClick={redirectToRandomGoal}>
              <Play className="size-4" />
              {t('home.watchRandom')}
            </button>
            <button className="cta-ghost" onClick={() => (window.location.href = '/feed')}>
              <Goal className="size-4" />
              {t('home.browseFeed')}
            </button>
            <button className="cta-ghost" onClick={() => (window.location.href = '/table')}>
              <TableProperties className="size-4" />
              {t('home.browseTable')}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[rgba(10,12,16,0.72)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[14px] sm:p-8">
          <h2 className="mb-1 text-center text-lg font-bold">{t('home.finderTitle')}</h2>
          <p className="mb-6 text-center text-sm text-muted-foreground">{t('home.finderSubtitle')}</p>

          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-[0.12em] uppercase opacity-80">
              <Calendar className="size-4 text-primary" />
              {t('home.byDate')}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="w-full space-y-1.5 text-left">
                <Label className="text-xs text-muted-foreground">{t('home.day')}</Label>
                <ClearableField
                  hasValue={Boolean(day)}
                  onClear={() => setDay('')}
                  trailing="select"
                  clearLabel={t('common.clear')}
                >
                  <Select value={day || undefined} onValueChange={setDay}>
                    <SelectTrigger className={cn('w-full', day && 'pr-14')}>
                      <SelectValue placeholder={t('home.day')} />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ClearableField>
              </div>
              <div className="w-full space-y-1.5 text-left">
                <Label className="text-xs text-muted-foreground">{t('home.month')}</Label>
                <ClearableField
                  hasValue={Boolean(month)}
                  onClear={() => setMonth('')}
                  trailing="select"
                  clearLabel={t('common.clear')}
                >
                  <Select value={month || undefined} onValueChange={setMonth}>
                    <SelectTrigger className={cn('w-full', month && 'pr-14')}>
                      <SelectValue placeholder={t('home.month')} />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m} value={m}>
                          {monthLabel(m, locale)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ClearableField>
              </div>
              <div className="w-full space-y-1.5 text-left">
                <Label className="text-xs text-muted-foreground">{t('home.year')}</Label>
                <ClearableField
                  hasValue={Boolean(year)}
                  onClear={() => setYear('')}
                  trailing="select"
                  clearLabel={t('common.clear')}
                >
                  <Select value={year || undefined} onValueChange={setYear}>
                    <SelectTrigger className={cn('w-full', year && 'pr-14')}>
                      <SelectValue placeholder={t('home.year')} />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.years.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ClearableField>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-[0.12em] uppercase opacity-80">
              <Filter className="size-4 text-primary" />
              {t('home.byMatchDetails')}
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="w-full space-y-1.5 text-left">
                  <Label className="text-xs text-muted-foreground">{t('home.team')}</Label>
                  <ClearableField
                    hasValue={Boolean(team)}
                    onClear={() => setTeam('')}
                    trailing="select"
                    clearLabel={t('common.clear')}
                  >
                    <Select
                      value={team || undefined}
                      onValueChange={setTeam}
                    >
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
                <div className="w-full space-y-1.5 text-left">
                  <Label className="text-xs text-muted-foreground">{t('home.competition')}</Label>
                  <Combobox
                    options={filterOptions.competitions}
                    value={competition}
                    onChange={setCompetition}
                    placeholder={t('home.competition')}
                    clearLabel={t('common.clear')}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="w-full space-y-1.5 text-left">
                  <Label className="text-xs text-muted-foreground">{t('home.opponent')}</Label>
                  <Combobox
                    options={filterOptions.opponents}
                    value={opponent}
                    onChange={setOpponent}
                    placeholder={t('home.opponent')}
                    clearLabel={t('common.clear')}
                  />
                </div>
                <div className="w-full space-y-1.5 text-left">
                  <Label className="text-xs text-muted-foreground">{t('home.goalType')}</Label>
                  <ClearableField
                    hasValue={Boolean(type)}
                    onClear={() => setType('')}
                    trailing="select"
                    clearLabel={t('common.clear')}
                  >
                    <Select value={type || undefined} onValueChange={setType}>
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
                <div className="w-full space-y-1.5 text-left">
                  <Label className="text-xs text-muted-foreground">{t('home.scoredWith')}</Label>
                  <ClearableField
                    hasValue={Boolean(how)}
                    onClear={() => setHow('')}
                    trailing="select"
                    clearLabel={t('common.clear')}
                  >
                    <Select value={how || undefined} onValueChange={setHow}>
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
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="w-full space-y-1.5 text-left">
                  <Label className="text-xs text-muted-foreground">{t('home.minuteFrom')}</Label>
                  <ClearableField
                    hasValue={Boolean(minuteMin)}
                    onClear={() => setMinuteMin('')}
                    clearLabel={t('common.clear')}
                  >
                    <Input
                      type="number"
                      min={1}
                      max={120}
                      value={minuteMin}
                      onChange={(e) => setMinuteMin(e.target.value)}
                      className={cn(minuteMin && 'pr-8')}
                    />
                  </ClearableField>
                </div>
                <div className="w-full space-y-1.5 text-left">
                  <Label className="text-xs text-muted-foreground">{t('home.minuteTo')}</Label>
                  <ClearableField
                    hasValue={Boolean(minuteMax)}
                    onClear={() => setMinuteMax('')}
                    clearLabel={t('common.clear')}
                  >
                    <Input
                      type="number"
                      min={1}
                      max={120}
                      value={minuteMax}
                      onChange={(e) => setMinuteMax(e.target.value)}
                      className={cn(minuteMax && 'pr-8')}
                    />
                  </ClearableField>
                </div>
              </div>
            </div>
          </div>

          <button className="cta-secondary" onClick={handleGoalSearch} disabled={!hasSearchFilters}>
            {t('home.searchGoals')}
          </button>

          <Separator className="my-6 bg-white/10" />

          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-[0.12em] uppercase opacity-80">
              <Hash className="size-4 text-primary" />
              {t('home.byGoalNumber')}
            </div>
            <div className="w-full space-y-1.5 text-left">
              <Label className="text-xs text-muted-foreground">
                {t('home.goalNumberLabel', { max: LAST_GOAL })}
              </Label>
              <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <ClearableField
                  hasValue={Boolean(goalNumber)}
                  onClear={() => {
                    setGoalNumber('');
                    setGoalNumberError('');
                  }}
                  clearLabel={t('common.clear')}
                >
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={goalNumber}
                    onChange={handleGoalNumberChange}
                    aria-invalid={!!goalNumberError}
                    placeholder={`1–${LAST_GOAL}`}
                    className={cn(
                      'h-11 w-full min-w-0 text-base md:text-base',
                      goalNumber && 'pr-8',
                    )}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleGoalNumberSearch();
                      }
                    }}
                  />
                </ClearableField>
                <button
                  className="cta-secondary h-11 w-full sm:!w-auto sm:min-w-[140px]"
                  onClick={handleGoalNumberSearch}
                  disabled={!goalNumber}
                >
                  {t('home.goToGoal')}
                </button>
              </div>
              {goalNumberError && (
                <p className="text-xs text-destructive">{goalNumberError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
