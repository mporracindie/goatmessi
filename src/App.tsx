import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/en';
import LanguageToggle from './components/LanguageToggle';
import SiteFooter from './components/SiteFooter';
import { LocaleProvider, useLocale } from './context/LocaleContext';
import { TooltipProvider } from './components/ui/tooltip';
import Home from './views/Home';
import Goal from './views/GoalViewer';
import { Routes, Route } from 'react-router';
import Search from './views/Search';
import Random from './views/Random';
import Feed from './views/Feed';
import GoalsTable from './views/GoalsTable';
import Grafiquitos from './views/Grafiquitos';
import { BrowserRouter } from 'react-router-dom';

const AppShell: React.FC = () => {
  const { locale } = useLocale();

  dayjs.locale(locale);

  return (
    <div className="content">
      <LanguageToggle />
      <div className="flex min-h-screen w-full max-w-full flex-col items-center justify-start overflow-x-hidden px-0 sm:px-2">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/goal/:number/" element={<Goal />} />
            <Route path="/goal/:number" element={<Goal />} />
            <Route path="/random" element={<Random />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/table" element={<GoalsTable />} />
            <Route path="/grafiquitos" element={<Grafiquitos />} />
          </Routes>
          <SiteFooter />
        </BrowserRouter>
      </div>
    </div>
  );
};

function App() {
  return (
    <LocaleProvider>
      <TooltipProvider>
        <AppShell />
      </TooltipProvider>
    </LocaleProvider>
  );
}

export default App;
