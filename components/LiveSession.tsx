import React, { useState } from 'react';

const LiveSession: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<string[]>([]);

  const toggleSession = async () => {
    try {
      if (!isActive) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsActive(true);
        setTranscriptions(prev => [...prev, "Micrófono conectado..."]);
      } else {
        setIsActive(false);
      }
    } catch (err) {
      alert("Error al acceder al micrófono");
    }
  };

  return (
    <div className="p-8 bg-slate-900 rounded-3xl text-white text-center">
      <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${isActive ? 'bg-teal-500 animate-pulse' : 'bg-slate-700'}`}>
        {isActive ? '🎙️' : '💤'}
      </div>
      <button 
        onClick={toggleSession}
        className={`px-6 py-2 rounded-full font-bold ${isActive ? 'bg-red-500' : 'bg-teal-600'}`}
      >
        {isActive ? 'Detener Sesión' : 'Iniciar Voz'}
      </button>
      <div className="mt-4 text-sm text-slate-400">
        {transcriptions.map((t, i) => <p key={i}>{t}</p>)}
      </div>
    </div>
  );
};

export default LiveSession;
