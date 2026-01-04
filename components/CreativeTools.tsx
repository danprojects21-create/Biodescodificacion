
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';

const CreativeTools: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [config, setConfig] = useState({
    ratio: '1:1',
    size: '1K',
    mode: 'image' as 'image' | 'video'
  });

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);
    try {
      if (config.mode === 'image') {
        const url = await gemini.generateSymbolicImage(prompt, config.ratio, config.size);
        if (url) setResult({ url, type: 'image' });
      } else {
        const url = await gemini.generateMeditativeVideo(prompt, config.ratio as any);
        if (url) setResult({ url, type: 'video' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-[2.5rem] shadow-2xl max-w-6xl mx-auto h-full overflow-y-auto border border-slate-100">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl serif font-bold text-slate-800 mb-3">Arte Simbólico y Visualización</h2>
        <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
          Transforma tus sensaciones internas en representaciones visuales. La imagen ayuda a la mente a integrar nuevos mensajes de salud.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600">Paso 1</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            <label className="block text-sm font-bold text-slate-700">¿Qué imagen habita en tu interior?</label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe tu estado de forma libre: Un bosque renaciendo o raíces de luz sanando la tierra..."
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl h-40 text-[15px] focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all resize-none shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600">Paso 2</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            <label className="block text-sm font-bold text-slate-700">Elige el formato de integración</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setConfig({...config, mode: 'image'})}
                className={`group relative overflow-hidden p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-3 ${config.mode === 'image' ? 'border-teal-500 bg-teal-50 shadow-lg' : 'border-slate-100 hover:border-teal-200 bg-white'}`}
              >
                <span className={`text-xs font-bold uppercase tracking-widest ${config.mode === 'image' ? 'text-teal-700' : 'text-slate-500'}`}>Imagen Estática</span>
              </button>
              
              <button 
                onClick={() => setConfig({...config, mode: 'video'})}
                className={`group relative overflow-hidden p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-3 ${config.mode === 'video' ? 'border-teal-500 bg-teal-50 shadow-lg' : 'border-slate-100 hover:border-teal-200 bg-white'}`}
              >
                <span className={`text-xs font-bold uppercase tracking-widest ${config.mode === 'video' ? 'text-teal-700' : 'text-slate-500'}`}>Vídeo Meditativo</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] hover:bg-teal-800 transition-all font-bold text-lg shadow-xl disabled:opacity-50 active:scale-[0.98] mt-4"
          >
            {loading ? 'Manifestando tu visión...' : 'Crear Visualización'}
          </button>
        </div>

        <div className="lg:col-span-7 flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] overflow-hidden min-h-[500px] relative shadow-inner group">
          {loading ? (
            <div className="text-center p-12">
              <h4 className="text-xl font-bold text-slate-800 mb-2">Creando Representación Simbólica</h4>
              <p className="text-sm text-slate-500 italic max-w-xs mx-auto leading-relaxed">
                Estamos procesando tu descripción para crear un puente visual hacia tu inconsciente...
              </p>
            </div>
          ) : result ? (
            <div className="w-full h-full flex flex-col items-center animate-in zoom-in duration-500">
              <div className="relative w-full h-[500px] bg-slate-900 overflow-hidden flex items-center justify-center">
                {result.type === 'image' ? (
                  <img src={result.url} className="w-full h-full object-contain shadow-2xl" alt="Resultado Visual" />
                ) : (
                  <video src={result.url} controls autoPlay loop className="w-full h-full object-contain shadow-2xl" />
                )}
              </div>
              <div className="p-6 bg-slate-900 w-full flex items-center justify-between">
                <div className="text-slate-400 text-xs italic">Generado con Sentir Conciencia AI</div>
                <button 
                  onClick={() => { setPrompt(''); setResult(null); }}
                  className="text-teal-400 text-xs font-bold uppercase tracking-widest hover:text-teal-300"
                >
                  Nueva Creación
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-12 opacity-60">
               <p className="text-slate-500 font-medium max-w-[200px] mx-auto leading-relaxed uppercase tracking-widest text-[11px]">
                  Introduce una descripción a la izquierda para ver la representación visual
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTools;
