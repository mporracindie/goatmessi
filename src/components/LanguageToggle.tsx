import React from 'react';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import { useLocale } from '../context/LocaleContext';
import { Locale } from '../i18n/translations';

const LanguageToggle: React.FC = () => {
  const { locale, setLocale, t } = useLocale();

  const select = (next: Locale) => () => {
    if (next !== locale) {
      setLocale(next);
    }
  };

  return (
    <Tooltip title={t('common.language')} arrow>
      <ButtonGroup
        size="small"
        variant="outlined"
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 20,
          bgcolor: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(8px)',
          borderRadius: 2,
          overflow: 'hidden',
          '& .MuiButton-root': {
            color: 'common.white',
            borderColor: 'rgba(255,255,255,0.35)',
            minWidth: 42,
            px: 1.25,
            fontWeight: 700,
            letterSpacing: '0.04em',
          },
          '& .MuiButton-root.Mui-disabled': {
            color: '#06131a',
            bgcolor: '#1fc3e7',
            borderColor: '#1fc3e7',
            opacity: 1,
          },
        }}
      >
        <Button disabled={locale === 'en'} onClick={select('en')} aria-label={t('common.english')}>
          EN
        </Button>
        <Button disabled={locale === 'es'} onClick={select('es')} aria-label={t('common.spanish')}>
          ES
        </Button>
      </ButtonGroup>
    </Tooltip>
  );
};

export default LanguageToggle;
