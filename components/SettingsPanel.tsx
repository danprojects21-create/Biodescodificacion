
import React from 'react';
import { AppSettings, VoiceType } from '../types';
import { THEMES } from '../constants';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
  onClose: () => void;
  onClearHistory: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, onClose, onClearHistory }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h3 className="text-2xl serif font-bold text-slate-800">Ajustes de Sesión</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto flex-1">
          {/* Voz */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Identidad Vocal</label>
            <div className="grid grid-cols-2 gap-4">
              {(['female', 'male'] as VoiceType[]).map((v) => (
                <button
                  key={v}
                  onClick={() => onUpdate({ ...settings, voice: v })}
                  className={`p-4 rounded-2xl border-2 transition-all font-medium ${settings.voice === v ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                >
                  Voz {v === 'female' ? 'Femenina' : 'Masculina'}
                </button>
              ))}
            </div>
          </div>

          {/* Audio */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Audio Automático</p>
              <p className="text-xs text-slate-500">Escucha la guía de voz al recibir respuestas</p>
            </div>
            <button
              onClick={() => onUpdate({ ...settings, autoPlay: !settings.autoPlay })}
              className={`w-14 h-8 rounded-full transition-all relative ${settings.autoPlay ? 'bg-teal-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${settings.autoPlay ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Temas */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Atmósfera Visual</label>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(THEMES).map(([id, theme]) => (
                <button
                  key={id}
                  onClick={() => onUpdate({ ...settings, theme: id })}
                  className={`group relative h-12 rounded-xl transition-all overflow-hidden border-2 ${settings.theme === id ? 'border-slate-900 shadow-md scale-110' : 'border-transparent'}`}
                  title={theme.name}
                >
                  <div className={`absolute inset-0 ${theme.primary} opacity-20`} />
                  <div className={`absolute inset-x-0 bottom-0 h-4 ${theme.primary}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Gestión de Datos */}
          <div className="pt-4 border-t border-slate-100">
             <button
              onClick={onClearHistory}
              className="w-full flex items-center justify-center space-x-2 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold border border-red-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              <span>Borrar Historial de Chat</span>
            </button>
          </div>
        </div>

        <div className="p-8 bg-slate-50 text-center shrink-0">
          <button 
            onClick={onClose}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg"
          >
            Guardar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
