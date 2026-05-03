import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface FilePickerProps {
  label: string;
  onSelect: (base64: string) => void;
  currentImage?: string;
  onClear: () => void;
}

export default function FilePicker({ label, onSelect, currentImage, onClear }: FilePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="file-picker-container" className="w-full">
      <p className="font-bold text-gray-800 mb-2 text-xs uppercase tracking-wider">{label}</p>
      
      {currentImage ? (
        <div className="relative aspect-square card-base bg-white flex items-center justify-center p-2 border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <img 
            src={currentImage} 
            alt="Preview" 
            className="max-h-full max-w-full object-cover rounded-lg"
            referrerPolicy="no-referrer"
          />
          <button 
            onClick={onClear}
            className="absolute top-2 right-2 bg-white/90 backdrop-blur p-1.5 rounded-full shadow-md hover:bg-white text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center aspect-square card-base border-dashed border-2 bg-white border-gray-200 hover:border-brand hover:shadow-lg cursor-pointer transition-all group p-4 text-center">
          <div className="bg-slate-50 group-hover:bg-brand-light text-slate-400 group-hover:text-brand p-4 rounded-2xl mb-4 transition-all group-hover:rotate-6">
            <Upload className="w-6 h-6" />
          </div>
          <span className="text-gray-700 font-bold text-sm mb-1">Click to Upload</span>
          <span className="text-gray-400 text-[10px]">JPEG or PNG supported</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
}
