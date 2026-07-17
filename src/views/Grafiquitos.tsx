import React, { useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { Home, TableProperties } from 'lucide-react';
import { useLocale } from '../context/LocaleContext';
import { LAST_GOAL } from '../helpers/goals';
import {
  getGoalsByCompetition,
  getGoalsByDayOfYear,
  getGoalsByHow,
  getGoalsByMinuteAndHow,
  getGoalsByMonth,
  getGoalsByType,
  getGoalsByYearAndTeam,
  getTopOpponents,
  HOW_COLORS,
  TEAM_COLORS,
} from '../helpers/goalCharts';
import { TranslationKey } from '../i18n/translations';
import PageMeta from '../components/PageMeta';
import background from '../assets/messi_argentina_dark.jpg';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../components/ui/chart';
import { cn } from '../lib/utils';

const panelBg = 'rgba(10, 12, 16, 0.72)';
const panelBorder = 'rgba(255, 255, 255, 0.08)';

const ACCENT = '#1fc3e7';
const MUTED_BAR = 'rgba(255,255,255,0.12)';

const howColor = (name: string, index = 0) =>
  HOW_COLORS[name] || ['#1fc3e7', '#6CACE4', '#F7B5CD', '#EDBB00', '#A50044', '#7CFFB2'][index % 6];

const monthName = (month: number, locale: string, style: 'short' | 'long' = 'short') => {
  const name = new Intl.DateTimeFormat(locale, { month: style }).format(
    new Date(2000, month - 1, 1),
  );
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const ChartCard: React.FC<{
  title: string;
  description: string;
  stat?: React.ReactNode;
  headerAlign?: 'center' | 'split';
  className?: string;
  children: React.ReactNode;
}> = ({ title, description, stat, headerAlign = 'center', className, children }) => (
  <section
    className={cn(
      'relative z-10 overflow-hidden rounded-2xl border p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[14px] sm:p-6',
      className,
    )}
    style={{ borderColor: panelBorder, backgroundColor: panelBg }}
  >
    <div
      className={cn(
        'mb-4 flex gap-3',
        headerAlign === 'split'
          ? 'flex-col items-stretch text-left sm:flex-row sm:items-start sm:justify-between'
          : 'flex-col items-center text-center',
      )}
    >
      <div className={cn('min-w-0', headerAlign === 'center' && 'max-w-2xl')}>
        <h2 className="text-lg font-bold tracking-tight sm:text-xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {stat ? (
        <div className={cn('shrink-0', headerAlign === 'split' && 'sm:self-start')}>{stat}</div>
      ) : null}
    </div>
    {children}
  </section>
);

const StatChip: React.FC<{ value: React.ReactNode; label: string; accent?: boolean }> = ({
  value,
  label,
  accent,
}) => (
  <div className="rounded-xl border border-white/8 bg-black/25 px-3 py-2">
    <div
      className={cn(
        'text-2xl font-extrabold tabular-nums leading-none',
        accent ? 'text-primary' : 'text-foreground',
      )}
    >
      {value}
    </div>
    <div className="mt-1 text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
      {label}
    </div>
  </div>
);

const ColorLegend: React.FC<{ items: Array<{ label: string; color: string }> }> = ({ items }) => (
  <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
    {items.map((item) => (
      <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <div className="h-2 w-2 shrink-0 rounded-[2px]" style={{ backgroundColor: item.color }} />
        {item.label}
      </div>
    ))}
  </div>
);

const Grafiquitos: React.FC = () => {
  const { locale, t } = useLocale();
  const navigate = useNavigate();

  const dayOfYear = useMemo(() => getGoalsByDayOfYear(), []);
  const byMonth = useMemo(() => getGoalsByMonth(), []);
  const byYear = useMemo(() => getGoalsByYearAndTeam(), []);
  const byMinute = useMemo(() => getGoalsByMinuteAndHow(), []);
  const byHow = useMemo(() => getGoalsByHow(), []);
  const byType = useMemo(() => getGoalsByType(), []);
  const topOpponents = useMemo(() => getTopOpponents(), []);
  const byCompetition = useMemo(() => getGoalsByCompetition(), []);

  const translateHow = (name: string) => {
    if (name === 'Unknown') return t('grafiquitos.unknownType');
    const key = `goalMeta.${name}` as TranslationKey;
    const translated = t(key);
    return translated === key ? name : translated;
  };

  const dayChartData = useMemo(
    () =>
      dayOfYear.points.map((point) => ({
        ...point,
        label: `${point.day} ${monthName(point.month, locale, 'short')}`,
        fill: point.goals === 0 ? MUTED_BAR : ACCENT,
      })),
    [dayOfYear.points, locale],
  );

  const monthChartData = useMemo(
    () =>
      byMonth.map((point) => ({
        ...point,
        label: monthName(point.month, locale, 'short'),
        fullLabel: monthName(point.month, locale, 'long'),
      })),
    [byMonth, locale],
  );

  const yearChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    for (const team of byYear.teams) {
      config[team] = {
        label: team,
        color: TEAM_COLORS[team] || ACCENT,
      };
    }
    return config;
  }, [byYear.teams]);

  const minuteChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    for (const how of byMinute.hows) {
      config[how] = {
        label: translateHow(how),
        color: howColor(how),
      };
    }
    return config;
  }, [byMinute.hows, t]);

  const howChartData = useMemo(
    () =>
      byHow.map((point, index) => ({
        ...point,
        label: translateHow(point.name),
        fill: howColor(point.name, index),
      })),
    [byHow, t],
  );

  const howConfig = useMemo(() => {
    const config: ChartConfig = {};
    for (const point of howChartData) {
      config[point.name] = { label: point.label, color: point.fill };
    }
    return config;
  }, [howChartData]);

  const typeChartData = useMemo(
    () =>
      byType.map((point) => {
        if (point.name === 'Unknown') {
          return { ...point, label: t('grafiquitos.unknownType') };
        }
        const key = `goalMeta.${point.name}` as TranslationKey;
        const translated = t(key);
        return {
          ...point,
          label: translated === key ? point.name : translated,
        };
      }),
    [byType, t],
  );

  const dayConfig: ChartConfig = {
    goals: { label: t('grafiquitos.goals'), color: ACCENT },
  };
  const monthConfig: ChartConfig = {
    goals: { label: t('grafiquitos.goals'), color: ACCENT },
  };
  const namedConfig: ChartConfig = {
    goals: { label: t('grafiquitos.goals'), color: ACCENT },
  };

  const busiestLabel = `${dayOfYear.busiest.day} ${monthName(
    dayOfYear.busiest.month,
    locale,
    'long',
  )}`;

  return (
    <>
      <PageMeta
        title={t('seo.grafiquitosTitle')}
        description={t('seo.grafiquitosDescription')}
        path="/grafiquitos"
      />
      <div className="background-overlay hero-backdrop">
        <img src={background} alt="Lionel Messi with Argentina" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-stretch px-4 py-8 md:py-10">
        <div className="mb-8 text-center">
          <p className="hero-kicker">{t('grafiquitos.kicker')}</p>
          <h1 className="mb-2 text-[2rem] leading-tight font-extrabold tracking-tight sm:text-[2.6rem]">
            <span className="gradient-text">{t('grafiquitos.title')}</span>
          </h1>
          <p className="mx-auto max-w-[560px] opacity-80">{t('grafiquitos.subtitle')}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {t('grafiquitos.basedOn', { count: LAST_GOAL })}
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <RouterLink to="/table" className="cta-ghost inline-flex items-center gap-2 no-underline">
            <TableProperties className="size-4" />
            {t('home.browseTable')}
          </RouterLink>
        </div>

        <div className="flex flex-col gap-5">
          <ChartCard
            title={t('grafiquitos.dayTitle')}
            description={t('grafiquitos.dayDescription')}
            headerAlign="split"
            stat={
              <div className="flex justify-end gap-2">
                <StatChip
                  value={dayOfYear.emptyDays}
                  label={t('grafiquitos.emptyDays')}
                  accent
                />
                <StatChip value={dayOfYear.scoredDays} label={t('grafiquitos.scoredDays')} />
              </div>
            }
          >
            <p className="mb-3 text-xs text-muted-foreground">
              {t('grafiquitos.busiestDay', {
                day: busiestLabel,
                count: dayOfYear.busiest.goals,
              })}
            </p>
            <ChartContainer config={dayConfig} className="h-[220px] w-full aspect-auto sm:h-[280px]">
              <BarChart data={dayChartData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="dayOfYear"
                  tickLine={false}
                  axisLine={false}
                  interval={30}
                  tickFormatter={(value) => {
                    const point = dayOfYear.points[Number(value) - 1];
                    return point ? monthName(point.month, locale, 'short') : '';
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  width={28}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => {
                        const item = payload?.[0] as
                          | { payload?: { label?: string; goals?: number } }
                          | undefined;
                        return item?.payload?.label ?? '';
                      }}
                    />
                  }
                />
                <Bar dataKey="goals" radius={[1, 1, 0, 0]} maxBarSize={4}>
                  {dayChartData.map((entry) => (
                    <Cell key={entry.key} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </ChartCard>

          <ChartCard
            title={t('grafiquitos.monthTitle')}
            description={t('grafiquitos.monthDescription')}
          >
            <ChartContainer config={monthConfig} className="h-[260px] w-full aspect-auto">
              <BarChart data={monthChartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} width={32} tickLine={false} axisLine={false} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => {
                        const item = payload?.[0] as
                          | { payload?: { fullLabel?: string } }
                          | undefined;
                        return item?.payload?.fullLabel ?? '';
                      }}
                    />
                  }
                />
                <Bar dataKey="goals" fill={ACCENT} radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ChartContainer>
          </ChartCard>

          <ChartCard
            title={t('grafiquitos.minuteTitle')}
            description={t('grafiquitos.minuteDescription')}
          >
            <ColorLegend
              items={byMinute.hows.map((how) => ({
                label: translateHow(how),
                color: howColor(how),
              }))}
            />
            <ChartContainer
              config={minuteChartConfig}
              className="h-[260px] w-full aspect-auto sm:h-[320px]"
            >
              <BarChart data={byMinute.points} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  interval={14}
                  minTickGap={12}
                />
                <YAxis allowDecimals={false} width={28} tickLine={false} axisLine={false} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => {
                        const item = payload?.[0] as
                          | { payload?: { label?: string; total?: number } }
                          | undefined;
                        const label = item?.payload?.label ?? '';
                        const total = item?.payload?.total ?? 0;
                        return t('grafiquitos.minuteTooltip', { minute: label, count: total });
                      }}
                    />
                  }
                />
                {byMinute.hows.map((how) => (
                  <Bar
                    key={how}
                    dataKey={how}
                    stackId="how"
                    fill={howColor(how)}
                    maxBarSize={8}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </ChartCard>

          <ChartCard
            title={t('grafiquitos.yearTitle')}
            description={t('grafiquitos.yearDescription')}
          >
            <ColorLegend
              items={byYear.teams.map((team) => ({
                label: team,
                color: TEAM_COLORS[team] || ACCENT,
              }))}
            />
            <ChartContainer config={yearChartConfig} className="h-[320px] w-full aspect-auto sm:h-[380px]">
              <BarChart data={byYear.points} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  interval="equidistantPreserveStart"
                  minTickGap={18}
                />
                <YAxis allowDecimals={false} width={36} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                {byYear.teams.map((team) => (
                  <Bar
                    key={team}
                    dataKey={team}
                    stackId="teams"
                    fill={TEAM_COLORS[team] || ACCENT}
                    maxBarSize={28}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </ChartCard>

          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard
              title={t('grafiquitos.howTitle')}
              description={t('grafiquitos.howDescription')}
            >
              <ColorLegend
                items={howChartData.map((entry) => ({
                  label: entry.label,
                  color: entry.fill,
                }))}
              />
              <ChartContainer config={howConfig} className="h-[260px] w-full aspect-auto">
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        nameKey="name"
                        labelFormatter={(_, payload) => {
                          const item = payload?.[0] as
                            | { payload?: { label?: string } }
                            | undefined;
                          return item?.payload?.label ?? '';
                        }}
                      />
                    }
                  />
                  <Pie
                    data={howChartData}
                    dataKey="goals"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={96}
                    paddingAngle={2}
                    stroke="rgba(0,0,0,0.35)"
                  >
                    {howChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </ChartCard>

            <ChartCard
              title={t('grafiquitos.typeTitle')}
              description={t('grafiquitos.typeDescription')}
            >
              <ChartContainer config={namedConfig} className="h-[280px] w-full aspect-auto">
                <BarChart
                  data={typeChartData}
                  layout="vertical"
                  margin={{ left: 8, right: 16, top: 8, bottom: 0 }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={100}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="goals" fill="#EDBB00" radius={[0, 6, 6, 0]} maxBarSize={22} />
                </BarChart>
              </ChartContainer>
            </ChartCard>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard
              title={t('grafiquitos.opponentsTitle')}
              description={t('grafiquitos.opponentsDescription')}
            >
              <ChartContainer config={namedConfig} className="h-[360px] w-full aspect-auto">
                <BarChart
                  data={topOpponents}
                  layout="vertical"
                  margin={{ left: 8, right: 16, top: 8, bottom: 0 }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={118}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="goals" fill="#A50044" radius={[0, 6, 6, 0]} maxBarSize={18} />
                </BarChart>
              </ChartContainer>
            </ChartCard>

            <ChartCard
              title={t('grafiquitos.competitionTitle')}
              description={t('grafiquitos.competitionDescription')}
            >
              <ChartContainer config={namedConfig} className="h-[360px] w-full aspect-auto">
                <BarChart
                  data={byCompetition}
                  layout="vertical"
                  margin={{ left: 8, right: 16, top: 8, bottom: 0 }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="goals" fill="#7CFFB2" radius={[0, 6, 6, 0]} maxBarSize={18} />
                </BarChart>
              </ChartContainer>
            </ChartCard>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button className="cta-ghost" onClick={() => navigate('/')}>
            <Home className="size-4" />
            {t('grafiquitos.backHome')}
          </button>
        </div>
      </div>
    </>
  );
};

export default Grafiquitos;
