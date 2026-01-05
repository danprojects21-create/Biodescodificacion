import React from 'react';
import ChatInterface from './components/ChatInterface';
import LiveSession from './components/LiveSession';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-teal-900 text-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Sentir Conciencia</h1>
        <p className="text-teal-100 opacity-80">Biodescodificación y Acompañamiento</p>
      </header>
      
      <main className="max-w-6xl mx-auto p-4 md:p-8 grid gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Chat de Exploración</h2>
          <ChatInterface />
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Sesión de Voz en Vivo</h2>
          <LiveSession />
        </section>
      </main>
    </div>
  );
}

export default App;
