import React from 'react';
import { useLocale } from '../context/LocaleContext';
import { Box, Typography, Tooltip, Stack } from '@mui/material';
import { PlayArrow, Home as HomeIcon } from '@mui/icons-material';
import { getGoalByNumber, getRandomGoal } from '../helpers/goals';
import { buildGoalVideoJsonLd } from '../helpers/seo';
import background from '../assets/messi_argentina_dark.jpg';
import { isSpecialDate } from '../helpers/specialDates';
import { TranslationKey } from '../i18n/translations';
import PageMeta from '../components/PageMeta';
import VideoWatermark from '../components/VideoWatermark';

const specialColor = '#FFD700';

const Goal: React.FC = () => {
  const { locale, t } = useLocale();

  const goalNumber = window.location.pathname.split('/').pop();

  const goal = getGoalByNumber(goalNumber || '');
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
        <Typography component="p" className="hero-kicker">
          {t('goal.kicker')}
        </Typography>

        <Tooltip
          title={specialMessage || ''}
          arrow
          placement="top"
          disableHoverListener={!isSpecial}
        >
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              fontSize: { xs: '2.2rem', sm: '3rem' },
              lineHeight: 1.1,
              mb: 0.5,
              color: isSpecial ? specialColor : 'inherit',
              cursor: isSpecial ? 'pointer' : 'default',
            }}
          >
            {isSpecial && '⭐ '}
            {t('goal.title', { number: goalNumber || '' })}
          </Typography>
        </Tooltip>

        <Typography sx={{ opacity: 0.85, mb: isSpecial ? 1 : 2, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
          {t('goal.date', { date: goal.date })}
        </Typography>

        {isSpecial && (
          <Typography
            sx={{
              color: specialColor,
              fontWeight: 700,
              mb: 2,
            }}
          >
            🎉 {specialMessage}
          </Typography>
        )}

        {goal.competition && (
          <Typography sx={{ opacity: 0.9, mb: 3, maxWidth: 560 }}>
            {goal.team} {goal.result} {goal.opponent} · {goal.competition} · {goal.minute}&apos;
            {goal.type ? ` · ${translateMeta(goal.type)}` : ''}
            {goal.how ? ` · ${translateMeta(goal.how)}` : ''}
          </Typography>
        )}

        <Box
          sx={{
            width: '100%',
            paddingBottom: '56.25%',
            position: 'relative',
            mb: 4,
            backgroundColor: 'black',
            borderRadius: '16px',
            border: 'none',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          }}
        >
          <video
            src={videoSrc}
            autoPlay
            loop
            controls
            controlsList="nodownload"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <VideoWatermark bottom={48} />
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
          <button className="cta-ghost" onClick={() => (window.location.href = '/')}>
            <HomeIcon fontSize="small" />
            {t('goal.searchAgain')}
          </button>
          <button className="cta-primary" onClick={redirectToRandomGoal}>
            <PlayArrow fontSize="small" />
            {t('goal.random')}
          </button>
        </Stack>
      </div>
    </>
  );
};

export default Goal;
