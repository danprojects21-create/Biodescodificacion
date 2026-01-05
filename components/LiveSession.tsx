import React, { useState } from 'react';

const LiveSession: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<string>("Inactivo");

  const toggleSession = async () => {
    try {
      if (!isActive) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsActive(true);
        setStatus("Escuchando...");
      } else {
        setIsActive(false);
        setStatus("Inactivo");
      }
    } catch (err) {
      alert("Se requiere permiso de micrófono");
    }
  };

  return (
    <div className="p-8 bg-slate-900 rounded-[2rem] text-white text-center shadow-2xl">
      <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 transition-all ${isActive ? 'bg-teal-500 animate-pulse' : 'bg-slate-700'}`}>
        <span className="text-4xl">{isActive ? '🎙️' : '💤'}</span>
      </div>
      <h3 className="text-xl font-bold mb-2">Sesión de Voz</h3>
      <p className="text-slate-400 mb-6 text-sm">{status}</p>
      <button 
        onClick={toggleSession}
        className={`px-10 py-3 rounded-full font-bold transition-all ${isActive ? 'bg-red-500' : 'bg-white text-slate-900'}`}
      >
        {isActive ? 'Finalizar' : 'Comenzar'}
      </button>
    </div>
  );
};

export default LiveSession;
