import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { SkillGapProvider } from './context/SkillGapContext';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <SkillGapProvider>
        <AppRoutes />
      </SkillGapProvider>
    </BrowserRouter>
  );
}

export default App;
