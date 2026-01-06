
import React, { useState, useRef, useEffect } from 'react';
import { gemini } from '../services/geminiService';
import { ChatMessage, AppSettings } from '../types';
import { VOICE_MAP, THEMES } from '../constants';

interface ChatInterfaceProps {
  settings: AppSettings;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setCurrentTts: (data: string | null) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ settings, messages, setMessages, setCurrentTts }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[settings.theme as keyof typeof THEMES];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const renderFormattedText = (text: string) => {
    return <div 
      className="prose prose-slate max-w-none"
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

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const result = await gemini.chat(input, history);
      const fullText = result.text || "Lo siento, no pude procesar la respuesta.";
      const grounding = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: fullText,
        timestamp: new Date(),
        grounding: grounding
      };

      setMessages(prev => [...prev, modelMsg]);

      if (settings.autoPlay) {
        playAudioForMessage(modelMsg);
      }
    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes("Requested entity was not found.")) {
        window.aistudio.openSelectKey();
      }
      setMessages(prev => [...prev, {
        id: 'err',
        role: 'model',
        text: "Error al conectar con el acompañante. Por favor, verifica tu conexión o configuración de API.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border ${theme.border}`}>
      <div className={`p-5 ${theme.primary} text-white flex justify-between items-center shadow-lg transition-colors duration-500`}>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl serif font-bold tracking-tight">Sesión de Acompañamiento</h2>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <p className="text-[11px] opacity-80 uppercase font-bold tracking-widest">
                Voz {settings.voice === 'female' ? 'Femenina' : 'Masculina'} activa
              </p>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef} 
        className={`flex-1 overflow-y-auto p-6 space-y-6 relative ${theme.secondary} transition-colors duration-500`}
      >
        {messages.length === 0 && (
          <div className="text-center py-20 px-10 animate-in fade-in zoom-in duration-1000">
            <h3 className={`text-3xl serif ${theme.text} font-bold mb-3`}>Tu Bienestar Comienza Aquí</h3>
            <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
              Describe lo que sientes o el <b><u>síntoma</u></b> que te preocupa. Juntos exploraremos su raíz simbólica con paciencia y conciencia.
            </p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-${m.role === 'user' ? 'right' : 'left'}-4 duration-300`}>
            <div className={`max-w-[80%] rounded-[1.5rem] p-5 shadow-lg border transition-all relative group ${
              m.role === 'user' 
              ? `${theme.primary} text-white border-transparent rounded-tr-none` 
              : `bg-white border-slate-200 text-slate-800 rounded-tl-none`
            }`}>
              
              {m.role === 'model' && (
                <button 
                  onClick={() => playAudioForMessage(m)}
                  disabled={playingId === m.id}
                  className={`absolute -right-12 top-0 p-2 rounded-full shadow-sm border transition-all ${
                    playingId === m.id ? 'bg-teal-100 text-teal-600 animate-pulse' : 'bg-white text-slate-400 hover:text-teal-600 hover:scale-110 border-slate-100'
                  } opacity-0 group-hover:opacity-100`}
                  title="Reproducir Audio"
                >
                  {playingId === m.id ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                  )}
                </button>
              )}

              <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                {m.role === 'model' ? renderFormattedText(m.text) : m.text}
              </div>

              {m.role === 'model' && m.grounding && m.grounding.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Referencias externas:</p>
                  <div className="flex flex-wrap gap-2">
                    {m.grounding.map((chunk: any, i: number) => (
                      chunk.web && (
                        <a 
                          key={i} 
                          href={chunk.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[11px] bg-slate-50 border border-slate-200 px-2 py-1 rounded-md text-teal-600 hover:bg-teal-50 transition-colors"
                        >
                          {chunk.web.title || 'Fuente'}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}

              <div className={`text-[10px] mt-3 opacity-60 font-bold uppercase tracking-widest flex items-center ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-md rounded-tl-none">
              <div className="flex space-x-1.5">
                <div className={`w-2.5 h-2.5 ${theme.primary} rounded-full animate-bounce opacity-40`}></div>
                <div className={`w-2.5 h-2.5 ${theme.primary} rounded-full animate-bounce opacity-70 [animation-delay:-0.15s]`}></div>
                <div className={`w-2.5 h-2.5 ${theme.primary} rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mt-3">
            <div className="relative flex-1 group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu mensaje aquí..."
                className="w-full p-4 pl-6 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-slate-300 transition-all text-[15px] placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={loading}
              className={`${theme.primary} text-white p-4 rounded-2xl hover:brightness-110 transition-all shadow-lg disabled:opacity-50 active:scale-95 shrink-0`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
