import { ChevronDown, ChevronUp, Copy, Check, MousePointer2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PromptOption {
  title: string;
  content: string;
}

const prompts: PromptOption[] = [
  {
    title: 'Loja moderna',
    content: 'Manter fielmente o rosto original da modelo, preservando identidade, traços faciais, formato do rosto, olhos, nariz e expressão, sem alterações. Aplicar a roupa com encaixe perfeito ao corpo, respeitando proporções anatômicas reais, tecido alinhado ao busto, cintura e quadril, sem distorções. Modelo em pé, olhando levemente para o lado, dentro de uma loja moderna, iluminação suave natural, fundo organizado, estilo comercial elegante, alta fidelidade, manter identidade facial original, não modificar rosto, proporções corretas, sem deformações.'
  },
  {
    title: 'Lifestyle natural',
    content: 'Preservar completamente o rosto original da modelo, mantendo todos os traços e identidade sem modificações. Aplicar a roupa com ajuste realista ao corpo, respeitando anatomia natural e proporções corretas, sem deformações. Modelo caminhando em ambiente externo com luz natural, estilo lifestyle, aparência espontânea e realista, manter identidade facial, sem alterações no rosto.'
  },
  {
    title: 'Editorial sofisticado',
    content: 'Manter o rosto original da modelo com total fidelidade, sem alterar traços, expressão ou identidade. Roupa aplicada com caimento preciso e proporcional ao corpo, mantendo design original da peça. Pose confiante, fundo neutro sofisticado, iluminação de estúdio, estilo editorial de moda, sem distorções, alta qualidade.'
  },
  {
    title: 'UGC / Cliente real',
    content: 'Preservar fielmente o rosto da modelo, mantendo identidade e características originais. Aplicar a roupa com ajuste natural ao corpo, sem distorções ou esticamentos irreais. Selfie no espelho, ambiente casual, iluminação natural, estilo UGC autêntico.'
  },
  {
    title: 'Look do dia',
    content: 'Manter o rosto original da modelo sem qualquer alteração, preservando todos os detalhes faciais. Roupa com encaixe anatômico perfeito, destacando proporções naturais do corpo, sem deformações. Pose leve sorrindo, fundo clean, iluminação clara, estilo Instagram.'
  },
  {
    title: 'Comercial de vendas',
    content: 'Preservar totalmente o rosto e identidade da modelo, sem mudanças nos traços. Aplicar a roupa com ajuste preciso ao corpo, respeitando volume e estrutura original da peça. Postura confiante, ambiente de loja ao fundo, iluminação destacando o produto, estilo comercial.'
  },
  {
    title: 'Urbano fashion',
    content: 'Manter fielmente o rosto da modelo, sem alterar identidade ou características faciais. Roupa com caimento natural e proporcional ao corpo. Cenário urbano moderno, pose andando, estilo street fashion, iluminação natural.'
  },
  {
    title: 'Provador de loja',
    content: 'Preservar completamente o rosto original da modelo. Aplicar a roupa com ajuste fiel ao corpo, respeitando anatomia real. Ambiente de provador com espelho, pose natural ajustando a peça, iluminação suave.'
  },
  {
    title: 'Minimalista premium',
    content: 'Manter o rosto original da modelo com total fidelidade. Roupa com encaixe perfeito e proporcional ao corpo. Fundo neutro, iluminação suave, foco total na peça, estilo minimalista sofisticado.'
  },
  {
    title: 'Movimento e fluidez',
    content: 'Preservar fielmente o rosto da modelo. Roupa com caimento realista em movimento, tecido fluindo naturalmente sem deformações. Modelo em movimento leve (andar ou girar), iluminação natural, fundo elegante.'
  }
];

interface PromptLibraryProps {
  onSelect: (content: string) => void;
}

export default function PromptLibrary({ onSelect }: PromptLibraryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="card-base bg-white/70 backdrop-blur-md h-full flex flex-col p-6 shadow-sm border-gray-100/50">
      <h3 className="font-display font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
        <MousePointer2 className="w-5 h-5 text-brand" />
        Comandos para provador
      </h3>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {prompts.map((prompt, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`border rounded-2xl transition-all duration-200 ${
                isOpen ? 'border-brand bg-brand-light/20 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left group"
              >
                <span className={`font-bold text-sm ${isOpen ? 'text-brand' : 'text-gray-700'}`}>
                  {prompt.title}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-brand" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                )}
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <div className="bg-white/50 border border-brand/10 p-3 rounded-xl text-[11px] leading-relaxed text-gray-600 mb-4">
                        {prompt.content}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onSelect(prompt.content)}
                          className="flex-1 bg-brand text-white text-[10px] uppercase font-bold py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <MousePointer2 className="w-3 h-3" />
                          Usar este prompt
                        </button>
                        <button
                          onClick={() => handleCopy(prompt.content, index)}
                          className="flex-1 border border-gray-200 text-gray-600 text-[10px] uppercase font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-3 h-3 text-green-500" />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copiar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
