import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';

const SiteFooter: React.FC = () => {
  const { t } = useLocale();
  const { pathname } = useLocation();

  if (pathname.startsWith('/feed')) {
    return null;
  }

  return (
    <footer className="site-footer">
      <p className="site-footer-blurb">{t('common.archiveBlurb')}</p>
      <p>
        {t('common.builtBy')}{' '}
        <a href="https://x.com/marcoporracin" target="_blank" rel="noopener noreferrer">
          Marco
        </a>
        {' · '}
        <a href="https://porracin.com/" target="_blank" rel="noopener noreferrer">
          porracin.com
        </a>
        {pathname !== '/grafiquitos' ? (
          <>
            {' · '}
            <Link to="/grafiquitos">{t('home.browseCharts')}</Link>
          </>
        ) : null}
      </p>
    </footer>
  );
};

export default SiteFooter;
