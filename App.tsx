
import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import LiveSession from './components/LiveSession';
import CreativeTools from './components/CreativeTools';
import { ViewMode } from './types';

const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20000ms] scale-110"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=2000")',
          animation: 'slow-pan 60s infinite alternate ease-in-out'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-teal-900/60 via-slate-900/80 to-slate-900" />

      <div className="relative z-10 max-w-4xl w-full px-6 py-12 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="w-24 h-24 bg-teal-500/20 backdrop-blur-xl border border-teal-400/30 rounded-[2rem] flex items-center justify-center text-white shadow-2xl mb-8 transform hover:rotate-6 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-teal-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          </svg>
        </div>

        <h1 className="text-5xl md:text-7xl serif font-bold text-white text-center mb-4 tracking-tight">
          Sentir Conciencia
        </h1>
        <p className="text-teal-300 font-semibold tracking-[0.3em] uppercase text-sm mb-12 text-center">
          Biodescodificación Simbólica y Bienestar
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-12">
          <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 flex items-start space-x-4 hover:bg-white/10 transition-all cursor-default">
            <div className="flex-1">
              <h3 className="text-white font-bold mb-1">Exploración Profunda</h3>
              <p className="text-slate-300 text-sm leading-relaxed">Descubre los significados ocultos tras tus procesos corporales.</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 flex items-start space-x-4 hover:bg-white/10 transition-all cursor-default">
            <div className="flex-1">
              <h3 className="text-white font-bold mb-1">Encuentro por Voz</h3>
              <p className="text-slate-300 text-sm leading-relaxed">Diálogos fluidos y empáticos en tiempo real.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6 w-full">
          <button
            onClick={onStart}
            className="group relative px-16 py-5 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-full text-xl font-bold transition-all shadow-[0_0_40px_rgba(20,184,166,0.3)] transform hover:scale-105 active:scale-95"
          >
            Comenzar mi proceso
          </button>
          <p className="text-[10px] text-slate-400 text-center max-w-lg uppercase tracking-wider opacity-60">
            Acompañamiento emocional profesional no clínico • 2025
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slow-pan {
          from { transform: scale(1.1) translateX(-2%); }
          to { transform: scale(1.1) translateX(2%); }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.CHAT);
  const [showIntro, setShowIntro] = useState(true);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        // Si no estamos en el entorno de AI Studio, asumimos que se usa la env var de Vercel
        setHasKey(!!process.env.API_KEY);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  if (showIntro) {
    return <IntroScreen onStart={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in fade-in duration-500">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView(ViewMode.CHAT)}>
          <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl serif font-bold text-slate-800 leading-none">Sentir Conciencia</h1>
            <p className="text-[10px] text-teal-600 uppercase tracking-widest font-semibold mt-1">Biodescodificación</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-4">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-full border border-slate-200">
            {[
              { id: ViewMode.CHAT, label: 'Exploración' },
              { id: ViewMode.LIVE, label: 'Voz' },
              { id: ViewMode.CREATIVE, label: 'Arte' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  view === item.id 
                  ? 'bg-white text-teal-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          {window.aistudio && (
            <button 
              onClick={handleOpenKeySelector}
              className={`p-2 rounded-full transition-colors ${hasKey ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50 animate-pulse'}`}
              title={hasKey ? "Clave configurada" : "Configurar Clave de Generación"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </button>
          )}
        </nav>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8 overflow-hidden">
        <div className="h-full animate-in fade-in duration-500">
          {view === ViewMode.CHAT && <ChatInterface />}
          {view === ViewMode.LIVE && <LiveSession />}
          {view === ViewMode.CREATIVE && <CreativeTools />}
        </div>
      </main>

      <nav className="md:hidden bg-white/90 backdrop-blur-lg border-t border-slate-200 px-4 py-3 flex justify-around items-center sticky bottom-0 z-50">
        <button onClick={() => setView(ViewMode.CHAT)} className={`flex flex-col items-center transition-colors ${view === ViewMode.CHAT ? 'text-teal-600' : 'text-slate-400'}`}>
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="text-[10px] font-bold uppercase">Chat</span>
        </button>
        <button onClick={() => setView(ViewMode.LIVE)} className={`flex flex-col items-center transition-colors ${view === ViewMode.LIVE ? 'text-teal-600' : 'text-slate-400'}`}>
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="text-[10px] font-bold uppercase">Voz</span>
        </button>
        <button onClick={() => setView(ViewMode.CREATIVE)} className={`flex flex-col items-center transition-colors ${view === ViewMode.CREATIVE ? 'text-teal-600' : 'text-slate-400'}`}>
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="text-[10px] font-bold uppercase">Arte</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
