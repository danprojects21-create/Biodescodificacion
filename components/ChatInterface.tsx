import React, { useState } from 'react';
import { gemini } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const response = await gemini.chat(input, messages);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-[450px] flex flex-col border border-teal-100">
      <div className="flex-1 overflow-y-auto space-y-3 p-2">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-2xl ${m.role === 'user' ? 'bg-teal-600 text-white ml-auto' : 'bg-slate-100 mr-auto'} max-w-[85%]`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 border p-3 rounded-xl" placeholder="Escribe aquí..." />
        <button onClick={handleSend} className="bg-teal-600 text-white px-6 py-2 rounded-xl font-bold">Enviar</button>
      </div>
    </div>
  );
};

export default ChatInterface;
