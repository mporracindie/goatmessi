import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Maximize, Minimize } from 'lucide-react';
import { getGoalByNumber, getRandomGoal } from '../helpers/goals';
import { isSpecialDate } from '../helpers/specialDates';
import { useLocale } from '../context/LocaleContext';
import { loadPlaylist, loadPlaylistReturnUrl, PlaylistGoal } from '../helpers/playlist';
import PageMeta from '../components/PageMeta';
import VideoWatermark from '../components/VideoWatermark';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip';
import { cn } from '../lib/utils';

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

  const title = (
    <div
      className={cn(
        'flex items-center gap-2 text-[1.6rem] leading-[1.15] font-extrabold tracking-tight sm:text-[2rem]',
        isSpecial ? 'text-[#FFD700]' : 'text-white',
      )}
    >
      {isSpecial && '⭐ '}
      {t('feed.goalTitle', { number: parseInt(item.goalNumber, 10) })}
    </div>
  );

  return (
    <div className="relative flex h-dvh w-full snap-start items-center justify-center overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={videoSrc}
        preload={keepMounted ? 'auto' : 'none'}
        loop={!autoAdvance}
        playsInline
        muted={false}
        controls={false}
        className="size-full object-contain"
        onEnded={handleEnded}
        onClick={() => {
          if (videoRef.current?.paused) {
            videoRef.current.play();
          } else {
            videoRef.current?.pause();
          }
        }}
      />

      <div
        className={cn(
          'pointer-events-none absolute right-5 bottom-20 left-5 z-10 text-white transition-opacity duration-300 [text-shadow:1px_1px_3px_rgba(0,0,0,0.8)]',
          uiVisible ? 'opacity-100' : 'opacity-0',
        )}
      >
        {isSpecial ? (
          <Tooltip>
            <TooltipTrigger asChild>{title}</TooltipTrigger>
            <TooltipContent side="top">{specialMessage}</TooltipContent>
          </Tooltip>
        ) : (
          title
        )}
        <p className="mt-1 text-base opacity-85">{item.date}</p>
        {isSpecial && (
          <p className="mt-2 font-bold text-[#FFD700]">🎉 {specialMessage}</p>
        )}
      </div>

      <VideoWatermark />
    </div>
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

  const chromeClass = cn(
    'transition-opacity duration-300',
    uiVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        'fixed top-0 left-0 z-[1300] h-dvh w-screen bg-black',
        uiVisible ? 'cursor-default' : 'cursor-none',
      )}
    >
      <PageMeta
        title={t('seo.feedTitle')}
        description={t('seo.feedDescription')}
        path="/feed"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleBack}
        aria-label="Back"
        className={cn(
          'absolute top-5 left-5 z-20 border border-white/35 bg-white/6 text-white backdrop-blur-md hover:border-white/60 hover:bg-white/14 hover:text-white',
          chromeClass,
        )}
      >
        <ArrowLeft />
      </Button>

      <div className={cn('absolute top-4 right-4 z-20 flex flex-col items-end gap-2', chromeClass)}>
        {isPlaylist && goals.length > 0 && (
          <p className="mr-1 text-sm font-bold tracking-wide text-white opacity-85 [text-shadow:1px_1px_3px_rgba(0,0,0,0.8)]">
            {t('feed.progress', { current: activeIndex + 1, total: goals.length })}
          </p>
        )}

        <div className="flex items-center gap-2 rounded-lg border border-white/35 bg-black/45 px-3 py-1.5 text-white backdrop-blur-md">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="feed-auto-advance"
                  className="cursor-pointer text-xs font-bold tracking-wide whitespace-nowrap opacity-90 select-none"
                >
                  {t('feed.autoAdvance')}
                </label>
                <Switch
                  id="feed-auto-advance"
                  checked={autoAdvance}
                  onCheckedChange={setAutoAdvance}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>{t('feed.autoAdvance')}</TooltipContent>
          </Tooltip>

          {autoAdvance && (
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroup
                  type="single"
                  value={String(viewsPerGoal)}
                  onValueChange={(value) => {
                    if (value === '1' || value === '2') {
                      setViewsPerGoal(Number(value) as ViewsPerGoal);
                    }
                  }}
                  variant="outline"
                  size="sm"
                  spacing={0}
                  aria-label={t('feed.viewsPerGoal')}
                >
                  <ToggleGroupItem
                    value="1"
                    aria-label={t('feed.viewsPerGoalOne')}
                    className="min-w-8 px-2 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    1
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="2"
                    aria-label={t('feed.viewsPerGoalTwo')}
                    className="min-w-8 px-2 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    2
                  </ToggleGroupItem>
                </ToggleGroup>
              </TooltipTrigger>
              <TooltipContent>{t('feed.viewsPerGoal')}</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? t('feed.exitFullscreen') : t('feed.fullscreen')}
                className="text-white hover:bg-white/12 hover:text-white"
              >
                {isFullscreen ? <Minimize /> : <Maximize />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFullscreen ? t('feed.exitFullscreen') : t('feed.fullscreen')}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-full snap-y snap-mandatory overflow-y-scroll scroll-smooth"
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
    </div>
  );
};

export default Feed;
