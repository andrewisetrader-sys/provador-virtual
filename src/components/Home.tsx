import { Shirt, Sparkles, History as HistoryIcon, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { View } from '../types';

interface HomeProps {
  onNavigate: (view: View) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const menuItems = [
    { 
      id: 'try-on' as View, 
      label: 'Provador Virtual', 
      description: 'Experimente roupas em modelos com IA',
      icon: <Shirt className="w-8 h-8" />,
      color: 'bg-brand' 
    },
    { 
      id: 'restore' as View, 
      label: 'Restaurador de Imagens', 
      description: 'Restaure e colora fotos antigas em 8K',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'bg-indigo-600' 
    },
    { 
      id: 'history' as View, 
      label: 'Histórico', 
      description: 'Veja suas criações recentes',
      icon: <HistoryIcon className="w-8 h-8" />,
      color: 'bg-slate-700' 
    },
    { 
      id: 'settings' as View, 
      label: 'Configurações', 
      description: 'Personalize sua experiência',
      icon: <SettingsIcon className="w-8 h-8" />,
      color: 'bg-slate-500' 
    }
  ];

  return (
    <div className="min-h-screen pt-12 pb-20 px-4 md:px-8 max-w-4xl mx-auto flex flex-col justify-center">
      <header className="mb-12 text-center">
        <h1 className="title-main mb-2">PhotoStudio Vitrine Digital</h1>
        <p className="text-gray-500 text-lg">Inteligência Artificial para sua Moda e Memórias</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onNavigate(item.id)}
            className="card-base group hover:border-brand hover:bg-white/90 hover:shadow-xl hover:shadow-purple-100 transition-all flex flex-col items-start p-8 text-left"
          >
            <div className={`${item.color} text-white p-4 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.label}</h2>
            <p className="text-gray-500">{item.description}</p>
          </motion.button>
        ))}
      </div>
      
      <footer className="mt-20 text-center text-gray-400 text-sm">
        Vitrine Digital-Comércio Local • 2026
      </footer>
    </div>
  );
}
