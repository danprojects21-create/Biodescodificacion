
import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import LiveSession from './components/LiveSession';
import CreativeTools from './components/CreativeTools';
import SettingsPanel from './components/SettingsPanel';
import HistoryView from './components/HistoryView';
import VoicePlayer from './components/VoicePlayer';
import { ViewMode, AppSettings, ChatMessage } from './types';
import { THEMES } from './constants';

const SETTINGS_KEY = 'sentir_settings';
const CHAT_KEY = 'sentir_chat_history';

interface IntroScreenProps {
  onStart: () => void;
  hasApiKey: boolean;
  onOpenKey: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart, hasApiKey, onOpenKey }) => {
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
        <div className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] flex items-center justify-center text-white shadow-2xl mb-8 transform hover:rotate-6 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-teal-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          </svg>
        </div>

        <h1 className="text-5xl md:text-7xl serif font-bold text-white text-center mb-4 tracking-tight">
          Sentir Conciencia
        </h1>
        <p className="text-white/60 font-semibold tracking-[0.3em] uppercase text-sm mb-12 text-center">
          Biodescodificación Simbólica Personalizada
        </p>

        <div className="flex flex-col items-center space-y-6 w-full">
          {!hasApiKey ? (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-white/80 text-center max-w-sm text-sm">
                Para usar las funciones de video y arte avanzado, es necesario seleccionar una clave de API vinculada a un proyecto de GCP con facturación.
                <br />
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-teal-400 underline hover:text-teal-300">
                  Ver documentación de facturación
                </a>
              </p>
              <button
                onClick={onOpenKey}
                className="px-12 py-4 bg-teal-500 text-white rounded-full text-lg font-bold transition-all shadow-2xl transform hover:scale-105 active:scale-95"
              >
                Seleccionar Clave de API
              </button>
            </div>
          ) : (
            <button
              onClick={onStart}
              className="group relative px-16 py-5 bg-white text-slate-900 rounded-full text-xl font-bold transition-all shadow-2xl transform hover:scale-105 active:scale-95"
            >
              Comenzar mi proceso
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.CHAT);
  const [showIntro, setShowIntro] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [currentTts, setCurrentTts] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : {
      voice: 'female',
      autoPlay: true,
      theme: 'forest'
    };
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(CHAT_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }));
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const checkKey = async () => {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(selected);
    };
    checkKey();
  }, []);

  const handleOpenKey = async () => {
    await window.aistudio.openSelectKey();
    setHasApiKey(true);
  };

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  }, [messages]);

  const activeTheme = THEMES[settings.theme as keyof typeof THEMES];

  const handleClearHistory = () => {
    if (window.confirm('¿Estás seguro de que deseas borrar todo el historial de conversación?')) {
      setMessages([]);
      localStorage.removeItem(CHAT_KEY);
    }
  };

  if (showIntro) {
    return <IntroScreen onStart={() => setShowIntro(false)} hasApiKey={hasApiKey} onOpenKey={handleOpenKey} />;
  }

  return (
    <div className={`min-h-screen ${activeTheme.secondary} flex flex-col transition-colors duration-500`}>
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView(ViewMode.CHAT)}>
          <div className={`w-10 h-10 ${activeTheme.primary} rounded-lg flex items-center justify-center text-white shadow-lg transition-colors duration-500`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl serif font-bold text-slate-800 leading-none">Sentir Conciencia</h1>
            <p className={`text-[10px] ${activeTheme.accent} uppercase tracking-widest font-semibold mt-1`}>Personalizado</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-full border border-slate-200">
            {[
              { id: ViewMode.CHAT, label: 'Exploración' },
              { id: ViewMode.LIVE, label: 'Voz' },
              { id: ViewMode.HISTORY, label: 'Diario' },
              { id: ViewMode.CREATIVE, label: 'Arte' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  view === item.id 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowSettings(true)}
            className="p-3 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            title="Ajustes de Sesión"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </button>
        </nav>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8 overflow-hidden relative">
        <div className="h-full animate-in fade-in duration-500">
          {view === ViewMode.CHAT && <ChatInterface settings={settings} messages={messages} setMessages={setMessages} setCurrentTts={setCurrentTts} />}
          {view === ViewMode.LIVE && <LiveSession settings={settings} />}
          {view === ViewMode.HISTORY && <HistoryView settings={settings} messages={messages} setCurrentTts={setCurrentTts} />}
          {view === ViewMode.CREATIVE && <CreativeTools />}
        </div>
        
        {/* Global Voice Player UI overlay */}
        <div className="absolute bottom-4 right-4 z-[60]">
          <VoicePlayer base64Audio={currentTts} onFinished={() => setCurrentTts(null)} />
        </div>
      </main>

      {showSettings && (
        <SettingsPanel 
          settings={settings} 
          onUpdate={setSettings} 
          onClose={() => setShowSettings(false)}
          onClearHistory={handleClearHistory}
        />
      )}
    </div>
  );
};

export default App;
