import { Download, ExternalLink, Trash2, FileArchive } from 'lucide-react';
import JSZip from 'jszip';
import { ProcessedImage } from '../types';

interface HistoryProps {
  history: ProcessedImage[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function History({ history, onDelete, onClearAll }: HistoryProps) {
  const downloadZip = async () => {
    const zip = new JSZip();
    
    for (const item of history) {
      // Result
      const resultData = item.resultUrl.split(',')[1];
      zip.file(`${item.id}-resultado.png`, resultData, { base64: true });
      
      // Original
      const originalData = item.originalUrl.split(',')[1];
      zip.file(`${item.id}-original.png`, originalData, { base64: true });
    }
    
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `photo-fit-history-${Date.now()}.zip`;
    link.click();
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="bg-gray-100 p-8 rounded-full mb-6">
          <FileArchive className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Histórico Vazio</h2>
        <p className="text-gray-500 max-w-xs">Suas criações aparecerão aqui assim que você processar a primeira imagem.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-24 pb-20 px-4 md:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-gray-500">Últimas {history.length} criações</h2>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={downloadZip}
            className="flex items-center gap-2 text-brand font-bold hover:bg-brand-light px-4 py-2 rounded-xl transition-colors"
          >
            <Download className="w-5 h-5" />
            Baixar Tudo (.ZIP)
          </button>
          <button 
            onClick={onClearAll}
            className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors"
            title="Limpar tudo"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <div key={item.id} className="card-base group">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <img 
                src={item.resultUrl} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="flex gap-2">
                   <button 
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = item.resultUrl;
                        link.download = `${item.id}.png`;
                        link.click();
                    }}
                    className="flex-1 bg-white hover:bg-gray-100 text-gray-900 font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" /> Baixar
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 flex justify-between items-start">
              <div className="overflow-hidden">
                <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleString('pt-BR')}</p>
                <div className="mt-2 flex gap-2">
                   <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${item.type === 'try-on' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {item.type === 'try-on' ? 'Provador' : 'Restauração'}
                   </span>
                </div>
              </div>
              <button 
                onClick={() => onDelete(item.id)}
                className="text-gray-400 hover:text-red-500 p-1"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
