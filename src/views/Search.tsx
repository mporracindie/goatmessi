import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { Play, Home } from 'lucide-react';
import { getRandomGoal, hasActiveFilters, searchGoals } from '../helpers/goals';
import { savePlaylist } from '../helpers/playlist';
import background from '../assets/messi_argentina_dark.jpg';
import SearchGridApp from '../components/SearchGridApp';
import { getSpecialDateMessage } from '../helpers/specialDates';
import { TranslationKey } from '../i18n/translations';
import PageMeta from '../components/PageMeta';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';

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

      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center px-4 py-8 text-center md:py-12">
        {isMessisBirthday && (
          <p
            className="mb-4 text-[1.8rem] font-extrabold sm:text-[2.4rem]"
            style={{ color: specialColor }}
          >
            {t('search.happyBirthday')}
          </p>
        )}

        {goals.length === 0 ? (
          <div
            className="w-full rounded-2xl border p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[14px] sm:p-8"
            style={{ borderColor: panelBorder, backgroundColor: panelBg }}
          >
            <p className="hero-kicker">{t('search.kicker')}</p>
            {specialDateMessage && (
              <p className="mb-3 font-bold" style={{ color: specialColor }}>
                🎉 {specialDateMessage}
              </p>
            )}
            <h1 className="mb-3 text-[2rem] leading-tight font-extrabold tracking-tight sm:text-[2.6rem]">
              {t('search.noGoalsFound')}
            </h1>
            {filterSummary && (
              <p className="mx-auto max-w-[480px] opacity-85">{filterSummary}</p>
            )}
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="cta-ghost" onClick={() => (window.location.href = '/')}>
                <Home className="size-4" />
                {t('search.searchAgain')}
              </button>
              <button className="cta-primary" onClick={redirectToRandomGoal}>
                <Play className="size-4" />
                {t('search.random')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 w-full md:mb-8">
              <p className="hero-kicker">{t('search.kicker')}</p>
              <h1 className="mb-3 text-[2.2rem] leading-tight font-extrabold tracking-tight sm:text-[3rem]">
                <span className="gradient-text">{goals.length}</span>{' '}
                {t(goals.length === 1 ? 'search.goalLabel' : 'search.goalsLabel')}
              </h1>
              {filterSummary && (
                <p
                  className={`mx-auto max-w-[520px] opacity-85 ${specialDateMessage ? 'mb-3' : ''}`}
                >
                  {filterSummary}
                </p>
              )}
              {specialDateMessage && (
                <p className="font-bold" style={{ color: specialColor }}>
                  🎉 {specialDateMessage}
                </p>
              )}
            </div>

            <div
              className="mb-6 w-full rounded-2xl border p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[14px] sm:p-7"
              style={{ borderColor: panelBorder, backgroundColor: panelBg }}
            >
              <div className="mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ToggleGroup
                  type="single"
                  value={sortBy}
                  onValueChange={(value) => {
                    if (value === 'number' || value === 'date') setSortBy(value);
                  }}
                  variant="outline"
                  spacing={0}
                  aria-label={t('search.sortBy')}
                >
                  <ToggleGroupItem
                    value="number"
                    aria-label={t('search.sortByNumber')}
                    className="px-4 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {t('search.sortByNumber')}
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="date"
                    aria-label={t('search.sortByDate')}
                    className="px-4 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {t('search.sortByDate')}
                  </ToggleGroupItem>
                </ToggleGroup>

                {goals.length > 1 && (
                  <button
                    className="cta-secondary"
                    onClick={playAllResults}
                    style={{ width: 'auto', minWidth: 120, padding: '6px 16px', fontSize: '0.85rem' }}
                  >
                    <Play className="size-4" />
                    {t('search.viewAll')}
                  </button>
                )}
              </div>

              <SearchGridApp goals={goals} />
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="cta-ghost" onClick={() => (window.location.href = '/')}>
                <Home className="size-4" />
                {t('search.searchAgain')}
              </button>
              {goals.length > 1 ? (
                <button className="cta-primary" onClick={playAllResults}>
                  <Play className="size-4" />
                  {t('search.viewAll')}
                </button>
              ) : (
                <button className="cta-primary" onClick={redirectToRandomGoal}>
                  <Play className="size-4" />
                  {t('search.random')}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Search;
