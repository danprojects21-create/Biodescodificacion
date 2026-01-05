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
    const displayChatText = text.split(/VERSIÓN PARA VOZ/i)[0];
    const cleanText = displayChatText
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/\n/g, '<br />');
    
    return <div 
      className="prose prose-slate max-w-none text-inherit"
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

    const currentInput = input;
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const responseText = await gemini.chat(currentInput, history);
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "No pude procesar la respuesta.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMsg]);

      const voiceMatch = responseText.split(/VERSIÓN PARA VOZ/i);
      if (voiceMatch.length > 1) {
        const voiceText = voiceMatch[1].replace(/<[^>]*>/g, '').trim();
        if (voiceText) {
          const ttsData = await gemini.generateTTS(voiceText);
          if (ttsData) setCurrentTts(ttsData);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
      <div className="p-5 bg-gradient-to-r from-teal-800 to-teal-900 text-white flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-teal-100/20 flex items-center justify-center">
            <span className="text-xl">💬</span>
          </div>
          <h2 className="text-xl font-bold">Sentir Conciencia</h2>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${m.role === 'user' ? 'bg-teal-800 text-white' : 'bg-white text-slate-800 border border-slate-200'}`}>
              {m.role === 'model' ? renderFormattedText(m.text) : m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-teal-600 animate-pulse text-sm font-bold">Pensando...</div>}
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <VoicePlayer base64Audio={currentTts} onFinished={() => setCurrentTts(null)} />
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 p-4 bg-slate-100 rounded-2xl outline-none"
          />
          <button onClick={handleSend} disabled={loading} className="bg-teal-800 text-white p-4 rounded-2xl shadow-lg">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
