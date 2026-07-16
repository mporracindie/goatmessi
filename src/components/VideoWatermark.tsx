import React from 'react';
import { SITE_URL } from '../helpers/seo';

const VideoWatermark: React.FC<{ bottom?: number }> = ({ bottom = 10 }) => (
  <a
    href={SITE_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="absolute right-3 z-[12] text-[0.78rem] font-semibold tracking-wide text-white/55 no-underline select-none [text-shadow:0_1px_2px_rgba(0,0,0,0.75)] hover:text-white/85"
    style={{ bottom }}
  >
    todoslosgolesdemessi.com
  </a>
);

export default VideoWatermark;
