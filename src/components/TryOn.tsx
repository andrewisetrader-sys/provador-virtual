import { Download, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { processVirtualTryOn } from '../lib/gemini';
import { ProcessedImage } from '../types';
import { compressImage } from '../lib/utils';
import FilePicker from './FilePicker';
import PromptLibrary from './PromptLibrary';

interface TryOnProps {
  onSave: (img: ProcessedImage) => void;
}

export default function TryOn({ onSave }: TryOnProps) {
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleGenerate = async () => {
    if (!modelImage || !clothingImage) return;

    setIsProcessing(true);
    setLoadingStep('Otimizando imagens...');
    try {
      const compressedModel = await compressImage(modelImage);
      const compressedClothing = await compressImage(clothingImage);
      
      setLoadingStep('Processando no Provador com IA...');
      const result = await processVirtualTryOn(compressedModel, compressedClothing, prompt || 'Foto realista, look editorial, luz suave natural');
      
      const newImg: ProcessedImage = {
        id: crypto.randomUUID(),
        type: 'try-on',
        originalUrl: compressedModel,
        clothingUrl: compressedClothing,
        resultUrl: result,
        timestamp: Date.now(),
        prompt: prompt || 'Estilo padrão',
        title: 'Provador Virtual - ' + new Date().toLocaleDateString('pt-BR'),
        technicalInfo: 'Processado com Gemini 3.1 Flash'
      };
      
      setResultImage(result);
      onSave(newImg);
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Ocorreu um erro ao processar o provador.');
    } finally {
      setIsProcessing(false);
      setLoadingStep('');
    }
  };

  const downloadImage = (format: 'png' | 'jpg') => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `photostudio-tryon-${Date.now()}.${format}`;
    link.click();
  };

  return (
    <div className="max-w-[1400px] mx-auto pt-24 pb-12 px-4 md:px-8 min-h-screen">
      <div className="mb-8">
        <h2 className="title-main text-2xl md:text-3xl mb-1">Provador Virtual Profissional</h2>
        <p className="text-gray-500">Experimente roupas com realismo fotográfico, ajuste de luz e preservação de traços originais.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna Esquerda: Uploads */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-4">
            <div className="card-base p-4 bg-gray-50/50">
               <FilePicker 
                label="1. Foto da Modelo (Corpo)" 
                onSelect={setModelImage} 
                currentImage={modelImage || undefined}
                onClear={() => setModelImage(null)}
              />
            </div>
            
            <div className="card-base p-4 bg-gray-50/50">
              <FilePicker 
                label="2. Foto da Roupa / Produto" 
                onSelect={setClothingImage} 
                currentImage={clothingImage || undefined}
                onClear={() => setClothingImage(null)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2 text-sm">Ajustes de Estilo (Opcional)</label>
              <textarea 
                placeholder="Ex: 'Foto realista', 'Luz natural de estúdio', 'Visual editorial'..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full card-base p-4 text-base focus:ring-2 focus:ring-brand focus:border-brand outline-none resize-none transition-all"
                rows={2}
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={!modelImage || !clothingImage || isProcessing}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {loadingStep}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Provador Virtual
                </>
              )}
            </button>
          </div>
          
          <div className="p-5 bg-brand-light rounded-2xl border border-brand/10">
            <h3 className="font-bold text-brand mb-2 text-xs uppercase tracking-wider">Como funciona?</h3>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              Nossa IA mapeia o corpo da modelo e "veste" a nova peça respeitando as dobras, sombras e iluminação do ambiente original.
            </p>
          </div>
        </div>

        {/* Coluna Central: Resultado */}
        <div className="lg:col-span-6">
          <div className="card-base h-full flex flex-col bg-slate-50 border-2 border-dashed border-slate-200 relative min-h-[600px] shadow-inner">
            {resultImage ? (
              <div className="flex-1 flex flex-col p-6 animate-in fade-in zoom-in duration-500">
                <div className="relative flex-1 bg-white rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center">
                  <img 
                    src={showOriginal ? modelImage! : resultImage} 
                    alt="Visualização" 
                    className="max-h-full max-w-full object-contain transition-opacity duration-300"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Tags flutuantes */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-slate-900/80 backdrop-blur text-white px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-tight">
                      Modelo Original
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-brand text-white px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-tight shadow-md">
                      Resultado IA
                    </span>
                  </div>

                  <button 
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-2xl border border-gray-100 px-8 py-3 rounded-full font-bold text-gray-900 hover:bg-white transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Wand2 className="w-5 h-5 text-brand" />
                    {showOriginal ? 'Ver Resultado Final' : 'Ver Foto Original'}
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
                    Resetar
                  </button>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => downloadImage('jpg')}
                      className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      JPG
                    </button>
                    <button 
                      onClick={() => downloadImage('png')}
                      className="btn-primary py-3 px-10"
                    >
                      <Download className="w-5 h-5" />
                      Baixar PNG
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6 text-slate-200">
                  <Sparkles className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">Estúdio de Provador</h3>
                <p className="text-slate-400 max-w-xs text-sm">
                  Selecione as fotos à esquerda para processar o look virtual.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Biblioteca de Prompts */}
        <div className="lg:col-span-3 h-full min-h-[600px]">
          <PromptLibrary onSelect={(newPrompt) => setPrompt(newPrompt)} />
        </div>
      </div>
    </div>
  );
}
