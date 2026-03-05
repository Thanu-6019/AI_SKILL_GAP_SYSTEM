import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { SkillGapProvider } from './context/SkillGapContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  // Apply saved theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedTheme);
    
    // Set body background
    if (savedTheme === 'light') {
      document.body.style.backgroundColor = '#f8fafc';
    } else {
      document.body.style.backgroundColor = '#0f172a';
    }
    
    console.log('🎨 [App] Theme initialized:', savedTheme);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <SkillGapProvider>
          <AppRoutes />
        </SkillGapProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
