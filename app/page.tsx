"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Dynamiczny import komponentu GradientGenerator z opcją wyłączenia SSR
const GradientGenerator = dynamic(
  () => import("../components/GradientGenerator"),
  {
    ssr: false,
  }
);

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Symulacja ładowania (można usunąć w produkcji)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Sprawdzenie czy użytkownik już wcześniej odwiedzał stronę
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    if (hasVisited) {
      setShowIntro(false);
    } else {
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, []);

  // Przykładowe gradienty do pokazania na stronie głównej
  const exampleGradients = [
    {
      name: "Zachód słońca",
      type: "linear",
      style: { background: "linear-gradient(45deg, #FF5F6D, #FFC371)" }
    },
    {
      name: "Ocean",
      type: "linear",
      style: { background: "linear-gradient(90deg, #4DA0B0, #D39D38)" }
    },
    {
      name: "Fiolet",
      type: "radial",
      style: { background: "radial-gradient(circle, #8E2DE2, #4A00E0)" }
    },
    {
      name: "Tęcza",
      type: "conic",
      style: { background: "conic-gradient(from 45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3, #FF0000)" }
    }
  ];

  // Funkcje obsługi intro
  const skipIntro = () => {
    setShowIntro(false);
  };

  return (
    <>
      {/* Intro/Onboarding dla nowych użytkowników */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-base-100 z-50 flex flex-col items-center justify-center p-4"
          >
            <motion.div 
              className="max-w-3xl text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-6 mx-auto w-32 h-32 relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent animate-spin-slow"></div>
                <div className="absolute inset-2 rounded-lg bg-base-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <motion.h1 
                className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Witaj w Gradient Studio
              </motion.h1>
              
              <motion.p 
                className="text-xl mb-8 text-base-content/80"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Twórz oszałamiające gradienty dla swoich projektów webowych i graficznych.
                Eksportuj do CSS, SVG lub PNG w kilka sekund.
              </motion.p>
              
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {exampleGradients.map((gradient, index) => (
                  <div 
                    key={index} 
                    className="h-24 rounded-lg shadow-md overflow-hidden group relative"
                  >
                    <div 
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-110" 
                      style={gradient.style}
                    ></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-medium">{gradient.name}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <button 
                  onClick={skipIntro} 
                  className="btn btn-primary btn-lg"
                >
                  Rozpocznij tworzenie
                </button>
                <button 
                  onClick={skipIntro} 
                  className="btn btn-outline btn-lg"
                >
                  Pomiń wprowadzenie
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Główna zawartość strony */}
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent animate-spin-slow"></div>
              <div className="absolute inset-1 rounded-md bg-base-100"></div>
            </div>
            <p className="text-base-content/70">Ładowanie kreatora gradientów...</p>
          </div>
        ) : (
          <>
            <header className="mb-12 text-center">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Kreator Gradientów
              </motion.h1>
              <motion.p 
                className="text-xl text-base-content/70 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Twórz, dostosowuj i zapisuj piękne gradienty. Eksperymentuj z różnymi typami,
                kolorami i efektami. Eksportuj do CSS, SVG lub PNG.
              </motion.p>
            </header>

            <Suspense fallback={
              <div className="flex flex-col items-center justify-center py-20">
                <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                <p>Ładowanie edytora gradientu...</p>
              </div>
            }>
              <GradientGenerator />
            </Suspense>
            
            {/* Sekcja funkcji */}
            <section className="mt-24 mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">Projektuj z mocą</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden hover:shadow-2xl transition-shadow"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <figure className="px-6 pt-6">
                    <div className="rounded-xl w-full h-36 bg-gradient-to-r from-primary to-secondary"></div>
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      Różne typy gradientów
                    </h3>
                    <p className="text-base-content/70">
                      Twórz gradienty liniowe, promieniste i stożkowe z dowolną liczbą kolorów. Precyzyjnie kontroluj każdy aspekt swojego gradientu.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden hover:shadow-2xl transition-shadow"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <figure className="px-6 pt-6">
                    <div className="rounded-xl w-full h-36 bg-gradient-to-r from-accent via-secondary to-primary"></div>
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Biblioteka presetów
                    </h3>
                    <p className="text-base-content/70">
                      Zapisuj swoje ulubione gradienty i przeglądaj galerię gotowych presetów. Szybko znajdź inspirację dla swoich projektów.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden hover:shadow-2xl transition-shadow"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <figure className="px-6 pt-6">
                    <div className="rounded-xl w-full h-36 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500"></div>
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Eksport kodu
                    </h3>
                    <p className="text-base-content/70">
                      Generuj gotowy kod CSS i SVG dla swoich gradientów. Eksportuj gradienty jako pliki PNG do użycia w grafikach.
                    </p>
                  </div>
                </motion.div>
              </div>
            </section>
            
            {/* Call to action */}
            <section className="my-24 text-center">
              <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 p-10 md:p-16">
                <h2 className="text-3xl font-bold mb-6">Odkryj gotowe gradienty</h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto">
                  Przeglądaj bibliotekę pięknych gradientów gotowych do użycia w Twoich projektach.
                  Filtruj według typu, kolorów i wielu innych parametrów.
                </p>
                <Link href="/gallery" className="btn btn-primary btn-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Przejdź do galerii
                </Link>
              </div>
            </section>
            
            {/* Referencje/Inspiracje */}
            <section className="my-16">
              <h2 className="text-3xl font-bold text-center mb-12">Najczęstsze zastosowania</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Strony internetowe</h3>
                    <p className="text-base-content/70 mb-4">
                      Używaj gradientów jako tła stron, nagłówków, przycisków i wielu innych elementów.
                      Dodaj głębi i nowoczesnego wyglądu swoim projektom webowym.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-20 rounded-md overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
                      </div>
                      <div className="h-20 rounded-md overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                      </div>
                      <div className="h-20 rounded-md overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-pink-500 to-orange-400"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Grafika i UI</h3>
                    <p className="text-base-content/70 mb-4">
                      Twórz tła dla aplikacji, ikon, ilustracji i elementów UI.
                      Eksportuj gradienty jako PNG do użycia w programach graficznych.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-20 rounded-md overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-red-500"></div>
                      </div>
                      <div className="h-20 rounded-md overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-bl from-indigo-500 via-purple-500 to-pink-500"></div>
                      </div>
                      <div className="h-20 rounded-md overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-green-500 to-teal-400"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
