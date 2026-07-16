import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, IconButton, Tooltip, Switch, ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';
import { getGoalByNumber, getRandomGoal } from '../helpers/goals';
import { isSpecialDate } from '../helpers/specialDates';
import { useLocale } from '../context/LocaleContext';
import { loadPlaylist, loadPlaylistReturnUrl, PlaylistGoal } from '../helpers/playlist';
import PageMeta from '../components/PageMeta';
import VideoWatermark from '../components/VideoWatermark';

interface FeedGoal {
  id: string;
  goalNumber: string;
  date: string;
}

type ViewsPerGoal = 1 | 2;
type ScrollDirection = 'down' | 'up';

const AUTO_ADVANCE_KEY = 'goatmessi.feed.autoAdvance';
const VIEWS_PER_GOAL_KEY = 'goatmessi.feed.viewsPerGoal';
const PRELOAD_AHEAD = 5;
const PRELOAD_BEHIND = 1;
const UI_IDLE_MS = 2500;

const shouldPreloadIndex = (
  index: number,
  activeIndex: number,
  direction: ScrollDirection,
): boolean => {
  const distance = index - activeIndex;
  if (distance === 0) return false;

  const isAhead = direction === 'down' ? distance > 0 : distance < 0;
  const absDistance = Math.abs(distance);

  if (isAhead) return absDistance <= PRELOAD_AHEAD;
  return absDistance <= PRELOAD_BEHIND;
};

const readStoredAutoAdvance = (fallback: boolean): boolean => {
  try {
    const stored = localStorage.getItem(AUTO_ADVANCE_KEY);
    if (stored === null) return fallback;
    return stored === '1';
  } catch {
    return fallback;
  }
};

const readStoredViewsPerGoal = (): ViewsPerGoal => {
  try {
    const stored = localStorage.getItem(VIEWS_PER_GOAL_KEY);
    return stored === '2' ? 2 : 1;
  } catch {
    return 1;
  }
};

const FeedItem: React.FC<{
  item: FeedGoal;
  isActive: boolean;
  shouldPreload: boolean;
  autoAdvance: boolean;
  viewsPerGoal: ViewsPerGoal;
  uiVisible: boolean;
  onAdvance?: () => void;
}> = ({ item, isActive, shouldPreload, autoAdvance, viewsPerGoal, uiVisible, onAdvance }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playCountRef = useRef(0);
  const { locale, t } = useLocale();

  const specialMessage = isSpecialDate(item.date, locale);
  const isSpecial = !!specialMessage;

  useEffect(() => {
    playCountRef.current = 0;
  }, [item.id, isActive]);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch((e) => console.log('Autoplay failed:', e));
    } else {
      videoRef.current?.pause();
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  const handleEnded = () => {
    if (!autoAdvance) return;

    playCountRef.current += 1;
    if (playCountRef.current >= viewsPerGoal) {
      playCountRef.current = 0;
      onAdvance?.();
      return;
    }

    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch((e) => console.log('Replay failed:', e));
  };

  const keepMounted = isActive || shouldPreload;
  const videoSrc = keepMounted
    ? `https://messi.aws.porracin.com/${item.goalNumber}_${item.date}.mp4`
    : undefined;

  return (
    <Box
      sx={{
        height: '100dvh',
        width: '100%',
        position: 'relative',
        scrollSnapAlign: 'start',
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        preload={keepMounted ? 'auto' : 'none'}
        loop={!autoAdvance}
        playsInline
        muted={false}
        controls={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        onEnded={handleEnded}
        onClick={() => {
          if (videoRef.current?.paused) {
            videoRef.current.play();
          } else {
            videoRef.current?.pause();
          }
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: 80,
          left: 20,
          right: 20,
          color: 'white',
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: uiVisible ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      >
        <Tooltip title={specialMessage || ''} arrow placement="top" disableHoverListener={!isSpecial}>
          <Typography
            component="div"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.6rem', sm: '2rem' },
              lineHeight: 1.15,
              color: isSpecial ? '#FFD700' : 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {isSpecial && '⭐ '}
            {t('feed.goalTitle', { number: parseInt(item.goalNumber, 10) })}
          </Typography>
        </Tooltip>
        <Typography sx={{ opacity: 0.85, mt: 0.5, fontSize: '1rem' }}>{item.date}</Typography>
        {isSpecial && (
          <Typography sx={{ color: '#FFD700', fontWeight: 700, mt: 0.75 }}>🎉 {specialMessage}</Typography>
        )}
      </Box>

      <VideoWatermark />
    </Box>
  );
};

const toFeedGoals = (playlist: PlaylistGoal[]): FeedGoal[] =>
  playlist.map((goal, index) => ({
    id: `${goal.goalNumber}-${index}`,
    goalNumber: goal.goalNumber,
    date: goal.date,
  }));

const Feed: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isPlaylist = searchParams.get('playlist') === '1';
  const [goals, setGoals] = useState<FeedGoal[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playlistReady, setPlaylistReady] = useState(!isPlaylist);
  const [autoAdvance, setAutoAdvance] = useState(() => readStoredAutoAdvance(isPlaylist));
  const [viewsPerGoal, setViewsPerGoal] = useState<ViewsPerGoal>(readStoredViewsPerGoal);
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('down');
  const [uiVisible, setUiVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const { t } = useLocale();
  const activeIndexRef = useRef(0);
  const goalsLengthRef = useRef(0);
  const isLoadingRef = useRef(false);
  const pendingAdvanceRef = useRef(false);
  const returnUrlRef = useRef('/');

  const bumpActivity = useCallback(() => {
    setUiVisible((visible) => (visible ? visible : true));
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = window.setTimeout(() => {
      setUiVisible(false);
    }, UI_IDLE_MS);
  }, []);

  useEffect(() => {
    bumpActivity();

    const onActivity = () => bumpActivity();
    // Avoid scroll — auto-advance scrolls programmatically and would keep chrome visible.
    const events: Array<keyof WindowEventMap> = [
      'pointerdown',
      'pointermove',
      'keydown',
      'wheel',
      'touchstart',
    ];

    events.forEach((event) => window.addEventListener(event, onActivity, { passive: true }));

    return () => {
      events.forEach((event) => window.removeEventListener(event, onActivity));
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, [bumpActivity]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => {
    if (activeIndex === activeIndexRef.current) return;

    setScrollDirection(activeIndex > activeIndexRef.current ? 'down' : 'up');
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    goalsLengthRef.current = goals.length;
  }, [goals.length]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTO_ADVANCE_KEY, autoAdvance ? '1' : '0');
    } catch {
      // ignore storage failures
    }
  }, [autoAdvance]);

  useEffect(() => {
    try {
      localStorage.setItem(VIEWS_PER_GOAL_KEY, String(viewsPerGoal));
    } catch {
      // ignore storage failures
    }
  }, [viewsPerGoal]);

  useEffect(() => {
    if (!isPlaylist) return;

    const playlist = loadPlaylist();
    returnUrlRef.current = loadPlaylistReturnUrl();

    if (!playlist || playlist.length === 0) {
      navigate(returnUrlRef.current, { replace: true });
      return;
    }

    setGoals(toFeedGoals(playlist));
    setPlaylistReady(true);
  }, [isPlaylist, navigate]);

  const addMoreGoals = useCallback((count: number) => {
    if (isPlaylist || isLoadingRef.current) return;

    isLoadingRef.current = true;
    const newGoals: FeedGoal[] = [];
    for (let i = 0; i < count; i++) {
      const randomNum = getRandomGoal();
      const goalData = getGoalByNumber(randomNum.toString());
      if (goalData?.date && goalData?.goalNumber) {
        newGoals.push({
          id: `${goalData.goalNumber}-${Date.now()}-${Math.random()}`,
          goalNumber: goalData.goalNumber,
          date: goalData.date,
        });
      }
    }
    setGoals((prev) => [...prev, ...newGoals]);
    setTimeout(() => {
      isLoadingRef.current = false;
    }, 100);
  }, [isPlaylist]);

  useEffect(() => {
    if (!isPlaylist) {
      addMoreGoals(PRELOAD_AHEAD + 1);
    }
  }, [addMoreGoals, isPlaylist]);

  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: index * containerRef.current.clientHeight,
      behavior: 'smooth',
    });
  }, []);

  const handleAdvance = useCallback(() => {
    const nextIndex = activeIndexRef.current + 1;

    if (nextIndex < goalsLengthRef.current) {
      scrollToIndex(nextIndex);
      if (!isPlaylist && nextIndex >= goalsLengthRef.current - PRELOAD_AHEAD) {
        addMoreGoals(PRELOAD_AHEAD);
      }
      return;
    }

    if (!isPlaylist) {
      pendingAdvanceRef.current = true;
      addMoreGoals(PRELOAD_AHEAD);
    }
  }, [addMoreGoals, isPlaylist, scrollToIndex]);

  useEffect(() => {
    if (!pendingAdvanceRef.current) return;
    if (activeIndexRef.current + 1 >= goals.length) return;

    pendingAdvanceRef.current = false;
    scrollToIndex(activeIndexRef.current + 1);
  }, [goals.length, scrollToIndex]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);

    if (index !== activeIndexRef.current) {
      setActiveIndex(index);
    }

    if (
      !isPlaylist &&
      (scrollHeight - scrollTop - clientHeight < clientHeight * PRELOAD_AHEAD ||
        index >= goalsLengthRef.current - PRELOAD_AHEAD) &&
      !isLoadingRef.current
    ) {
      addMoreGoals(PRELOAD_AHEAD);
    }
  }, [addMoreGoals, isPlaylist]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleBack = () => {
    navigate(isPlaylist ? returnUrlRef.current : '/');
  };

  const handleViewsChange = (_: React.MouseEvent<HTMLElement>, value: ViewsPerGoal | null) => {
    if (value) setViewsPerGoal(value);
  };

  const toggleFullscreen = async () => {
    const root = rootRef.current;
    if (!root) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await root.requestFullscreen();
      }
    } catch (e) {
      console.log('Fullscreen failed:', e);
    }
  };

  if (isPlaylist && !playlistReady) {
    return null;
  }

  const chromeSx = {
    opacity: uiVisible ? 1 : 0,
    pointerEvents: uiVisible ? ('auto' as const) : ('none' as const),
    transition: 'opacity 0.35s ease',
  };

  return (
    <Box
      ref={rootRef}
      sx={{
        width: '100vw',
        height: '100dvh',
        backgroundColor: 'black',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1300,
        cursor: uiVisible ? 'default' : 'none',
      }}
    >
      <PageMeta
        title={t('seo.feedTitle')}
        description={t('seo.feedDescription')}
        path="/feed"
      />
      <IconButton
        onClick={handleBack}
        aria-label="Back"
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 20,
          color: 'white',
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.35)',
          backdropFilter: 'blur(8px)',
          ...chromeSx,
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.14)',
            borderColor: 'rgba(255,255,255,0.6)',
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 1,
          ...chromeSx,
        }}
      >
        {isPlaylist && goals.length > 0 && (
          <Typography
            sx={{
              color: 'white',
              fontWeight: 700,
              letterSpacing: '0.06em',
              fontSize: '0.85rem',
              opacity: 0.85,
              textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
              mr: 0.5,
            }}
          >
            {t('feed.progress', { current: activeIndex + 1, total: goals.length })}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.25,
            py: 0.5,
            borderRadius: 2,
            backgroundColor: 'rgba(0,0,0,0.45)',
            border: '1px solid rgba(255,255,255,0.35)',
            backdropFilter: 'blur(8px)',
            color: 'white',
          }}
        >
          <Tooltip title={t('feed.autoAdvance')} arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                component="label"
                htmlFor="feed-auto-advance"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  opacity: 0.9,
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('feed.autoAdvance')}
              </Typography>
              <Switch
                id="feed-auto-advance"
                size="small"
                checked={autoAdvance}
                onChange={(_, checked) => setAutoAdvance(checked)}
                sx={{
                  ml: 0.25,
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#1fc3e7' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#1fc3e7',
                  },
                }}
              />
            </Box>
          </Tooltip>

          {autoAdvance && (
            <Tooltip title={t('feed.viewsPerGoal')} arrow>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={viewsPerGoal}
                onChange={handleViewsChange}
                aria-label={t('feed.viewsPerGoal')}
                sx={{
                  '& .MuiToggleButton-root': {
                    color: 'rgba(255,255,255,0.75)',
                    borderColor: 'rgba(255,255,255,0.35)',
                    minWidth: 32,
                    px: 0.75,
                    py: 0.15,
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    lineHeight: 1.4,
                  },
                  '& .MuiToggleButton-root.Mui-selected': {
                    color: '#06131a',
                    backgroundColor: '#1fc3e7',
                    borderColor: '#1fc3e7',
                    '&:hover': {
                      backgroundColor: '#1fc3e7',
                    },
                  },
                }}
              >
                <ToggleButton value={1} aria-label={t('feed.viewsPerGoalOne')}>
                  1
                </ToggleButton>
                <ToggleButton value={2} aria-label={t('feed.viewsPerGoalTwo')}>
                  2
                </ToggleButton>
              </ToggleButtonGroup>
            </Tooltip>
          )}

          <Tooltip title={isFullscreen ? t('feed.exitFullscreen') : t('feed.fullscreen')} arrow>
            <IconButton
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? t('feed.exitFullscreen') : t('feed.fullscreen')}
              size="small"
              sx={{
                color: 'white',
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.12)',
                },
              }}
            >
              {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <div
        ref={containerRef}
        style={{
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        {goals.map((goal, index) => {
          const shouldPreload = shouldPreloadIndex(index, activeIndex, scrollDirection);
          return (
            <FeedItem
              key={goal.id}
              item={goal}
              isActive={index === activeIndex}
              shouldPreload={shouldPreload}
              autoAdvance={autoAdvance}
              viewsPerGoal={viewsPerGoal}
              uiVisible={uiVisible}
              onAdvance={autoAdvance ? handleAdvance : undefined}
            />
          );
        })}
      </div>
    </Box>
  );
};

export default Feed;
