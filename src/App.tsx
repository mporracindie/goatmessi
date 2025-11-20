import { Container } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ToggleColorMode from './components/ToggleThemeColor';
import { ThemeContextProvider } from './context/ThemeContext';
import Home from './views/Home';
import Goal from './views/GoalViewer';
import { Routes, Route } from 'react-router';
import Search from './views/Search';
import Random from './views/Random';
import Feed from './views/Feed';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <ThemeContextProvider>
      <div className="content">
        <ToggleColorMode />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Container
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              width: '100vw',
            }}
          >
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/goal/:number" element={<Goal />} />
                <Route path="/random" element={<Random />} />
                <Route path="/feed" element={<Feed />} />
              </Routes>
            </BrowserRouter>
          </Container>
        </LocalizationProvider>
      </div>
    </ThemeContextProvider>
  );
}

export default App;
