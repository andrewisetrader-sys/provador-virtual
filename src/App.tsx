import { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import TryOn from './components/TryOn';
import Restore from './components/Restore';
import History from './components/History';
import { View, ProcessedImage } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [history, setHistory] = useState<ProcessedImage[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('photofit_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history', e);
      // If corrupted, clear it
      localStorage.removeItem('photofit_history');
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length === 0) return;
    try {
      localStorage.setItem('photofit_history', JSON.stringify(history));
    } catch (e) {
      console.warn('LocalStorage quota exceeded, keeping in-memory only', e);
      // Keep only 5 most recent if quota hit
      if (history.length > 5) {
        setHistory(prev => prev.slice(0, 5));
      }
    }
  }, [history]);

  const saveToHistory = (img: ProcessedImage) => {
    setHistory(prev => {
      const updated = [img, ...prev];
      // Limit to last 20 items
      return updated.slice(0, 20);
    });
  };

  const deleteFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
      setHistory([]);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={setCurrentView} />;
      case 'try-on':
        return <TryOn onSave={saveToHistory} />;
      case 'restore':
        return <Restore onSave={saveToHistory} />;
      case 'history':
        return <History history={history} onDelete={deleteFromHistory} onClearAll={clearHistory} />;
      case 'settings':
        return (
          <div className="pt-24 px-8 text-center">
            <h2 className="title-main mb-4">Configurações</h2>
            <p className="text-gray-500">Configurações de conta e preferências em breve.</p>
            <button 
              onClick={() => setCurrentView('home')}
              className="btn-primary mt-8 inline-flex"
            >
              Voltar ao Início
            </button>
          </div>
        );
      default:
        return <Home onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background Layer with Left-to-Right Fade */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2670&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'left center',
            filter: 'blur(4px) saturate(1.8)',
          }}
        />
        {/* Directional Gradient Overlay: Left (Clearer) to Right (Softer/White) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-white/85" />
      </div>

      <div className="relative z-10">
        <Header 
          currentView={currentView} 
          onBack={() => setCurrentView('home')} 
          onSettings={() => setCurrentView('settings')}
        />
        
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

