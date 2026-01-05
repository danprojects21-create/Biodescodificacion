import React from 'react';

const CreativeTools: React.FC = () => {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
      <h3 className="font-bold text-slate-700 mb-4">Herramientas Visuales (Próximamente)</h3>
      <div className="grid grid-cols-2 gap-2 text-sm text-slate-500">
        <div className="p-4 bg-white rounded border border-dashed border-slate-300 text-center">
          Generador de Imágenes
        </div>
        <div className="p-4 bg-white rounded border border-dashed border-slate-300 text-center">
          Generador de Video
        </div>
      </div>
    </div>
  );
};

export default CreativeTools;
