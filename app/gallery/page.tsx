"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface GradientPreset {
  id: number;
  type: "linear" | "radial" | "conic";
  angle?: number;
  shape?: "circle" | "ellipse";
  colors: string[];
  name?: string;
  createdAt?: string;
}

export default function Gallery() {
  const router = useRouter();
  const [presets, setPresets] = useState<GradientPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("wszystkie");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPreset, setSelectedPreset] = useState<GradientPreset | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Funkcja do wyświetlania toastów
  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Funkcja do pobierania presetów
  useEffect(() => {
    const fetchPresets = async () => {
      setIsLoading(true);
      try {
        // Próba pobrania z API
        const response = await fetch('/api/saveGradient');
        if (response.ok) {
          const apiPresets = await response.json();
          setPresets(apiPresets);
        } else {
          // Jeśli API nie odpowiada, używamy localStorage
          const storedPresets = localStorage.getItem('gradients');
          if (storedPresets) {
            setPresets(JSON.parse(storedPresets));
          } else {
            // Używamy przykładowych presetów jako fallback
            setPresets(generateDefaultPresets());
          }
        }
      } catch (error) {
        console.error("Błąd podczas ładowania presetów:", error);
        // Używamy przykładowych presetów w przypadku błędu
        const storedPresets = localStorage.getItem('gradients');
        if (storedPresets) {
          setPresets(JSON.parse(storedPresets));
        } else {
          setPresets(generateDefaultPresets());
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresets();
  }, []);

  // Funkcja generująca domyślne presety
  const generateDefaultPresets = (): GradientPreset[] => {
    return [
      {
        id: 1,
        name: "Zachód słońca",
        type: "linear",
        angle: 45,
        colors: ["#FF5F6D", "#FFC371"],
        createdAt: "Domyślny"
      },
      {
        id: 2,
        name: "Ocean",
        type: "linear",
        angle: 90,
        colors: ["#00F260", "#0575E6"],
        createdAt: "Domyślny"
      },
      {
        id: 3,
        name: "Fioletowa mgła",
        type: "radial",
        shape: "circle",
        colors: ["#8E2DE2", "#4A00E0"],
        createdAt: "Domyślny"
      },
      {
        id: 4,
        name: "Ciepły blask",
        type: "conic",
        angle: 0,
        colors: ["#FF512F", "#F09819"],
        createdAt: "Domyślny"
      },
      {
        id: 5,
        name: "Tęcza",
        type: "linear",
        angle: 90,
        colors: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"],
        createdAt: "Domyślny"
      },
      {
        id: 6,
        name: "Neon",
        type: "linear",
        angle: 130,
        colors: ["#FF00FF", "#00FFFF"],
        createdAt: "Domyślny"
      },
      {
        id: 7,
        name: "Północne światła",
        type: "radial",
        shape: "ellipse",
        colors: ["#00C9FF", "#92FE9D"],
        createdAt: "Domyślny"
      },
      {
        id: 8,
        name: "Płomień",
        type: "conic",
        angle: 45,
        colors: ["#FF416C", "#FF4B2B"],
        createdAt: "Domyślny"
      }
    ];
  };

  // Funkcja do generowania losowego presetu
  const generateRandomPreset = (): GradientPreset => {
    const names = [
      "Aurora", "Galaktyka", "Zorza", "Laguna", "Pustynny blask", "Oceanu głębia", 
      "Magiczna poświata", "Kosmiczna mgła", "Tropikalny sen", "Lodowy szlak"
    ];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomType = Math.random();
    
    if (randomType < 0.33) {
      const angle = Math.floor(Math.random() * 361);
      const colorsCount = Math.floor(Math.random() * 3) + 2; // 2-4 kolory
      const colors: string[] = [];
      
      for (let i = 0; i < colorsCount; i++) {
        colors.push('#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
      }
      
      return {
        id: Date.now() + Math.random(),
        name: `${randomName} ${Math.floor(Math.random() * 100)}`,
        type: "linear",
        angle,
        colors,
        createdAt: new Date().toLocaleDateString('pl-PL')
      };
    } else if (randomType < 0.66) {
      const shape = Math.random() < 0.5 ? "circle" : "ellipse";
      const colorsCount = Math.floor(Math.random() * 3) + 2;
      const colors: string[] = [];
      
      for (let i = 0; i < colorsCount; i++) {
        colors.push('#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
      }
      
      return {
        id: Date.now() + Math.random(),
        name: `${randomName} ${Math.floor(Math.random() * 100)}`,
        type: "radial",
        shape,
        colors,
        createdAt: new Date().toLocaleDateString('pl-PL')
      };
    } else {
      const angle = Math.floor(Math.random() * 361);
      const colorsCount = Math.floor(Math.random() * 3) + 2;
      const colors: string[] = [];
      
      for (let i = 0; i < colorsCount; i++) {
        colors.push('#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
      }
      
      return {
        id: Date.now() + Math.random(),
        name: `${randomName} ${Math.floor(Math.random() * 100)}`,
        type: "conic",
        angle,
        colors,
        createdAt: new Date().toLocaleDateString('pl-PL')
      };
    }
  };

  // Generowanie kilku losowych presetów
  const generateRandomPresets = (count: number = 4) => {
    const newPresets = Array(count).fill(0).map(() => generateRandomPreset());
    setPresets(prev => [...prev, ...newPresets]);
    showToast(`Wygenerowano ${count} nowych presetów`, "success");
  };

  // Zastępowanie wszystkich presetów losowymi
  const replaceWithRandomPresets = () => {
    const newPresets = Array(8).fill(0).map(() => generateRandomPreset());
    setPresets(newPresets);
    showToast("Wszystkie presety zostały zastąpione losowymi", "info");
  };

  // Dodanie jednego losowego presetu
  const addRandomPreset = () => {
    const newPreset = generateRandomPreset();
    setPresets(prev => [...prev, newPreset]);
    showToast("Dodano nowy losowy preset", "success");
  };

  // Funkcja do użycia presetu
  const handleUsePreset = (preset: GradientPreset) => {
    localStorage.setItem("selectedPreset", JSON.stringify(preset));
    router.push("/");
  };
  
  // Funkcja do usunięcia presetu
  const handleDeletePreset = () => {
    if (!selectedPreset) return;
    
    // Filtruj presety, aby usunąć wybrany
    const updatedPresets = presets.filter(preset => preset.id !== selectedPreset.id);
    setPresets(updatedPresets);
    
    // Zapisz aktualizowane presety do localStorage
    localStorage.setItem("gradients", JSON.stringify(updatedPresets));
    
    // Zamknij modal potwierdzenia usunięcia
    setShowConfirmDelete(false);
    setSelectedPreset(null);
    
    showToast("Preset został usunięty", "success");
  };

  // Lista kategorii gradientów
  const categories = [
    { id: "wszystkie", name: "Wszystkie" },
    { id: "linear", name: "Liniowe" },
    { id: "radial", name: "Promieniste" },
    { id: "conic", name: "Stożkowe" },
  ];

  // Filtrowanie presetów według kategorii i wyszukiwania
  const filteredPresets = presets.filter(
    preset => {
      // Filter by category
      const categoryMatch = activeCategory === "wszystkie" || preset.type === activeCategory;
      
      // Filter by search query
      const searchMatch = !searchQuery || 
        (preset.name && preset.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (preset.createdAt && preset.createdAt.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return categoryMatch && searchMatch;
    }
  );

  // Wariant animacji dla kart
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            className="toast toast-end fixed bottom-5 right-5 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`alert ${
              toast.type === "success" 
                ? "alert-success" 
                : toast.type === "error" 
                  ? "alert-error" 
                  : "alert-info"
            } shadow-lg`}>
              <div className="flex items-center">
                {toast.type === "success" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {toast.type === "error" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {toast.type === "info" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="font-medium">{toast.message}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hero sekcja */}
      <section className="py-12 px-4 mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Galeria Gradientów
          </motion.h1>
          <motion.p 
            className="text-lg text-base-content/80 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Przeglądaj gotowe gradienty, generuj nowe lub wróć do kreatora, aby stworzyć własne od podstaw.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button 
              onClick={() => router.push("/")}
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
              </svg>
              Przejdź do kreatora
            </button>
            <button 
              onClick={addRandomPreset} 
              className="btn btn-outline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Dodaj losowy gradient
            </button>
          </motion.div>
        </div>
      </section>

      {/* Sekcja filtrów i wyszukiwania */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 bg-base-200 rounded-lg shadow-sm">
          {/* Kategorie */}
          <div className="inline-flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                className={`btn btn-sm ${activeCategory === category.id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Wyszukiwanie */}
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Szukaj gradientu..."
              className="input input-bordered w-full md:w-64 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              onClick={() => setSearchQuery("")}
              className={`absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle ${!searchQuery && 'hidden'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Sekcja kart gradientów */}
      <section>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
            <p>Ładowanie gradientów...</p>
          </div>
        ) : filteredPresets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Brak gradientów pasujących do kryteriów</h2>
            <p className="text-base-content/70 max-w-md mb-6">
              {activeCategory === "wszystkie" && !searchQuery
                ? "Nie znaleziono żadnych presetów. Wygeneruj nowe lub dodaj własne."
                : `Nie znaleziono gradientów spełniających wybrane kryteria. Zmień parametry wyszukiwania lub wygeneruj nowe.`}
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <button 
                onClick={() => {
                  setActiveCategory("wszystkie");
                  setSearchQuery("");
                }}
                className="btn btn-outline"
              >
                Wyczyść filtry
              </button>
              <button 
                onClick={() => addRandomPreset()}
                className="btn btn-primary"
              >
                Dodaj losowy gradient
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPresets.map((preset, index) => {
              let gradientStyle = {};
              
              if (preset.type === "linear" && preset.angle !== undefined) {
                gradientStyle = { background: `linear-gradient(${preset.angle}deg, ${preset.colors.join(", ")})` };
              } else if (preset.type === "radial" && preset.shape) {
                gradientStyle = { background: `radial-gradient(${preset.shape}, ${preset.colors.join(", ")})` };
              } else if (preset.type === "conic" && preset.angle !== undefined) {
                gradientStyle = { background: `conic-gradient(from ${preset.angle}deg, ${preset.colors.join(", ")})` };
              }
              
              return (
                <motion.div
                  key={preset.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className="card overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-base-300 group bg-base-100"
                  layoutId={`gradient-${preset.id}`}
                >
                  <figure className="relative">
                    <div 
                      className="w-full h-48 group-hover:scale-105 transition-transform duration-500" 
                      style={gradientStyle}
                      onClick={() => {
                        setSelectedPreset(preset);
                        setShowFullscreen(true);
                      }}
                    ></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/30 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedPreset(preset);
                          setShowFullscreen(true);
                        }}
                        className="btn btn-circle btn-sm btn-primary"
                        aria-label="Pełny ekran"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z" />
                          <path fillRule="evenodd" d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleUsePreset(preset)}
                        className="btn btn-circle btn-sm btn-success"
                        aria-label="Użyj tego gradientu"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPreset(preset);
                          setShowConfirmDelete(true);
                        }}
                        className="btn btn-circle btn-sm btn-error"
                        aria-label="Usuń gradient"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </figure>
                  
                  <div className="card-body p-4">
                    <h3 className="card-title text-base truncate">
                      {preset.name || `Gradient #${index + 1}`}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-1">
                      <div className="badge badge-sm badge-primary">
                        {preset.type === "linear" 
                          ? "Liniowy" 
                          : preset.type === "radial" 
                            ? "Promienisty" 
                            : "Stożkowy"}
                      </div>
                      <div className="badge badge-sm badge-ghost">
                        {preset.colors.length} {preset.colors.length === 1 
                          ? "kolor" 
                          : preset.colors.length < 5 
                            ? "kolory" 
                            : "kolorów"}
                      </div>
                    </div>
                    
                    <div className="text-xs space-y-1 text-base-content/70">
                      {preset.type === "linear" && preset.angle !== undefined && (
                        <div className="flex justify-between">
                          <span>Kąt:</span>
                          <span className="font-mono">{preset.angle}°</span>
                        </div>
                      )}
                      
                      {preset.type === "radial" && preset.shape && (
                        <div className="flex justify-between">
                          <span>Kształt:</span>
                          <span className="font-mono">{preset.shape === "circle" ? "Okrąg" : "Elipsa"}</span>
                        </div>
                      )}
                      
                      {preset.type === "conic" && preset.angle !== undefined && (
                        <div className="flex justify-between">
                          <span>Kąt początkowy:</span>
                          <span className="font-mono">{preset.angle}°</span>
                        </div>
                      )}
                      
                      {preset.createdAt && (
                        <div className="flex justify-between">
                          <span>Utworzony:</span>
                          <span className="font-mono">{preset.createdAt}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {preset.colors.map((color, i) => (
                        <div 
                          key={i}
                          className="w-6 h-6 rounded-full border border-base-300" 
                          style={{ backgroundColor: color }}
                          title={color}
                        ></div>
                      ))}
                    </div>
                    
                    <div className="card-actions justify-end mt-3">
                      <button
                        onClick={() => handleUsePreset(preset)}
                        className="btn btn-sm btn-primary btn-block"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Użyj tego gradientu
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
      
      {/* Przycisk generowania losowych gradientów */}
      <section className="mt-12 mb-8 text-center">
        <div className="inline-flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => generateRandomPresets(4)} 
            className="btn btn-outline btn-accent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Dodaj 4 losowe gradienty
          </button>
          <button 
            onClick={replaceWithRandomPresets} 
            className="btn btn-outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Zamień wszystkie na losowe
          </button>
        </div>
      </section>
      
      {/* Modal potwierdzenia usunięcia */}
      <AnimatePresence>
        {showConfirmDelete && selectedPreset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black backdrop-blur-sm"
              onClick={() => setShowConfirmDelete(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="z-10 modal-box max-w-md"
            >
              <h3 className="font-bold text-lg mb-4">Potwierdzenie usunięcia</h3>
              <p>Czy na pewno chcesz usunąć gradient <span className="font-medium">{selectedPreset.name || `#${selectedPreset.id}`}</span>?</p>
              <p className="text-sm text-base-content/70 mt-2">Tej operacji nie można cofnąć.</p>
              
              <div className="modal-action">
                <button 
                  onClick={() => setShowConfirmDelete(false)} 
                  className="btn btn-outline"
                >
                  Anuluj
                </button>
                <button 
                  onClick={handleDeletePreset} 
                  className="btn btn-error"
                >
                  Usuń
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Modal pełnoekranowy */}
      <AnimatePresence>
        {showFullscreen && selectedPreset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black backdrop-blur-sm"
              onClick={() => setShowFullscreen(false)}
            ></motion.div>
            
            <motion.div 
              layoutId={`gradient-${selectedPreset.id}`}
              className="z-10 w-full max-w-5xl p-0 rounded-lg overflow-hidden"
            >
              {/* Gradient w pełnym ekranie */}
              <div 
                className="w-full aspect-video"
                style={{
                  background: 
                    selectedPreset.type === "linear" && selectedPreset.angle !== undefined
                      ? `linear-gradient(${selectedPreset.angle}deg, ${selectedPreset.colors.join(", ")})`
                      : selectedPreset.type === "radial" && selectedPreset.shape
                        ? `radial-gradient(${selectedPreset.shape}, ${selectedPreset.colors.join(", ")})`
                        : selectedPreset.type === "conic" && selectedPreset.angle !== undefined
                          ? `conic-gradient(from ${selectedPreset.angle}deg, ${selectedPreset.colors.join(", ")})`
                          : ""
                }}
              ></div>
              
              <div className="bg-base-100 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedPreset.name || `Gradient #${selectedPreset.id}`}</h2>
                  
                  <button 
                    onClick={() => setShowFullscreen(false)}
                    className="btn btn-sm btn-circle btn-ghost"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Szczegóły</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-base-content/70">Typ:</span>
                        <span className="font-medium">
                          {selectedPreset.type === "linear" 
                            ? "Liniowy" 
                            : selectedPreset.type === "radial" 
                              ? "Promienisty" 
                              : "Stożkowy"}
                        </span>
                      </li>
                      
                      {selectedPreset.type === "linear" && selectedPreset.angle !== undefined && (
                        <li className="flex justify-between">
                          <span className="text-base-content/70">Kąt:</span>
                          <span className="font-medium">{selectedPreset.angle}°</span>
                        </li>
                      )}
                      
                      {selectedPreset.type === "radial" && selectedPreset.shape && (
                        <li className="flex justify-between">
                          <span className="text-base-content/70">Kształt:</span>
                          <span className="font-medium">{selectedPreset.shape === "circle" ? "Okrąg" : "Elipsa"}</span>
                        </li>
                      )}
                      
                      {selectedPreset.type === "conic" && selectedPreset.angle !== undefined && (
                        <li className="flex justify-between">
                          <span className="text-base-content/70">Kąt początkowy:</span>
                          <span className="font-medium">{selectedPreset.angle}°</span>
                        </li>
                      )}
                      
                      <li className="flex justify-between">
                        <span className="text-base-content/70">Liczba kolorów:</span>
                        <span className="font-medium">{selectedPreset.colors.length}</span>
                      </li>
                      
                      {selectedPreset.createdAt && (
                        <li className="flex justify-between">
                          <span className="text-base-content/70">Data utworzenia:</span>
                          <span className="font-medium">{selectedPreset.createdAt}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Kolory</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedPreset.colors.map((color, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border" 
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="font-mono text-sm">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Kod CSS</h3>
                  <div className="mockup-code bg-neutral text-neutral-content">
                    <pre><code>
                      {selectedPreset.type === "linear" && selectedPreset.angle !== undefined
                        ? `background: linear-gradient(${selectedPreset.angle}deg, ${selectedPreset.colors.join(", ")});`
                        : selectedPreset.type === "radial" && selectedPreset.shape
                          ? `background: radial-gradient(${selectedPreset.shape}, ${selectedPreset.colors.join(", ")});`
                          : selectedPreset.type === "conic" && selectedPreset.angle !== undefined
                            ? `background: conic-gradient(from ${selectedPreset.angle}deg, ${selectedPreset.colors.join(", ")});`
                            : ""}
                    </code></pre>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => {
                      handleUsePreset(selectedPreset);
                      setShowFullscreen(false);
                    }}
                    className="btn btn-primary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Użyj tego gradientu
                  </button>
                  <button
                    onClick={() => {
                      setShowFullscreen(false);
                      setSelectedPreset(selectedPreset);
                      setShowConfirmDelete(true);
                    }}
                    className="btn btn-outline btn-error"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Usuń gradient
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
