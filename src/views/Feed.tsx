import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getGoalByNumber, getRandomGoal } from '../helpers/goals';
import { isSpecialDate } from '../helpers/specialDates';

interface FeedGoal {
  id: string; // unique id for the feed item
  goalNumber: string;
  date: string;
}

const FeedItem: React.FC<{ item: FeedGoal; isActive: boolean; shouldPreload: boolean }> = ({ item, isActive, shouldPreload }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const specialMessage = isSpecialDate(item.date);
  const isSpecial = !!specialMessage;

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(e => console.log("Autoplay failed:", e));
    } else {
      videoRef.current?.pause();
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  const videoSrc = `https://messi.aws.porracin.com/${item.goalNumber}_${item.date}.mp4`;

  return (
    <Box
      sx={{
        height: '100dvh', // Use dynamic viewport height for mobile browsers
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
        preload={isActive || shouldPreload ? 'auto' : 'none'}
        loop
        playsInline
        muted={false} // Users might expect sound, but autoplay usually requires muted first on some browsers. 
                      // However, since this is a "TikTok" mode user interaction (scroll) might have happened.
                      // Let's try unmuted but handle failure.
        controls={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain', // or cover, depending on preference. contain is better to see the whole goal.
        }}
        onClick={() => {
            if (videoRef.current?.paused) {
                videoRef.current.play();
            } else {
                videoRef.current?.pause();
            }
        }}
      />
      
      {/* Overlay Info */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 80,
          left: 20,
          color: 'white',
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
          zIndex: 10,
          pointerEvents: 'none' // let clicks pass through to video
        }}
      >
        <Tooltip 
            title={specialMessage || ''} 
            arrow 
            placement="top"
            disableHoverListener={!isSpecial}
        >
             <Typography 
                variant="h4" 
                component="div" 
                fontWeight="bold"
                sx={{
                    color: isSpecial ? '#FFD700' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
             >
              {isSpecial && '⭐ '} Goal #{item.goalNumber}
            </Typography>
        </Tooltip>
        <Typography variant="h6">{item.date}</Typography>
        {isSpecial && (
            <Typography variant="body1" sx={{ color: '#FFD700', marginTop: '4px' }}>
                🎉 {specialMessage}
            </Typography>
        )}
      </Box>
    </Box>
  );
};

const Feed: React.FC = () => {
  const [goals, setGoals] = useState<FeedGoal[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const activeIndexRef = useRef(0);
  const goalsLengthRef = useRef(0);
  const isLoadingRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    goalsLengthRef.current = goals.length;
  }, [goals.length]);

  const addMoreGoals = useCallback((count: number) => {
    if (isLoadingRef.current) return; // Prevent multiple simultaneous loads
    
    isLoadingRef.current = true;
    const newGoals: FeedGoal[] = [];
    for (let i = 0; i < count; i++) {
      const randomNum = getRandomGoal();
      const goalData = getGoalByNumber(randomNum.toString());
      if (goalData.date && goalData.goalNumber) {
        newGoals.push({
          id: `${goalData.goalNumber}-${Date.now()}-${Math.random()}`, // unique key
          goalNumber: goalData.goalNumber,
          date: goalData.date,
        });
      }
    }
    setGoals(prev => [...prev, ...newGoals]);
    // Small delay to prevent rapid successive loads
    setTimeout(() => {
      isLoadingRef.current = false;
    }, 100);
  }, []);

  // Load initial goals
  useEffect(() => {
    addMoreGoals(5);
  }, [addMoreGoals]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    
    if (index !== activeIndexRef.current) {
      setActiveIndex(index);
    }

    // Load more when getting close to bottom
    if (scrollHeight - scrollTop - clientHeight < clientHeight * 2) {
        if (index >= goalsLengthRef.current - 2 && !isLoadingRef.current) {
             addMoreGoals(3);
        }
    }
  }, [addMoreGoals]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100dvh',
        backgroundColor: 'black',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1300, // High z-index to overlay everything
      }}
    >
      {/* Back Button */}
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 20,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.5)',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.7)',
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Scroll Container */}
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
          // Preload videos within range: 1 behind and 2 ahead
          const shouldPreload = Math.abs(index - activeIndex) >= 1 && Math.abs(index - activeIndex) <= 2;
          return (
            <FeedItem 
              key={goal.id} 
              item={goal} 
              isActive={index === activeIndex} 
              shouldPreload={shouldPreload}
            />
          );
        })}
      </div>
    </Box>
  );
};

export default Feed;

