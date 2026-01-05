import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', text: input, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await gemini.chat(input, messages);
    setMessages(prev => [...prev, { role: 'model', text: response, id: Date.now() + 1 }]);
    setLoading(false);
    gemini.generateTTS(response);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-teal-700 text-white' : 'bg-white shadow-sm text-slate-700'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-teal-600 animate-pulse text-xs font-bold">Escuchando tu sentir...</div>}
      </div>
      <div className="p-4 bg-white border-t flex gap-2">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu síntoma o emoción..."
          className="flex-1 p-3 bg-slate-100 rounded-xl outline-none"
        />
        <button onClick={handleSend} className="bg-teal-700 text-white p-3 rounded-xl">➤</button>
      </div>
    </div>
  );
};

export default ChatInterface;
