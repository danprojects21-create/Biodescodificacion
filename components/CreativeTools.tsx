import React from 'react';

const CreativeTools: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
        <span>✨</span> Herramientas Visuales
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400 text-sm italic">
          Generador de Símbolos <br/> (Próximamente)
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400 text-sm italic">
          Videos de Meditación <br/> (Próximamente)
        </div>
      </div>
    </div>
  );
};

export default CreativeTools;
