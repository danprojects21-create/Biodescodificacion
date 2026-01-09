import React from 'react';
import ChatInterface from './components/ChatInterface';
import CreativeTools from './components/CreativeTools';
import LiveSession from './components/LiveSession';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-teal-800 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">Sentir Conciencia</h1>
        <p className="opacity-80">Biodescodificación y Acompañamiento</p>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-slate-700 mb-4">Chat de Exploración</h2>
          <ChatInterface />
        </section>

        <LiveSession />
        
        <section>
          <CreativeTools />
        </section>
      </main>
    </div>
  );
}

export default App;
