import React, { useState } from 'react';

const LiveSession: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<string>("Inactivo");

  const toggleSession = async () => {
    try {
      if (!isActive) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsActive(true);
        setStatus("Sesión iniciada...");
      } else {
        setIsActive(false);
        setStatus("Inactivo");
      }
    } catch (err) {
      alert("No se pudo acceder al micrófono.");
    }
  };

  return (
    <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white text-center shadow-2xl border border-white/10">
      <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${isActive ? 'bg-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.5)]' : 'bg-slate-800'}`}>
        <span className="text-4xl">{isActive ? '🎙️' : '💤'}</span>
      </div>
      <h3 className="text-2xl font-bold mb-2">Acompañamiento por Voz</h3>
      <p className="text-slate-400 mb-8">{status}</p>
      <button 
        onClick={toggleSession}
        className={`px-12 py-4 rounded-full font-bold transition-all ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-white text-slate-950 hover:bg-teal-50'}`}
      >
        {isActive ? 'Finalizar Encuentro' : 'Iniciar Encuentro'}
      </button>
    </div>
  );
};

export default LiveSession;
