"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Lista dostępnych motywów
const themes = [
  { 
    id: "mytheme", 
    name: "Domyślny", 
    colors: {
      primary: "#FF00AA",
      secondary: "#00FFA0",
      accent: "#FF512F"
    },
    icon: "🎨"
  },
  { 
    id: "pastel", 
    name: "Pastelowy", 
    colors: {
      primary: "#a3d2ca",
      secondary: "#f6eac2",
      accent: "#f7d794"
    },
    icon: "🍦"
  },
  { 
    id: "retro", 
    name: "Retro", 
    colors: {
      primary: "#f67280",
      secondary: "#c06c84",
      accent: "#6c5b7b"
    },
    icon: "🕰️"
  },
  { 
    id: "corporate", 
    name: "Biurowy", 
    colors: {
      primary: "#0d47a1",
      secondary: "#1976d2",
      accent: "#42a5f5"
    },
    icon: "💼"
  },
  { 
    id: "dark", 
    name: "Ciemny", 
    colors: {
      primary: "#793ef9",
      secondary: "#4fd1c5",
      accent: "#f6ad55"
    },
    icon: "🌙"
  },
  { 
    id: "cupcake", 
    name: "Cupcake", 
    colors: {
      primary: "#65c3c8",
      secondary: "#ef9fbc",
      accent: "#eeaf3a"
    },
    icon: "🧁"
  }
];

/**
 * Zaawansowany komponent wyboru motywu z podglądem kolorów i animacjami.
 */
export default function ThemeSelector() {
  const [theme, setTheme] = useState<string>("mytheme");
  const [isOpen, setIsOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // Pobierz zapisany motyw przy ładowaniu strony
  useEffect(() => {
    const stored = localStorage.getItem("daisyui-theme");
    if (stored && themes.find(t => t.id === stored)) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      document.documentElement.setAttribute("data-theme", "mytheme");
    }
  }, []);

  // Zmień motyw i zapisz wybór
  const handleChange = (themeId: string) => {
    setTheme(themeId);
    localStorage.setItem("daisyui-theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    setIsOpen(false);
  };
  
  // Aktualny motyw
  const currentTheme = themes.find(t => t.id === theme) || themes[0];
  
  // Otwórz/zamknij panel z pełnym wyborem motywów
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="relative">
      {/* Przycisk wyboru motywu */}
      <div className="dropdown dropdown-end">
        <div 
          tabIndex={0}
          role="button"
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-ghost m-1 flex items-center gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentTheme.icon}</span>
            <span className="hidden sm:inline">{currentTheme.name}</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {/* Dropdown z motywami */}
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              transition={{ duration: 0.2 }}
              tabIndex={0}
              className="dropdown-content z-[1] menu menu-compact p-2 shadow-lg bg-base-100 rounded-box w-52 overflow-hidden"
            >
              {themes.slice(0, 4).map((t) => (
                <motion.li 
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: themes.findIndex(th => th.id === t.id) * 0.05 }}
                >
                  <button
                    onClick={() => handleChange(t.id)}
                    className={`flex items-center ${theme === t.id ? 'active bg-base-200' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{t.icon}</span>
                      <span>{t.name}</span>
                    </div>
                    <div className="ml-auto flex space-x-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.colors.primary }}></div>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.colors.secondary }}></div>
                    </div>
                  </button>
                </motion.li>
              ))}
              
              <div className="divider my-1"></div>
              
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <button onClick={togglePanel} className="text-center">
                  Wszystkie motywy
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </motion.li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      
      {/* Panel z pełnym wyborem motywów */}
      <AnimatePresence>
        {isPanelOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black backdrop-blur-sm"
              onClick={() => setIsPanelOpen(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="z-10 bg-base-100 rounded-xl p-6 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Wybierz motyw</h2>
                <button 
                  onClick={() => setIsPanelOpen(false)}
                  className="btn btn-sm btn-circle"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {themes.map((t, index) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`card overflow-hidden cursor-pointer border-2 transition-all ${
                      theme === t.id ? 'border-primary shadow-lg' : 'border-base-300 hover:border-base-content/30'
                    }`}
                    onClick={() => handleChange(t.id)}
                    data-theme={t.id}
                  >
                    <div className="card-body p-4 bg-base-100">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{t.icon}</span>
                        <h3 className="text-lg font-medium">{t.name}</h3>
                        {theme === t.id && (
                          <div className="badge badge-primary ml-auto">Aktywny</div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <div className="h-6 rounded bg-primary mb-1"></div>
                          <div className="text-xs text-center">primary</div>
                        </div>
                        <div className="flex flex-col">
                          <div className="h-6 rounded bg-secondary mb-1"></div>
                          <div className="text-xs text-center">secondary</div>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="flex flex-col">
                          <div className="h-6 rounded bg-accent mb-1"></div>
                          <div className="text-xs text-center">accent</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        <div className="w-6 h-6 rounded-full bg-base-100 border border-base-300"></div>
                        <div className="w-6 h-6 rounded-full bg-base-200 border border-base-300"></div>
                        <div className="w-6 h-6 rounded-full bg-base-300 border border-base-300"></div>
                        <div className="w-6 h-6 rounded-full bg-neutral border border-base-300"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
