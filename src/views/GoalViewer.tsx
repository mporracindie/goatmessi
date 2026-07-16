import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { Play, Home, Pencil } from 'lucide-react';
import { getGoalByNumber, getRandomGoal } from '../helpers/goals';
import { buildGoalVideoJsonLd, SITE_URL } from '../helpers/seo';
import background from '../assets/messi_argentina_dark.jpg';
import { isSpecialDate } from '../helpers/specialDates';
import { TranslationKey } from '../i18n/translations';
import PageMeta from '../components/PageMeta';
import VideoWatermark from '../components/VideoWatermark';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip';

const specialColor = '#FFD700';
/** @marcoporracin — required for X DM compose deep links */
const TWITTER_DM_RECIPIENT_ID = '449478542';

const Goal: React.FC = () => {
  const { locale, t } = useLocale();
  const { number: routeNumber } = useParams<{ number: string }>();

  // Cloudflare Pages serves prerendered goals as /goal/:n/ (trailing slash).
  // Falling back to pathname must ignore empty trailing segments.
  const goalNumber =
    routeNumber ||
    window.location.pathname.split('/').filter(Boolean).pop() ||
    '';

  const goal = getGoalByNumber(goalNumber);
  if (!goal?.date) {
    window.location.href = '/';
    return null;
  }

  const specialMessage = isSpecialDate(goal.date, locale);
  const isSpecial = !!specialMessage;

  const translateMeta = (value: string | null) => {
    if (!value) return '';
    const key = `goalMeta.${value}` as TranslationKey;
    const translated = t(key);
    return translated === key ? value : translated;
  };

  const redirectToRandomGoal = () => {
    window.location.href = `/goal/${getRandomGoal()}`;
  };

  const goalNo = Number(goal.goalNumber);
  const videoSrc = `https://messi.aws.porracin.com/${goal.goalNumber}_${goal.date}.mp4`;
  const goalUrl = `${SITE_URL}/goal/${goalNo}`;
  const suggestCorrectionHref = `https://x.com/messages/compose?recipient_id=${TWITTER_DM_RECIPIENT_ID}&text=${encodeURIComponent(
    t('goal.suggestCorrectionDm', { number: goalNo, url: goalUrl }),
  )}`;
  const goalTitle = t('seo.goalTitle', {
    number: goalNo,
    team: goal.team,
    opponent: goal.opponent,
  });
  const goalDescription = t('seo.goalDescription', {
    number: goalNo,
    date: goal.date,
    team: goal.team,
    result: goal.result,
    opponent: goal.opponent,
    competition: goal.competition,
    minute: String(goal.minute),
  });

  const title = (
    <h1
      className="mb-1 text-[2.2rem] leading-tight font-extrabold tracking-tight sm:text-[3rem]"
      style={{
        color: isSpecial ? specialColor : 'inherit',
        cursor: isSpecial ? 'pointer' : 'default',
      }}
    >
      {isSpecial && '⭐ '}
      {t('goal.title', { number: String(goalNo) })}
    </h1>
  );

  return (
    <>
      <PageMeta
        title={`${goalTitle} | ${locale === 'es' ? 'Todos los goles de Messi' : "All of Messi's goals"}`}
        description={goalDescription}
        path={`/goal/${goalNo}`}
        type="video.other"
        jsonLd={buildGoalVideoJsonLd(goal)}
      />
      <div className="background-overlay hero-backdrop">
        <img src={background} alt="Lionel Messi with Argentina" />
      </div>

      <div className="container-video">
        <p className="hero-kicker">{t('goal.kicker')}</p>

        {isSpecial ? (
          <Tooltip>
            <TooltipTrigger asChild>{title}</TooltipTrigger>
            <TooltipContent>{specialMessage}</TooltipContent>
          </Tooltip>
        ) : (
          title
        )}

        <p className={`text-base opacity-85 sm:text-lg ${isSpecial ? 'mb-2' : 'mb-4'}`}>
          {t('goal.date', { date: goal.date })}
        </p>

        {isSpecial && (
          <p className="mb-4 font-bold" style={{ color: specialColor }}>
            🎉 {specialMessage}
          </p>
        )}

        {goal.competition && (
          <p className="mb-6 max-w-[560px] opacity-90">
            {goal.team} {goal.result} {goal.opponent} · {goal.competition} · {goal.minute}&apos;
            {goal.type ? ` · ${translateMeta(goal.type)}` : ''}
            {goal.how ? ` · ${translateMeta(goal.how)}` : ''}
          </p>
        )}

        <div className="relative mb-8 w-full overflow-hidden rounded-2xl bg-black pb-[56.25%] shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <video
            src={videoSrc}
            autoPlay
            loop
            controls
            controlsList="nodownload"
            className="absolute inset-0 size-full object-cover"
          />
          <VideoWatermark bottom={48} />
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="cta-ghost" onClick={() => (window.location.href = '/')}>
            <Home className="size-4" />
            {t('goal.searchAgain')}
          </button>
          <button className="cta-primary" onClick={redirectToRandomGoal}>
            <Play className="size-4" />
            {t('goal.random')}
          </button>
        </div>

        <a
          href={suggestCorrectionHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/55 underline-offset-4 hover:text-white/85 hover:underline"
        >
          <Pencil className="size-4" />
          {t('goal.suggestCorrection')}
        </a>
      </div>
    </>
  );
};

export default Goal;
