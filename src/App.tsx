import { useState } from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">

      <Header />
      <Hero />
      <Iscrizione />

    </div>
  );
}

function Header() {
  return (
    <header className="p-4 border-b border-gray-800">
      <h1 className="text-xl font-bold">
        MISS FROCIAROLA ITALIA
      </h1>
    </header>
  );
}

function Hero() {
  return (
    <section className="p-10 text-center">
      <h2 className="text-4xl text-pink-500">
        Il concorso più iconico 💖
      </h2>
      <p className="mt-4 text-gray-400">
        Partecipa e diventa protagonista
      </p>
    </section>
  );
}

function Iscrizione() {
  return (
    <section className="p-6 max-w-xl mx-auto space-y-4">
      <h3 className="text-2xl text-center">Iscriviti</h3>

      <input className="w-full p-2 bg-gray-900" placeholder="Nome" />
      <input className="w-full p-2 bg-gray-900" placeholder="Cognome" />
      <input className="w-full p-2 bg-gray-900" placeholder="Età" />
      <input className="w-full p-2 bg-gray-900" placeholder="Città" />
      <input className="w-full p-2 bg-gray-900" placeholder="Instagram" />

      <button className="w-full bg-pink-500 p-3">
        Invia iscrizione
      </button>
    </section>
  );
}
