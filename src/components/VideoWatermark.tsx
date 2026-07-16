import React from 'react';
import { Box } from '@mui/material';
import { SITE_URL } from '../helpers/seo';

const VideoWatermark: React.FC<{ bottom?: number }> = ({ bottom = 10 }) => (
  <Box
    component="a"
    href={SITE_URL}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      position: 'absolute',
      bottom,
      right: 12,
      zIndex: 12,
      color: 'rgba(255,255,255,0.55)',
      fontSize: '0.78rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
      textDecoration: 'none',
      textShadow: '0 1px 2px rgba(0,0,0,0.75)',
      userSelect: 'none',
      '&:hover': {
        color: 'rgba(255,255,255,0.85)',
      },
    }}
  >
    todoslosgolesdemessi.com
  </Box>
);

export default VideoWatermark;
