
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
                placeholder="Describe tu estado, p.ej: Un bosque renaciendo tras el fuego, raíces de luz sanando la tierra..."
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl h-40 text-[15px] focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all resize-none shadow-inner"
              />
              <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">IA Generativa</div>
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
                <div className="w-full h-24 rounded-xl overflow-hidden mb-1">
                  <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Static Art" />
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${config.mode === 'image' ? 'text-teal-700' : 'text-slate-500'}`}>Imagen Estática</span>
                {config.mode === 'image' && <div className="absolute top-2 right-2 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center text-white"><svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg></div>}
              </button>
              
              <button 
                onClick={() => setConfig({...config, mode: 'video'})}
                className={`group relative overflow-hidden p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-3 ${config.mode === 'video' ? 'border-teal-500 bg-teal-50 shadow-lg' : 'border-slate-100 hover:border-teal-200 bg-white'}`}
              >
                <div className="w-full h-24 rounded-xl overflow-hidden mb-1">
                  <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Motion Art" />
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${config.mode === 'video' ? 'text-teal-700' : 'text-slate-500'}`}>Vídeo Meditativo</span>
                {config.mode === 'video' && <div className="absolute top-2 right-2 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center text-white"><svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg></div>}
              </button>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] hover:bg-teal-800 transition-all font-bold text-lg shadow-xl hover:shadow-teal-900/20 disabled:opacity-50 active:scale-[0.98] mt-4"
          >
            {loading ? 'Manifestando tu visión...' : 'Crear Visualización'}
          </button>
        </div>

        <div className="lg:col-span-7 flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] overflow-hidden min-h-[500px] relative shadow-inner group">
          {loading ? (
            <div className="text-center p-12">
              <div className="w-20 h-20 relative mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-4 border-4 border-slate-300 border-b-transparent rounded-full animate-spin [animation-duration:2s]" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">Creando Representación Simbólica</h4>
              <p className="text-sm text-slate-500 italic max-w-xs mx-auto leading-relaxed">
                Estamos procesando tu descripción para crear un puente visual hacia tu inconsciente...
              </p>
            </div>
          ) : result ? (
            <div className="w-full h-full flex flex-col items-center animate-in zoom-in duration-500">
              <div className="relative w-full h-[500px] bg-slate-900 overflow-hidden flex items-center justify-center">
                {result.type === 'image' ? (
                  <img src={result.url} className="w-full h-full object-contain shadow-2xl" alt="Result" />
                ) : (
                  <video src={result.url} controls autoPlay loop className="w-full h-full object-contain shadow-2xl" />
                )}
                <div className="absolute top-6 right-6 flex space-x-2">
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = result.url;
                      link.download = `sentir-conciencia-arte-${Date.now()}.png`;
                      link.click();
                    }}
                    className="p-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-teal-500 transition-all border border-white/20 shadow-xl"
                    title="Descargar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  </button>
                </div>
              </div>
              <div className="p-6 bg-slate-900 w-full flex items-center justify-between border-t border-white/10">
                <div className="text-slate-400 text-xs italic">Generado con Sentir Conciencia AI</div>
                <button 
                  onClick={() => { setPrompt(''); setResult(null); }}
                  className="text-teal-400 text-xs font-bold uppercase tracking-widest hover:text-teal-300 transition-colors"
                >
                  Nueva Creación
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-12 opacity-60 group-hover:opacity-100 transition-opacity">
               <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
               </div>
               <p className="text-slate-500 font-medium max-w-[200px] mx-auto leading-relaxed uppercase tracking-widest text-[11px]">
                  Introduce una descripción a la izquierda para ver la magia manifestarse
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTools;
