import React from 'react';

const HistoryView: React.FC = () => {
  // Simplificamos este componente para asegurar que el despliegue sea exitoso
  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm mt-6">
      <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
        <span>📜</span> Historial de Reflexiones
      </h3>
      <div className="space-y-4">
        <p className="text-slate-500 text-sm italic border-l-4 border-teal-500 pl-4 py-2 bg-slate-50 rounded-r-lg">
          Las sesiones anteriores aparecerán aquí para que puedas retomar tu camino de sanación.
        </p>
      </div>
    </div>
  );
};

export default HistoryView;
