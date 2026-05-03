import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  onBack: () => void;
  onSettings: () => void;
}

export default function Header({ currentView, onBack, onSettings }: HeaderProps) {
  if (currentView === 'home') return null;

  const titles: Record<View, string> = {
    home: '',
    'try-on': 'Provador Virtual',
    restore: 'Restaurador de Imagens',
    history: 'Histórico de Criações',
    settings: 'Configurações'
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-bottom border-border-soft z-50 flex items-center px-4 md:px-8 justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold font-display text-gray-900">{titles[currentView]}</h1>
      </div>
      
      {currentView !== 'settings' && (
        <button 
          onClick={onSettings}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <SettingsIcon className="w-6 h-6 text-gray-500" />
        </button>
      )}
    </header>
  );
}
