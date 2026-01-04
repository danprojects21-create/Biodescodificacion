
import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import LiveSession from './components/LiveSession';
import CreativeTools from './components/CreativeTools';
import { ViewMode } from './types';

const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20000ms] scale-110 animate-pulse"
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
          Biodescodificación Simbólica & Bienestar
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-12">
          {[
            { 
              title: "Exploración Profunda", 
              desc: "Descubre los significados ocultos tras tus síntomas físicos.",
              img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400" 
            },
            { 
              title: "Encuentro por Voz", 
              desc: "Diálogos fluidos y empáticos en tiempo real.",
              img: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=400"
            }
          ].map((card, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 flex items-start space-x-4 hover:bg-white/10 transition-all cursor-default">
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1">{card.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{card.desc}</p>
              </div>
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-6 w-full">
          <button
            onClick={onStart}
            className="group relative px-16 py-5 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-full text-xl font-bold transition-all shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:shadow-[0_0_60px_rgba(20,184,166,0.5)] transform hover:scale-105 active:scale-95"
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

  if (showIntro) {
    return <IntroScreen onStart={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView(ViewMode.CHAT)}>
          <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-teal-600/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl serif font-bold text-slate-800 leading-none">Sentir Conciencia</h1>
            <p className="text-[10px] text-teal-600 uppercase tracking-widest font-semibold mt-1">Biodescodificación</p>
          </div>
        </div>
        
        <nav className="hidden md:flex space-x-1 bg-slate-100 p-1 rounded-full border border-slate-200">
          {[
            { id: ViewMode.CHAT, label: 'Chat de Exploración' },
            { id: ViewMode.LIVE, label: 'Voz en Vivo' },
            { id: ViewMode.CREATIVE, label: 'Arte Simbólico' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                view === item.id 
                ? 'bg-white text-teal-800 shadow-sm ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto p-4 md:p-8 overflow-hidden">
        <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          {view === ViewMode.CHAT && <ChatInterface />}
          {view === ViewMode.LIVE && <LiveSession />}
          {view === ViewMode.CREATIVE && <CreativeTools />}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white/90 backdrop-blur-lg border-t border-slate-200 px-4 py-3 flex justify-around items-center sticky bottom-0 z-50 shadow-2xl">
        <button onClick={() => setView(ViewMode.CHAT)} className={`flex flex-col items-center transition-colors ${view === ViewMode.CHAT ? 'text-teal-600' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          <span className="text-[10px] mt-1 font-bold uppercase">Chat</span>
        </button>
        <button onClick={() => setView(ViewMode.LIVE)} className={`flex flex-col items-center transition-colors ${view === ViewMode.LIVE ? 'text-teal-600' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
          <span className="text-[10px] mt-1 font-bold uppercase">Voz</span>
        </button>
        <button onClick={() => setView(ViewMode.CREATIVE)} className={`flex flex-col items-center transition-colors ${view === ViewMode.CREATIVE ? 'text-teal-600' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122l9.37-9.37a2.803 2.803 0 113.965 3.965L13.5 20.086a2.803 2.803 0 01-3.965 0l-1.447-1.447c-.035-.035-.072-.072-.11-.109l-1.09-1.09a2.803 2.803 0 010-3.965l1.09-1.09a2.803 2.803 0 013.965 0l1.09 1.09c.038.038.075.074.11.109l1.447 1.447a2.803 2.803 0 010 3.965l-1.447 1.447z" />
          </svg>
          <span className="text-[10px] mt-1 font-bold uppercase">Arte</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
