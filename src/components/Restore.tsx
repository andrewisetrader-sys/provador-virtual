import { Download, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { processRestorePhoto } from '../lib/gemini';
import { ProcessedImage } from '../types';
import { compressImage } from '../lib/utils';
import FilePicker from './FilePicker';

interface RestoreProps {
  onSave: (img: ProcessedImage) => void;
}

export default function Restore({ onSave }: RestoreProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleGenerate = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setLoadingStep('Otimizando imagem...');
    try {
      const compressed = await compressImage(originalImage);
      
      setLoadingStep('Restaurando em 8K com IA...');
      const result = await processRestorePhoto(compressed, prompt || 'Restaurar mantendo fidelidade, remover riscos, colorização natural');
      
      const newImg: ProcessedImage = {
        id: crypto.randomUUID(),
        type: 'restore',
        originalUrl: compressed,
        resultUrl: result,
        timestamp: Date.now(),
        prompt: prompt || 'Restauração Completa 8K',
        title: 'Restauração - ' + new Date().toLocaleDateString('pt-BR'),
        technicalInfo: 'Upscale 8K Realista, Colorização Natural'
      };
      
      setResultImage(result);
      onSave(newImg);
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Ocorreu um erro ao restaurar.');
    } finally {
      setIsProcessing(false);
      setLoadingStep('');
    }
  };

  const downloadImage = (format: 'png' | 'jpg') => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `photostudio-restored-${Date.now()}.${format}`;
    link.click();
  };

  return (
    <div className="max-w-[1400px] mx-auto pt-24 pb-12 px-4 md:px-8 min-h-screen">
      <div className="mb-8">
        <h2 className="title-main text-2xl md:text-3xl mb-1">Restaurador de Imagens 8K</h2>
        <p className="text-gray-500">Recupere memórias com limpeza profunda, colorização natural e resolução ultra-nítida.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna da Esquerda: Controle */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-base p-6 bg-gray-50/50">
            <FilePicker 
              label="Foto Antiga / Danificada" 
              onSelect={setOriginalImage} 
              currentImage={originalImage || undefined}
              onClear={() => setOriginalImage(null)}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2 text-sm">Prompt de Restauração (opcional)</label>
              <textarea 
                placeholder="Aumentar nitidez, remover danos, restaurar cores naturais, alta resolução, aparência realista."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full card-base p-4 text-base focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none resize-none transition-all"
                rows={4}
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={!originalImage || isProcessing}
              className="btn-primary w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {loadingStep}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Restauração
                </>
              )}
            </button>
          </div>
          
          <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
            <h3 className="font-bold text-indigo-800 mb-2 text-sm">Dica Profissional</h3>
            <p className="text-indigo-600 text-xs">
              Para fotos muito danificadas, tente descrever elementos específicos como "olhos azuis" ou "vestido branco" para ajudar a IA na colorização.
            </p>
          </div>
        </div>

        {/* Coluna da Direita: Resultado */}
        <div className="lg:col-span-8">
          <div className="card-base h-full flex flex-col bg-slate-50 border-2 border-dashed border-slate-200 relative min-h-[600px] shadow-inner">
            {resultImage ? (
              <div className="flex-1 flex flex-col p-6 animate-in fade-in zoom-in duration-500">
                <div className="relative flex-1 bg-white rounded-2xl shadow-xl overflow-hidden flex items-center justify-center group">
                  <img 
                    src={showOriginal ? originalImage! : resultImage} 
                    alt="Visualização" 
                    className="max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Tags Antes e Depois */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-slate-900/80 backdrop-blur text-white px-3 py-1.5 rounded-lg font-bold text-xs">
                      Original
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg">
                      Restaurada (8K)
                    </span>
                  </div>

                  {/* Toggle Comparison Overlay */}
                  <button 
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-2xl border border-gray-100 px-8 py-3 rounded-full font-bold text-gray-900 hover:bg-white transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Wand2 className="w-5 h-5 text-indigo-600" />
                    {showOriginal ? 'Ver Versão 8K' : 'Ver Foto Original'}
                  </button>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <button 
                    onClick={() => {
                        setResultImage(null);
                        setShowOriginal(false);
                    }}
                    className="text-gray-500 font-bold hover:text-gray-700 px-4 py-2"
                  >
                    Nova Imagem
                  </button>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => downloadImage('jpg')}
                      className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Baixar JPG
                    </button>
                    <button 
                      onClick={() => downloadImage('png')}
                      className="btn-primary py-3 px-8 bg-indigo-600"
                    >
                      <Download className="w-5 h-5" />
                      Baixar PNG
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6 text-indigo-200">
                  <Sparkles className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">Workspace de Restauração</h3>
                <p className="text-slate-400 max-w-xs text-sm">
                  Faça o upload da foto e clique em gerar para ver a mágica acontecer aqui.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Melhores Práticas Extras */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: <Sparkles />, title: 'Restauração Profunda', text: 'Remove rasgos e dobras físicas.' },
          { icon: <Wand2 />, title: 'Colorização IA', text: 'Tons de pele e cenários reais.' },
          { icon: <Loader2 />, title: 'Saída 8K', text: 'Resolução otimizada para impressão.' },
          { icon: <Download />, title: 'Exportação Segura', text: 'Arquivos em alta definição.' },
        ].map((item, i) => (
          <div key={i} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-start gap-3">
             <div className="text-indigo-600 mt-1">{item.icon}</div>
             <div>
               <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
               <p className="text-gray-500 text-xs">{item.text}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
