import React, { useState } from 'react';
import { gemini } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages([...messages, userMsg]);
    setInput('');

    const response = await gemini.chat(input, messages);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    gemini.generateTTS(response);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 h-[500px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-lg ${m.role === 'user' ? 'bg-teal-100 ml-auto' : 'bg-slate-100 mr-auto'} max-w-[80%]`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 border p-2 rounded-lg" placeholder="Escribe aquí..." />
        <button onClick={handleSend} className="bg-teal-600 text-white px-4 py-2 rounded-lg">Enviar</button>
      </div>
    </div>
  );
};

export default ChatInterface;
