import React from 'react';
import { Container } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/en';
import LanguageToggle from './components/LanguageToggle';
import SiteFooter from './components/SiteFooter';
import { ThemeContextProvider } from './context/ThemeContext';
import { LocaleProvider, useLocale } from './context/LocaleContext';
import Home from './views/Home';
import Goal from './views/GoalViewer';
import { Routes, Route } from 'react-router';
import Search from './views/Search';
import Random from './views/Random';
import Feed from './views/Feed';
import { BrowserRouter } from 'react-router-dom';

const AppShell: React.FC = () => {
  const { locale } = useLocale();

  dayjs.locale(locale);

  return (
    <div className="content">
      <LanguageToggle />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%',
            maxWidth: '100% !important',
            px: { xs: 0, sm: 2 },
            py: 0,
            overflowX: 'hidden',
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/goal/:number/" element={<Goal />} />
              <Route path="/goal/:number" element={<Goal />} />
              <Route path="/random" element={<Random />} />
              <Route path="/feed" element={<Feed />} />
            </Routes>
            <SiteFooter />
          </BrowserRouter>
        </Container>
      </LocalizationProvider>
    </div>
  );
};

function App() {
  return (
    <ThemeContextProvider>
      <LocaleProvider>
        <AppShell />
      </LocaleProvider>
    </ThemeContextProvider>
  );
}

export default App;
