import React from 'react';

const CreativeTools: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md border border-teal-50">
      <h3 className="text-lg font-bold text-teal-800 mb-4">Herramientas Visuales</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="p-4 bg-teal-50 rounded-xl text-teal-700 hover:bg-teal-100 transition-colors">
          🖼️ Imagen Simbólica
        </button>
        <button className="p-4 bg-slate-50 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
          🧘 Video Meditativo
        </button>
      </div>
    </div>
  );
};

export default CreativeTools;
