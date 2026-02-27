import { BrowserRouter } from 'react-router-dom';
import { SkillGapProvider } from './context';
import AppRoutes from './routes/AppRoutes';
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
