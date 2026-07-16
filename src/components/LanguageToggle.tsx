import React from 'react';
import { useLocale } from '../context/LocaleContext';
import { Locale } from '../i18n/translations';
import { Button } from './ui/button';
import { ButtonGroup } from './ui/button-group';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { cn } from '../lib/utils';

const LanguageToggle: React.FC = () => {
  const { locale, setLocale, t } = useLocale();

  const select = (next: Locale) => () => {
    if (next !== locale) {
      setLocale(next);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ButtonGroup
          className="fixed top-4 right-4 z-20 overflow-hidden rounded-lg border border-white/35 bg-black/35 backdrop-blur-md"
          aria-label={t('common.language')}
        >
          {(['en', 'es'] as const).map((code) => {
            const active = locale === code;
            return (
              <Button
                key={code}
                type="button"
                size="sm"
                variant="ghost"
                disabled={active}
                onClick={select(code)}
                aria-label={code === 'en' ? t('common.english') : t('common.spanish')}
                className={cn(
                  'min-w-[42px] px-3 font-bold tracking-wide text-white hover:bg-white/10 hover:text-white',
                  active &&
                    'bg-primary text-primary-foreground opacity-100 disabled:opacity-100 hover:bg-primary hover:text-primary-foreground',
                )}
              >
                {code.toUpperCase()}
              </Button>
            );
          })}
        </ButtonGroup>
      </TooltipTrigger>
      <TooltipContent>{t('common.language')}</TooltipContent>
    </Tooltip>
  );
};

export default LanguageToggle;
