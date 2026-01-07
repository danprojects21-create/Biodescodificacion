import React, { useState } from 'react';

const LiveSession: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="p-6 bg-teal-900 text-white rounded-3xl text-center">
      <h2 className="text-2xl font-bold mb-4">Encuentro en Vivo</h2>
      <button 
        onClick={() => setIsActive(!isActive)}
        className={`px-8 py-3 rounded-full font-bold transition-all ${isActive ? 'bg-red-500' : 'bg-teal-400'}`}
      >
        {isActive ? 'Finalizar Sesión' : 'Iniciar Encuentro de Sanación'}
      </button>
      {isActive && <p className="mt-4 animate-pulse italic">Escuchando con atención...</p>}
    </div>
  );
};

export default LiveSession;
