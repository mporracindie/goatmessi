import React from 'react';
import { useThemeContext } from '../context/ThemeContext';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ToggleColorMode: React.FC = () => {
  const { toggleColorMode, mode } = useThemeContext();

  return (
    <IconButton sx={{ m: 2, position: 'absolute', top: '0', right: '0' }} onClick={toggleColorMode} color="inherit">
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ToggleColorMode;
