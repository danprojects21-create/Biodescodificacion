
import React, { useState, useRef, useEffect } from 'react';
import { gemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import VoicePlayer from './VoicePlayer';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTts, setCurrentTts] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const renderFormattedText = (text: string) => {
    // Reemplazamos cualquier residuo de asteriscos por si el modelo falla, 
    // pero priorizamos las etiquetas que el modelo enviará según el sistema.
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>');
    
    return <div 
      className="prose prose-slate max-w-none"
      dangerouslySetInnerHTML={{ __html: cleanText }} 
    />;
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
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: fullText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMsg]);

      // Buscar versión voz sin asteriscos
      const voiceMatch = fullText.split(/<b>VERSIÓN PARA VOZ<\/b>/i);
      if (voiceMatch.length > 1) {
        const voiceText = voiceMatch[1].replace(/<[^>]*>/g, '').trim();
        const ttsData = await gemini.generateTTS(voiceText);
        if (ttsData) setCurrentTts(ttsData);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: 'err',
        role: 'model',
        text: "Error al conectar con el acompañante. Intenta de nuevo.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
      <div className="p-5 bg-gradient-to-r from-teal-800 to-teal-900 text-white flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-teal-100/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-teal-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl serif font-bold tracking-tight">Sesión de Acompañamiento</h2>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <p className="text-[11px] opacity-80 uppercase font-bold tracking-widest">En sintonía con tu proceso</p>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-6 space-y-6 relative bg-slate-50"
      >
        {messages.length === 0 && (
          <div className="text-center py-20 px-10 animate-in fade-in zoom-in duration-1000">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.191 6.09l4.744 2.372a2.25 2.25 0 011.065 2.571L18.96 17.5a2.25 2.25 0 01-2.025 1.5h-9.87a2.25 2.25 0 01-2.025-1.5l-2.04-6.467a2.25 2.25 0 011.065-2.57l4.744-2.373a2.25 2.25 0 012.36 0l4.744 2.373z" />
              </svg>
            </div>
            <h3 className="text-3xl serif text-slate-800 font-bold mb-3">Tu Bienestar Comienza Aquí</h3>
            <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
              Describe lo que sientes o el <b><u>síntoma</u></b> que te preocupa. Juntos exploraremos su raíz simbólica con paciencia y conciencia.
            </p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-${m.role === 'user' ? 'right' : 'left'}-4 duration-300`}>
            <div className={`max-w-[80%] rounded-[1.5rem] p-5 shadow-lg border transition-all ${
              m.role === 'user' 
              ? 'bg-teal-700 text-white border-teal-600 rounded-tr-none' 
              : 'bg-white border-slate-200 text-slate-800 rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                {m.role === 'model' ? renderFormattedText(m.text) : m.text}
              </div>
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
                <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto">
          <VoicePlayer base64Audio={currentTts} onFinished={() => setCurrentTts(null)} />
          <div className="flex items-center space-x-3 mt-3">
            <div className="relative flex-1 group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu mensaje aquí..."
                className="w-full p-4 pl-6 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all text-[15px] placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-teal-800 text-white p-4 rounded-2xl hover:bg-teal-700 transition-all shadow-lg disabled:opacity-50 active:scale-95 shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-[0.2em]">
            Prioriza siempre tu salud física • Consulta a un profesional
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
