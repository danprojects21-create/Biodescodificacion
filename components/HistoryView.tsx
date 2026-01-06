
import React, { useState } from 'react';
import { ChatMessage, AppSettings } from '../types';
import { THEMES, VOICE_MAP } from '../constants';
import { gemini } from '../services/geminiService';

interface HistoryViewProps {
  messages: ChatMessage[];
  settings: AppSettings;
  setCurrentTts: (data: string | null) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ messages, settings, setCurrentTts }) => {
  const theme = THEMES[settings.theme as keyof typeof THEMES];
  const [playingId, setPlayingId] = useState<string | null>(null);

  const renderFormattedText = (text: string) => {
    return <div 
      className="prose prose-slate max-w-none text-sm md:text-base"
      dangerouslySetInnerHTML={{ __html: text }} 
    />;
  };

  const playAudioForMessage = async (msg: ChatMessage) => {
    if (playingId === msg.id) return;
    setPlayingId(msg.id);
    try {
      const voiceMatch = msg.text.split(/<b>VERSIÓN PARA VOZ<\/b>/i);
      const voiceText = voiceMatch.length > 1 
        ? voiceMatch[1].replace(/<[^>]*>/g, '').trim() 
        : msg.text.replace(/<[^>]*>/g, '').trim();
      
      const ttsData = await gemini.generateTTS(voiceText, VOICE_MAP[settings.voice]);
      if (ttsData) setCurrentTts(ttsData);
    } catch (err) {
      console.error("Error generating TTS", err);
    } finally {
      setPlayingId(null);
    }
  };

  // Fixed: Removed type arguments from reduce call and explicitly typed the initial value to resolve "Untyped function calls may not accept type arguments" error.
  const groupedMessages = messages.reduce((groups: Record<string, ChatMessage[]>, message) => {
    const date = message.timestamp.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, ChatMessage[]>);

  return (
    <div className="h-full max-w-4xl mx-auto flex flex-col space-y-8 pb-20 overflow-y-auto px-4 md:px-0">
      <div className="text-center pt-10">
        <h2 className={`text-4xl serif font-bold ${theme.text} mb-3`}>Tu Diario de Conciencia</h2>
        <p className="text-slate-500 max-w-xl mx-auto">
          Un registro de tu camino hacia el bienestar. Revisa tus reflexiones y las guías simbólicas para profundizar en tu proceso.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white/50 rounded-[2.5rem] border border-dashed border-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-slate-300 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <p className="text-slate-400 font-medium">Aún no hay registros en tu diario.</p>
        </div>
      ) : (
        // Fixed: Explicitly cast Object.entries result to resolve "Property 'map' does not exist on type 'unknown'" error.
        (Object.entries(groupedMessages) as [string, ChatMessage[]][]).reverse().map(([date, msgs]) => (
          <div key={date} className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className={`h-px flex-1 ${theme.primary} opacity-10`} />
              <span className={`text-xs font-bold uppercase tracking-widest ${theme.accent}`}>{date}</span>
              <div className={`h-px flex-1 ${theme.primary} opacity-10`} />
            </div>

            <div className="space-y-4">
              {msgs.map((m) => (
                <div 
                  key={m.id} 
                  className={`p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md relative group ${
                    m.role === 'user' 
                    ? 'bg-white border-slate-100 ml-12' 
                    : `${theme.secondary} border-transparent mr-12`
                  }`}
                >
                  {m.role === 'model' && (
                    <button 
                      onClick={() => playAudioForMessage(m)}
                      disabled={playingId === m.id}
                      className={`absolute -right-12 top-0 p-2 rounded-full shadow-sm border transition-all ${
                        playingId === m.id ? 'bg-teal-100 text-teal-600 animate-pulse' : 'bg-white text-slate-400 hover:text-teal-600 hover:scale-110 border-slate-100'
                      } opacity-0 group-hover:opacity-100`}
                    >
                      {playingId === m.id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                      )}
                    </button>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-tighter ${m.role === 'user' ? 'text-slate-400' : theme.accent}`}>
                      {m.role === 'user' ? 'Tú' : 'Acompañante'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-slate-700 leading-relaxed">
                    {m.role === 'model' ? renderFormattedText(m.text) : m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryView;
