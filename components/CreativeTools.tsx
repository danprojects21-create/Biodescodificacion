import React from 'react';

const CreativeTools: React.FC = () => {
  return (
    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
      <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
        <span>✨</span> Herramientas Complementarias
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-dashed border-slate-300 text-center text-slate-400 text-sm">
          Generador de Imágenes <br/> (Próximamente)
        </div>
        <div className="p-4 bg-white rounded-2xl border border-dashed border-slate-300 text-center text-slate-400 text-sm">
          Videos Meditativos <br/> (Próximamente)
        </div>
      </div>
    </div>
  );
};

export default CreativeTools;
