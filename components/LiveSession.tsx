import React, { useState } from 'react';

const LiveSession: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleSession = async () => {
    try {
      if (!isActive) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    } catch (err) {
      alert("Permiso de micrófono denegado");
    }
  };

  return (
    <div className="p-8 bg-slate-900 rounded-3xl text-white text-center">
      <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${isActive ? 'bg-teal-500 animate-pulse' : 'bg-slate-700'}`}>
        <span className="text-3xl">{isActive ? '🎙️' : '💤'}</span>
      </div>
      <button onClick={toggleSession} className={`px-8 py-2 rounded-full font-bold ${isActive ? 'bg-red-500' : 'bg-teal-600'}`}>
        {isActive ? 'Detener Voz' : 'Iniciar Voz'}
      </button>
    </div>
  );
};

export default LiveSession;
