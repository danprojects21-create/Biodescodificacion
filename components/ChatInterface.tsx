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
    gemini.generateTTS(response);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 h-[400px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded ${m.role === 'user' ? 'bg-teal-50 ml-auto' : 'bg-gray-100 mr-auto'} max-w-[90%]`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 border p-2 rounded" placeholder="Escribe..." />
        <button onClick={handleSend} className="bg-teal-700 text-white px-4 py-2 rounded">Enviar</button>
      </div>
    </div>
  );
};

export default ChatInterface;
