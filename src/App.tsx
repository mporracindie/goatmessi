import { Container } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ToggleColorMode from './components/ToggleThemeColor';
import { ThemeContextProvider } from './context/ThemeContext';
import Home from './views/Home';
import Goal from './views/GoalViewer';
import { Routes, Route } from 'react-router';
import Search from './views/Search';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <ThemeContextProvider>
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
          <BrowserRouter >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/goal/:number" element={<Goal />} />
            </Routes>
          </BrowserRouter>
        </Container>
      </LocalizationProvider>
    </ThemeContextProvider>
  );
}

export default App;
