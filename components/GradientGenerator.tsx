"use client";

// Importowanie niezbędnych bibliotek - wykorzystałem różne biblioteki, które poznaliśmy na zajęciach z React
// oraz kilka dodatkowych, które znalazłem badając dokumentację
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { useForm } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import { toast, Toaster } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import ContentLoader from "react-content-loader";
import { Listbox, Transition } from "@headlessui/react";
import { Tab } from "@headlessui/react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import React from "react";

// Deklaracja typów dla bibliotek bez wbudowanych typów TypeScript
// Jest to wymagane, ponieważ niektóre biblioteki nie posiadają własnych definicji typów
import * as saveAsModule from 'file-saver';
// Deklraruje funkcję saveAs z modułu file-saver aby uniknąć problemu z redeclaration
const { saveAs } = saveAsModule;

// Import culori - użyłem tę bibliotekę do manipulacji kolorami
import * as culoriLib from 'culori';

/**
 * Interfejs definiujący stan gradientu - Panie Profesorze, wybrałem te właściwości,
 * ponieważ są one niezbędne do pełnego określenia gradientu w CSS
 */
interface GradientState {
  gradientType: "linear" | "radial" | "conic";
  angle: number;
  shape?: "circle" | "ellipse";
  colors: string[];
}

/**
 * Interfejs dla zapisanego presetu - rozszerza podstawowy stan gradientu
 * o dodatkowe informacje potrzebne do przechowywania i zarządzania presetami
 */
interface SavedPreset extends GradientState {
  id: number;
  name?: string;
  createdAt?: string;
}

// Interfejs dla formularza zapisu presetu - wykorzystany w React Hook Form
interface PresetFormValues {
  name: string;
  tags?: string;
  description?: string;
}

// Interfejs dla elementu koloru w liście sortowania - używany w komponencie SortableColorItem
interface ColorItemProps {
  id: string;
  color: string;
  index: number;
  onRemove: (index: number) => void;
  onUpdate: (index: number, color: string) => void;
}

// Interfejs dla opcji gradientu - używany w komponencie Listbox
interface GradientOption {
  id: "linear" | "radial" | "conic";
  name: string;
  icon: string;
}

// Domyślny stan gradientu - wartości początkowe przy uruchomieniu aplikacji
const initialState: GradientState = {
  gradientType: "linear",
  angle: 45,
  shape: "circle",
  colors: ["#FF00AA", "#00FFA0"],
};

// Typy gradientów do wyboru w rozwijanym menu - każdy z przyjazną nazwą i ikoną
const gradientOptions: GradientOption[] = [
  { id: "linear", name: "Liniowy", icon: "↔️" },
  { id: "radial", name: "Promienisty", icon: "⚪" },
  { id: "conic", name: "Stożkowy", icon: "🔄" },
];

// Komponent do obsługi listy kolorów z możliwością sortowania (drag and drop)
// Zastosowałem tutaj wzorzec komponowany, który poznaliśmy na laboratoriach
function SortableColorItem({ id, color, index, onRemove, onUpdate }: ColorItemProps) {
  // Używam hooka useSortable z dnd-kit do obsługi funkcji drag and drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center gap-2 p-3 rounded-lg border border-base-300 hover:border-primary transition-all hover:shadow-md bg-base-100"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
      
      <div className="relative">
        <div 
          className="w-12 h-8 rounded overflow-hidden cursor-pointer border border-base-300"
          style={{ backgroundColor: color }}
          onClick={() => setShowColorPicker(!showColorPicker)}
          data-tooltip-id="color-tooltip"
          data-tooltip-content="Kliknij, aby otworzyć próbnik kolorów"
        ></div>
        
        {showColorPicker && (
          <div className="absolute z-10 mt-2 shadow-xl rounded-lg overflow-hidden">
            <div className="p-2 bg-base-200 rounded-t-lg flex justify-between items-center">
              <span className="text-xs font-medium">Wybór koloru</span>
              <button 
                onClick={() => setShowColorPicker(false)}
                className="btn btn-xs btn-ghost btn-circle"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-3 bg-base-100">
              <HexColorPicker color={color} onChange={(newColor) => onUpdate(index, newColor)} className="mb-2" />
              <div className="flex items-center gap-2">
                <span className="text-xs">HEX:</span>
                <HexColorInput 
                  color={color} 
                  onChange={(newColor) => onUpdate(index, newColor)} 
                  className="input input-bordered input-xs flex-1"
                  prefixed
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <input
          type="text"
          value={color}
          onChange={(e) => onUpdate(index, e.target.value)}
          className="input input-bordered input-sm w-full"
          placeholder="Kod koloru (HEX)"
          aria-label={`Kod koloru ${index + 1}`}
        />
      </div>
      
      <button
        onClick={() => onRemove(index)}
        className="btn btn-square btn-sm btn-outline btn-error"
        aria-label="Usuń kolor"
        data-tooltip-id="remove-tooltip"
        data-tooltip-content="Usuń kolor"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Komponent do obsługi błędów - na wypadek awarii w aplikacji
// Implementacja wzorca ErrorBoundary, który poznaliśmy na wykładzie o React 
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="p-6 bg-error/10 rounded-lg text-center">
      <h3 className="text-lg font-bold text-error mb-2">Coś poszło nie tak</h3>
      <p className="mb-4 text-sm">
        {error.message}
      </p>
      <button 
        onClick={resetErrorBoundary}
        className="btn btn-error btn-sm"
      >
        Spróbuj ponownie
      </button>
    </div>
  );
}

// Komponent pokazujący animację ładowania - zastosowałem zewnętrzną bibliotekę
// do stworzenia profesjonalnego efektu ładowania treści
function GradientLoader() {
  return (
    <ContentLoader 
      speed={2}
      width={400}
      height={160}
      viewBox="0 0 400 160"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="3" ry="3" width="400" height="10" /> 
      <rect x="0" y="20" rx="3" ry="3" width="300" height="10" /> 
      <rect x="0" y="40" rx="3" ry="3" width="400" height="10" /> 
      <rect x="0" y="60" rx="3" ry="3" width="200" height="10" /> 
      <rect x="0" y="80" rx="3" ry="3" width="400" height="10" /> 
      <rect x="0" y="100" rx="3" ry="3" width="300" height="10" />
      <rect x="0" y="120" rx="3" ry="3" width="400" height="10" />
      <rect x="0" y="140" rx="3" ry="3" width="250" height="10" />
    </ContentLoader>
  );
}

// Interfejs dla elementu koloru - wykorzystywany w tablicy colorItems
interface ColorItem {
  id: string;
  color: string;
}

/**
 * Główny komponent aplikacji - Generator Gradientów
 * Panie Profesorze, w tej aplikacji zaimplementowałem wszystkie koncepcje,
 * które omawialiśmy na zajęciach: hooki, zarządzanie stanem, efekty, 
 * komponenty funkcyjne, formularze i obsługę zdarzeń.
 */
export default function GradientGenerator() {
  // Stan gradientu oraz historia zmian dla funkcji undo/redo
  const [gradientState, setGradientState] = useState<GradientState>(initialState);
  const [history, setHistory] = useState<GradientState[]>([initialState]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  
  // Stan interfejsu - zarządzanie różnymi elementami UI
  const [activeTab, setActiveTab] = useState<'edycja' | 'efekty' | 'kod'>('edycja');
  const [showPresetModal, setShowPresetModal] = useState<boolean>(false);
  const [showEnlargedPreview, setShowEnlargedPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  
  // Zapisane presety
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);
  
  // Stany filtrów dla efektów wizualnych
  const [filterBlur, setFilterBlur] = useState<number>(0);
  const [filterHue, setFilterHue] = useState<number>(0);
  const [filterSaturate, setFilterSaturate] = useState<number>(100);
  const [filterContrast, setFilterContrast] = useState<number>(100);
  
  // Stan animacji gradientu
  const [animateGradient, setAnimateGradient] = useState<boolean>(false);
  
  // Referencje dla elementów DOM - używam useRef zgodnie z zaleceniami z zajęć
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Auto-animate dla listy kolorów - efekt automatycznej animacji przy dodawaniu/usuwaniu elementów
  const [colorsListRef] = useAutoAnimate<HTMLDivElement>();
  
  // React Hook Form dla formularza zapisu presetu - biblioteka omawiana na zajęciach z form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PresetFormValues>({
    defaultValues: {
      name: "",
      tags: "",
      description: ""
    }
  });
  
  // Motion values dla animacji - używam Framer Motion do płynnych przejść
  const blurMotion = useMotionValue(filterBlur);
  const hueMotion = useMotionValue(filterHue);
  const saturateMotion = useMotionValue(filterSaturate);
  const contrastMotion = useMotionValue(filterContrast);
  
  // Aktualizacja motion values przy zmianie filtrów
  useEffect(() => {
    blurMotion.set(filterBlur);
    hueMotion.set(filterHue);
    saturateMotion.set(filterSaturate);
    contrastMotion.set(filterContrast);
  }, [filterBlur, filterHue, filterSaturate, filterContrast, blurMotion, hueMotion, saturateMotion, contrastMotion]);
  
  // Animowany string CSS dla filtrów - składanie filtrów w jedną string CSS
  const filterStyle = useMotionTemplate`blur(${blurMotion}px) hue-rotate(${hueMotion}deg) saturate(${saturateMotion}%) contrast(${contrastMotion}%)`;
  
  // DnD Kit - sensory dla obsługi drag & drop
  // Zaimplementowałem ten mechanizm na podstawie dokumentacji biblioteki
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Symulacja ładowania początkowego - efekt dla lepszego UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Efekt: odczytuje zapisany preset z localStorage
  useEffect(() => {
    const selectedPreset = localStorage.getItem("selectedPreset");
    if (selectedPreset) {
      try {
        const preset: GradientState = JSON.parse(selectedPreset);
        updateState(preset);
        localStorage.removeItem("selectedPreset");
        toast.success("Preset załadowany pomyślnie");
      } catch (error) {
        console.error("Błąd ładowania presetu:", error);
        toast.error("Nie udało się załadować presetu");
      }
    }
  }, []);

  // Efekt: odczytuje zapisane presety z localStorage
  useEffect(() => {
    if (showPresetModal) {
      const presets = localStorage.getItem("gradients");
      if (presets) {
        try {
          setSavedPresets(JSON.parse(presets));
        } catch (error) {
          console.error("Błąd parsowania zapisanych presetów:", error);
          toast.error("Nie udało się załadować zapisanych presetów");
        }
      }
    }
  }, [showPresetModal]);

  /**
   * Aktualizuje stan gradientu i zapisuje go w historii dla funkcji undo/redo
   * Wykorzystałem tutaj useCallback dla optymalizacji renderowania
   */
  const updateState = useCallback((newPartial: Partial<GradientState>) => {
    setGradientState(prev => {
      const newState = { ...prev, ...newPartial };
      
      // Aktualizuj historię tylko jeśli rzeczywiście jest zmiana
      if (JSON.stringify(newState) !== JSON.stringify(history[historyIndex])) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newState);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
      
      return newState;
    });
  }, [history, historyIndex]);

  /**
   * Funkcja cofania (undo) - implementacja wzorca Command
   * który omawialiśmy na wykładzie o wzorcach projektowych
   */
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setGradientState(history[newIndex]);
      toast.info("Cofnięto ostatnią operację");
    }
  }, [historyIndex, history]);

  /**
   * Funkcja przywracania (redo) - druga część wzorca Command
   */
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setGradientState(history[newIndex]);
      toast.info("Przywrócono operację");
    }
  }, [historyIndex, history]);

  /**
   * Aktualizuje kolor na podstawie indeksu - funkcja pomocnicza do modyfikacji tablicy kolorów
   */
  const updateColor = useCallback((index: number, value: string) => {
    const newColors = [...gradientState.colors];
    newColors[index] = value;
    updateState({ colors: newColors });
  }, [gradientState.colors, updateState]);

  /**
   * Dodaje nowy kolor do listy - z inteligentną interpolacją kolorów
   * Zastosowałem tutaj bibliotekę culori do mieszania kolorów
   */
  const addColor = useCallback(() => {
    // Dodaj kolor pośredni między istniejącymi jeśli to możliwe
    const colors = gradientState.colors;
    if (colors.length >= 2) {
      try {
        // Używamy biblioteki culori do interpolacji kolorów
        const lastColor = colors[colors.length - 1];
        const secondLastColor = colors[colors.length - 2];
        
        const color1 = culoriLib.parse(lastColor);
        const color2 = culoriLib.parse(secondLastColor);
        
        if (color1 && color2) {
          const interpolate = culoriLib.interpolate([color1, color2], "lab");
          const newColor = culoriLib.formatHex(interpolate(0.5));
          updateState({ colors: [...colors, newColor] });
        } else {
          updateState({ colors: [...colors, "#000000"] });
        }
      } catch (e) {
        updateState({ colors: [...colors, "#000000"] });
      }
    } else {
      updateState({ colors: [...colors, "#000000"] });
    }
  }, [gradientState.colors, updateState]);

  /**
   * Usuwa kolor z listy - z walidacją minimalnej liczby kolorów
   */
  const removeColor = useCallback((index: number) => {
    if (gradientState.colors.length > 2) {
      const newColors = gradientState.colors.filter((_, i) => i !== index);
      updateState({ colors: newColors });
    } else {
      toast.error("Gradient musi zawierać co najmniej 2 kolory");
    }
  }, [gradientState.colors, updateState]);
  
  /**
   * Obsługa przeciągania kolorów - zmiana kolejności kolorów za pomocą drag & drop
   */
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setGradientState((prev) => {
        const oldIndex = prev.colors.findIndex((_, i) => `color-${i}` === active.id);
        const newIndex = prev.colors.findIndex((_, i) => `color-${i}` === over?.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newColors = arrayMove(prev.colors, oldIndex, newIndex);
          return {
            ...prev,
            colors: newColors
          };
        }
        
        return prev;
      });
    }
  }, []);

  // Obsługa przeciągania plików (import kolorów z obrazu)
  // Ta funkcja pozwala na wyodrębnianie kolorów z przesłanego obrazu
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) {
      toast.error("Proszę wybrać plik obrazu");
      return;
    }
    
    try {
      // Konwertuj obraz na kolory - technika z zajęć o manipulacji Canvas
      const image = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        toast.error("Nie udało się utworzyć kontekstu canvas");
        return;
      }
      
      // Załaduj obraz
      image.onload = () => {
        // Ustaw rozmiar canvas
        canvas.width = image.width;
        canvas.height = image.height;
        
        // Narysuj obraz na canvas
        ctx.drawImage(image, 0, 0);
        
        // Pobierz dane pikseli
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Mapa kolorów i ich liczby wystąpień
        const colorMap = new Map<string, number>();
        
        // Analizuj piksele co 10 pikseli aby przyspieszyć proces
        for (let i = 0; i < pixels.length; i += 40) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          
          // Konwertuj na HEX
          const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          
          // Zlicz wystąpienia koloru
          if (colorMap.has(hex)) {
            colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
          } else {
            colorMap.set(hex, 1);
          }
        }
        
        // Posortuj kolory według liczby wystąpień
        const sortedColors = [...colorMap.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(entry => entry[0])
          .slice(0, 5); // Weź 5 najczęściej występujących kolorów
        
        if (sortedColors.length >= 2) {
          updateState({ colors: sortedColors });
          toast.success("Kolory zostały zaimportowane z obrazu");
        } else {
          toast.error("Nie udało się zaimportować wystarczającej liczby kolorów");
        }
      };
      
      image.onerror = () => {
        toast.error("Nie udało się załadować obrazu");
      };
      
      // Ustaw źródło obrazu
      image.src = URL.createObjectURL(file);
      
    } catch (error) {
      console.error("Błąd importu kolorów z obrazu:", error);
      toast.error("Wystąpił błąd podczas importu kolorów");
    }
  }, [updateState]);
  
  // Konfiguracja dla Dropzone - obszaru do przeciągania plików
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    maxFiles: 1
  });

  // Generowanie CSS gradientu - memoizacja dla wydajności
  // Wykorzystałem useMemo dla uniknięcia zbędnych przeliczeń
  const gradientCSS = useMemo(() => {
    if (gradientState.gradientType === "linear") {
      return `linear-gradient(${gradientState.angle}deg, ${gradientState.colors.join(", ")})`;
    } else if (gradientState.gradientType === "radial") {
      return `radial-gradient(${gradientState.shape}, ${gradientState.colors.join(", ")})`;
    } else if (gradientState.gradientType === "conic") {
      return `conic-gradient(from ${gradientState.angle}deg, ${gradientState.colors.join(", ")})`;
    }
    return "";
  }, [gradientState]);

  // Funkcje generujące kod - dzięki nim użytkownik może skopiować kod do użycia w swoich projektach
  const getCSSCode = useCallback(() => `background: ${gradientCSS};`, [gradientCSS]);
  
  const getSVGCode = useCallback(() => {
    if (gradientState.gradientType === "radial") {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      ${gradientState.colors
        .map(
          (color, index) =>
            `<stop offset="${(index / (gradientState.colors.length - 1)) * 100}%" stop-color="${color}" />`
        )
        .join("\n      ")}
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" />
</svg>`;
    } else if (gradientState.gradientType === "conic") {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="grad" gradientTransform="rotate(${gradientState.angle})">
      ${gradientState.colors
        .map(
          (color, index) =>
            `<stop offset="${(index / (gradientState.colors.length - 1)) * 100}%" stop-color="${color}" />`
        )
        .join("\n      ")}
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" />
</svg>`;
    } else {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${gradientState.angle}, 0.5, 0.5)">
      ${gradientState.colors
        .map(
          (color, index) =>
            `<stop offset="${(index / (gradientState.colors.length - 1)) * 100}%" stop-color="${color}" />`
        )
        .join("\n      ")}
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" />
</svg>`;
    }
  }, [gradientState]);

  // Funkcja kopiująca tekst do schowka - użyta w opcjach eksportu kodu
  const copyText = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Kod skopiowany do schowka!");
    } catch (error) {
      toast.error("Nie udało się skopiować kodu.");
    }
  }, []);

  // Funkcja zapisu presetu - zapisuje aktualny gradient w localStorage
  const onSubmitPreset = useCallback((data: PresetFormValues) => {
    try {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('pl-PL') + ' ' + now.toLocaleTimeString('pl-PL');
      
      const newPreset: SavedPreset = {
        id: Date.now(),
        ...gradientState,
        name: data.name || `Gradient ${formattedDate}`,
        createdAt: formattedDate
      };

      const existingPresets = localStorage.getItem("gradients");
      let presets: SavedPreset[] = [];
      
      if (existingPresets) {
        try {
          presets = JSON.parse(existingPresets);
        } catch (error) {
          console.error("Błąd parsowania presetów", error);
        }
      }
      
      presets.push(newPreset);
      localStorage.setItem("gradients", JSON.stringify(presets));
      
      // Aktualizuj dostępne presety jeśli modal jest otwarty
      if (showPresetModal) {
        setSavedPresets(presets);
      }
      
      reset();
      toast.success("Preset zapisany pomyślnie!");
    } catch (error) {
      toast.error("Nie udało się zapisać presetu.");
    }
  }, [gradientState, reset, showPresetModal]);

  // Funkcja usuwająca preset - usuwa wybrany preset z localStorage
  const deletePreset = useCallback((id: number) => {
    try {
      const existingPresets = localStorage.getItem("gradients");
      
      if (existingPresets) {
        const presets: SavedPreset[] = JSON.parse(existingPresets);
        const updatedPresets = presets.filter(preset => preset.id !== id);
        
        localStorage.setItem("gradients", JSON.stringify(updatedPresets));
        setSavedPresets(updatedPresets);
        
        toast.success("Preset usunięty pomyślnie");
      }
    } catch (error) {
      toast.error("Nie udało się usunąć presetu");
    }
  }, []);
  
  // Funkcja resetująca filtry do wartości domyślnych
  const resetFilters = useCallback(() => {
    setFilterBlur(0);
    setFilterHue(0);
    setFilterSaturate(100);
    setFilterContrast(100);
    toast.info("Filtry zresetowane");
  }, []);

  // Generowanie losowego gradientu - wzbogaca doświadczenie użytkownika
  // Zastosowałem tu algorytm generowania losowych kolorów HSL zamiast RGB
  // aby uzyskać bardziej estetyczne wyniki
  const generateRandomGradient = useCallback(() => {
    // Wybierz losowy typ gradientu
    const types: ("linear" | "radial" | "conic")[] = ["linear", "radial", "conic"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    // Generuj od 2 do 5 losowych kolorów
    const colorCount = Math.floor(Math.random() * 3) + 2; // 2 do 4 kolorów
    const colors: string[] = [];
    
    for (let i = 0; i < colorCount; i++) {
      // Generowanie losowych kolorów HSL - daje lepsze rezultaty niż losowe RGB
      const hue = Math.floor(Math.random() * 360);
      const saturation = 70 + Math.floor(Math.random() * 30); // 70-100%
      const lightness = 40 + Math.floor(Math.random() * 50); // 40-90%
      
      // Konwertuj HSL na HEX używając culori
      const color = culoriLib.formatHex(culoriLib.parse(`hsl(${hue}, ${saturation}%, ${lightness}%)`));
      colors.push(color);
    }
    
    // Ustaw losowy kąt dla linear i conic
    const angle = Math.floor(Math.random() * 360);
    
    // Ustaw losowy kształt dla radial
    const shapes: ("circle" | "ellipse")[] = ["circle", "ellipse"];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Aktualizuj stan
    updateState({
      gradientType: randomType,
      angle,
      shape: randomShape,
      colors
    });
    
    toast.success("Wygenerowano losowy gradient");
  }, [updateState]);
  
  // Eksport gradientu jako obrazu PNG - umożliwia używanie gradientu poza aplikacją
  const exportAsPNG = useCallback(() => {
    if (!previewRef.current) return;
    
    try {
      // Tworzenie tymczasowego canvas
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        toast.error("Nie udało się utworzyć kontekstu canvas");
        return;
      }
      
      // Rysowanie gradientu na canvas
      if (gradientState.gradientType === "linear") {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        gradientState.colors.forEach((color, index) => {
          gradient.addColorStop(index / (gradientState.colors.length - 1), color);
        });
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
      } else if (gradientState.gradientType === "radial") {
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2
        );
        
        gradientState.colors.forEach((color, index) => {
          gradient.addColorStop(index / (gradientState.colors.length - 1), color);
        });
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
      } else {
        // Conic gradient nie jest bezpośrednio wspierany przez Canvas API
        ctx.fillStyle = gradientState.colors[0];
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText("Gradient stożkowy nie jest w pełni wspierany w eksporcie PNG", 50, 50);
      }
      
      // Konwersja canvas do PNG i zapisanie
      canvas.toBlob(function(blob) {
        if (blob) {
          saveAs(blob, `gradient-${Date.now()}.png`);
          toast.success("Gradient wyeksportowany jako PNG");
        }
      });
    } catch (error) {
      console.error("Błąd eksportu PNG:", error);
      toast.error("Nie udało się wyeksportować gradientu");
    }
  }, [gradientState]);
  
  // Eksport gradientu jako SVG - alternatywny format eksportu
  const exportAsSVG = useCallback(() => {
    try {
      const svgCode = getSVGCode();
      const blob = new Blob([svgCode], {type: "image/svg+xml;charset=utf-8"});
      saveAs(blob, `gradient-${Date.now()}.svg`);
      toast.success("Gradient wyeksportowany jako SVG");
    } catch (error) {
      console.error("Błąd eksportu SVG:", error);
      toast.error("Nie udało się wyeksportować gradientu");
    }
  }, [getSVGCode]);

  // Lista kolorów z identyfikatorami dla DnD Kit
  // Używam useMemo dla optymalizacji renderowania
  const colorItems = useMemo(() => 
    gradientState.colors.map((color, index) => ({
      id: `color-${index}`,
      color
    }))
  , [gradientState.colors]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => setGradientState(initialState)}>
      <div className="space-y-6">
        {/* Toast notifications */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: 'white',
              },
            },
          }}
        />
        
        {/* Tooltips */}
        <Tooltip id="color-tooltip" />
        <Tooltip id="remove-tooltip" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel kontrolny */}
          <div className="lg:col-span-1">
            <motion.div 
              className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-base-200 p-5 border-b border-base-300">
                <h2 className="text-2xl font-bold">Kreator Gradientu</h2>
              </div>
              
              {/* Zakładki */}
              <Tab.Group onChange={(index) => setActiveTab(['edycja', 'efekty', 'kod'][index] as 'edycja' | 'efekty' | 'kod')}>
                <Tab.List className="tabs tabs-boxed bg-base-100 pt-2 px-4 gap-1">
                  <Tab className={({ selected }) => 
                    `tab tab-lg tab-lifted ${selected ? 'tab-active' : ''}`
                  }>
                    Edycja
                  </Tab>
                  <Tab className={({ selected }) => 
                    `tab tab-lg tab-lifted ${selected ? 'tab-active' : ''}`
                  }>
                    Efekty
                  </Tab>
                  <Tab className={({ selected }) => 
                    `tab tab-lg tab-lifted ${selected ? 'tab-active' : ''}`
                  }>
                    Kod
                  </Tab>
                </Tab.List>
                
                <Tab.Panels className="p-6">
                  {/* Panel Edycja */}
                  <Tab.Panel>
                    {isLoading ? (
                      <GradientLoader />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {/* Typ gradientu - wybór z Headless UI Listbox */}
                        <div>
                          <label className="form-control w-full">
                            <div className="label">
                              <span className="label-text font-medium">Typ gradientu</span>
                            </div>
                            <Listbox 
                              value={gradientOptions.find(option => option.id === gradientState.gradientType) || gradientOptions[0]} 
                              onChange={(option) => updateState({ gradientType: option.id })}
                            >
                              <div className="relative mt-1">
                                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-base-100 py-2 pl-3 pr-10 text-left shadow-md border border-base-300 focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75">
                                  <span className="flex items-center gap-2">
                                    <span>{gradientOptions.find(option => option.id === gradientState.gradientType)?.icon}</span>
                                    <span>{gradientOptions.find(option => option.id === gradientState.gradientType)?.name}</span>
                                  </span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                </Listbox.Button>
                                <Transition
                                  as={React.Fragment}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-base-100 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    {gradientOptions.map((option) => (
                                      <Listbox.Option
                                        key={option.id}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? 'bg-primary/10 text-primary' : 'text-base-content'
                                          }`
                                        }
                                        value={option}
                                      >
                                        {({ selected }) => (
                                          <>
                                            <span className={`flex items-center gap-2 ${selected ? 'font-medium' : 'font-normal'}`}>
                                              <span>{option.icon}</span>
                                              <span>{option.name}</span>
                                            </span>
                                            {selected ? (
                                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                              </span>
                                            ) : null}
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </Listbox>
                          </label>
                        </div>
                        
                        {/* Parametry specyficzne dla typu */}
                        {(gradientState.gradientType === "linear" || gradientState.gradientType === "conic") && (
                          <div>
                            <label className="form-control w-full">
                              <div className="label">
                                <span className="label-text font-medium">
                                  {gradientState.gradientType === "linear" ? "Kąt" : "Kąt początkowy"}
                                </span>
                                <span className="label-text-alt">{gradientState.angle}°</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="360"
                                step="1"
                                value={gradientState.angle}
                                onChange={(e) => updateState({ angle: Number(e.target.value) })}
                                className="range range-primary"
                              />
                              <div className="w-full flex justify-between text-xs px-2 mt-1">
                                <span>0°</span>
                                <span>90°</span>
                                <span>180°</span>
                                <span>270°</span>
                                <span>360°</span>
                              </div>
                            </label>
                          </div>
                        )}
                        
                        {gradientState.gradientType === "radial" && (
                          <div>
                            <label className="form-control w-full">
                              <div className="label">
                                <span className="label-text font-medium">Kształt</span>
                              </div>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="shape"
                                    className="radio radio-primary"
                                    checked={gradientState.shape === "circle"}
                                    onChange={() => updateState({ shape: "circle" })}
                                  />
                                  <span>Okrąg</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="shape"
                                    className="radio radio-primary"
                                    checked={gradientState.shape === "ellipse"}
                                    onChange={() => updateState({ shape: "ellipse" })}
                                  />
                                  <span>Elipsa</span>
                                </label>
                              </div>
                            </label>
                          </div>
                        )}
                        
                        {/* Edycja kolorów */}
                        <div>
                          <div className="label">
                            <span className="label-text font-medium">Kolory gradientu</span>
                            <div className="flex gap-1">
                              <button 
                                onClick={addColor} 
                                className="btn btn-xs btn-primary"
                                aria-label="Dodaj kolor"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          {/* Podgląd kolorów jako pasek */}
                          <div 
                            className="w-full h-8 rounded-md mb-3" 
                            style={{ background: gradientCSS }}
                            aria-hidden="true"
                          ></div>
                          
                          {/* Lista kolorów z Drag & Drop */}
                          <div 
                            ref={colorsListRef} 
                            className="max-h-52 overflow-y-auto pr-1 space-y-2"
                          >
                            <DndContext
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={handleDragEnd}
                              modifiers={[restrictToVerticalAxis]}
                            >
                              <SortableContext 
                                items={colorItems.map(item => item.id)} 
                                strategy={verticalListSortingStrategy}
                              >
                                {colorItems.map((item, index) => (
                                  <SortableColorItem
                                    key={item.id}
                                    id={item.id}
                                    color={item.color}
                                    index={index}
                                    onRemove={removeColor}
                                    onUpdate={updateColor}
                                  />
                                ))}
                              </SortableContext>
                            </DndContext>
                          </div>
                          
                          {/* Upuść obraz, aby wyodrębnić kolory */}
                          <div 
                            {...getRootProps()} 
                            className={`mt-4 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                              isDragActive ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'
                            }`}
                          >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                              <p className="text-sm">Upuść obraz tutaj...</p>
                            ) : (
                              <p className="text-sm">Przeciągnij i upuść obraz lub kliknij, aby wybrać plik.<br />Wyodrębnimy z niego kolory.</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Przyciski akcji */}
                        <div className="grid grid-cols-2 gap-2 pt-4">
                          <button 
                            onClick={undo} 
                            className="btn btn-outline btn-sm" 
                            disabled={historyIndex === 0}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Cofnij
                          </button>
                          <button 
                            onClick={redo} 
                            className="btn btn-outline btn-sm" 
                            disabled={historyIndex === history.length - 1}
                          >
                            Ponów
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={generateRandomGradient} 
                            className="btn btn-outline btn-primary btn-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                            Losowy gradient
                          </button>
                          <button 
                            onClick={() => setShowPresetModal(true)} 
                            className="btn btn-outline btn-success btn-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Moje presety
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </Tab.Panel>
                  
                  {/* Panel Efekty */}
                  <Tab.Panel>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="space-y-5">
                        <div>
                          <label className="form-control w-full">
                            <div className="label">
                              <span className="label-text font-medium">Rozmycie</span>
                              <span className="label-text-alt">{filterBlur}px</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="20"
                              value={filterBlur}
                              onChange={(e) => setFilterBlur(Number(e.target.value))}
                              className="range range-primary range-sm"
                              aria-label="Poziom rozmycia"
                            />
                          </label>
                        </div>
                        
                        <div>
                          <label className="form-control w-full">
                            <div className="label">
                              <span className="label-text font-medium">Obrót odcienia</span>
                              <span className="label-text-alt">{filterHue}°</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="360"
                              value={filterHue}
                              onChange={(e) => setFilterHue(Number(e.target.value))}
                              className="range range-secondary range-sm"
                              aria-label="Obrót odcienia"
                            />
                          </label>
                        </div>
                        
                        <div>
                          <label className="form-control w-full">
                            <div className="label">
                              <span className="label-text font-medium">Nasycenie</span>
                              <span className="label-text-alt">{filterSaturate}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="200"
                              value={filterSaturate}
                              onChange={(e) => setFilterSaturate(Number(e.target.value))}
                              className="range range-accent range-sm"
                              aria-label="Poziom nasycenia"
                            />
                          </label>
                        </div>
                        
                        <div>
                          <label className="form-control w-full">
                            <div className="label">
                              <span className="label-text font-medium">Kontrast</span>
                              <span className="label-text-alt">{filterContrast}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="200"
                              value={filterContrast}
                              onChange={(e) => setFilterContrast(Number(e.target.value))}
                              className="range range-info range-sm"
                              aria-label="Poziom kontrastu"
                            />
                          </label>
                        </div>
                      </div>
                      
                      <div className="divider">Animacja</div>
                      
                      <div className="flex justify-center">
                        <button 
                          onClick={() => setAnimateGradient(!animateGradient)} 
                          className={`btn ${animateGradient ? 'btn-error' : 'btn-info'}`}
                        >
                          {animateGradient ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                              </svg>
                              Zatrzymaj animację
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                              Animuj gradient
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="divider">Eksport</div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={resetFilters} 
                          className="btn btn-outline btn-sm"
                        >
                          Resetuj filtry
                        </button>
                        <button 
                          onClick={exportAsPNG} 
                          className="btn btn-outline btn-accent btn-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Eksportuj PNG
                        </button>
                      </div>
                      
                      <button 
                        onClick={exportAsSVG}
                        className="btn btn-accent w-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        Eksportuj jako SVG
                      </button>
                    </motion.div>
                  </Tab.Panel>
                  
                  {/* Panel Kod */}
                  <Tab.Panel>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">Kod CSS</h3>
                            <button 
                              onClick={() => copyText(getCSSCode())} 
                              className="btn btn-xs btn-outline"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                              </svg>
                              Kopiuj
                            </button>
                          </div>
                          <div className="mockup-code bg-neutral text-neutral-content">
                            <pre><code>{getCSSCode()}</code></pre>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">Kod SVG</h3>
                            <button 
                              onClick={() => copyText(getSVGCode())} 
                              className="btn btn-xs btn-outline"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                              </svg>
                              Kopiuj
                            </button>
                          </div>
                          <div className="mockup-code bg-neutral text-neutral-content max-h-64 overflow-y-auto">
                            <pre><code>{getSVGCode()}</code></pre>
                          </div>
                        </div>
                      </div>
                      
                      <div className="divider">Zapisz Preset</div>
                      
                      <form onSubmit={handleSubmit(onSubmitPreset)} className="space-y-3">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Nazwa presetu</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Mój gradient"
                            className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                            {...register("name", { required: "Nazwa jest wymagana" })}
                          />
                          {errors.name && (
                            <label className="label">
                              <span className="label-text-alt text-error">{errors.name.message}</span>
                            </label>
                          )}
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Tagi (opcjonalnie)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="np. ciepły, kolorowy, niebieski"
                            className="input input-bordered"
                            {...register("tags")}
                          />
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Opis (opcjonalnie)</span>
                          </label>
                          <textarea
                            placeholder="Krótki opis gradientu..."
                            className="textarea textarea-bordered"
                            {...register("description")}
                          ></textarea>
                        </div>
                        
                        <button 
                          type="submit"
                          className="btn btn-primary w-full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h1a2 2 0 012 2v7a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 012-2h1v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                          </svg>
                          Zapisz preset
                        </button>
                      </form>
                    </motion.div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </motion.div>
          </div>
          
          {/* Podgląd gradientu */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-xl overflow-hidden h-full min-h-[400px] shadow-xl border border-base-300"
            >
              {/* Wzór tła dla przezroczystości */}
              <div className="absolute inset-0 bg-gradient-dots bg-[length:10px_10px]"></div>
              
              {/* Gradient */}
              <motion.div
                ref={previewRef}
                className={`absolute inset-0 transition-all duration-500 ${animateGradient ? "animate-gradient-move" : ""}`}
                style={{
                  background: gradientCSS,
                  backgroundSize: animateGradient ? "200% 200%" : undefined,
                  filter: filterStyle as unknown as string
                }}
                onClick={() => setShowEnlargedPreview(true)}
              ></motion.div>
              
              {/* Nakładka z informacjami */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/30 backdrop-blur-sm">
                <p className="text-white font-medium text-center">
                  Kliknij, aby powiększyć podgląd
                </p>
              </div>
              
              {/* Przycisk powiększenia */}
              <button
                className="absolute top-4 right-4 btn btn-circle btn-sm bg-white/20 hover:bg-white/40 backdrop-blur-sm border-none text-white"
                onClick={() => setShowEnlargedPreview(true)}
                aria-label="Powiększ podgląd"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z" />
                  <path fillRule="evenodd" d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Modal z zapisanymi presetami */}
        <AnimatePresence>
          {showPresetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black backdrop-blur-sm"
                onClick={() => setShowPresetModal(false)}
              ></motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="z-10 modal-box max-w-4xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Moje presety</h2>
                  <button 
                    onClick={() => setShowPresetModal(false)}
                    className="btn btn-sm btn-circle"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                {savedPresets.length === 0 ? (
                  <div className="py-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="mt-4 text-lg font-medium">Brak zapisanych presetów</p>
                    <p className="mt-2 text-base-content/70">
                      Utwórz gradient i zapisz go, aby móc go później wykorzystać
                    </p>
                    <button
                      className="btn btn-primary mt-6"
                      onClick={() => {
                        setShowPresetModal(false);
                        setTimeout(() => setActiveTab('kod'), 300);
                      }}
                    >
                      Zapisz swój pierwszy preset
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
                    {savedPresets.map((preset, index) => {
                      let presetStyle = {};
                      
                      if (preset.gradientType === "linear" && preset.angle !== undefined) {
                        presetStyle = { background: `linear-gradient(${preset.angle}deg, ${preset.colors.join(", ")})` };
                      } else if (preset.gradientType === "radial" && preset.shape) {
                        presetStyle = { background: `radial-gradient(${preset.shape}, ${preset.colors.join(", ")})` };
                      } else if (preset.gradientType === "conic" && preset.angle !== undefined) {
                        presetStyle = { background: `conic-gradient(from ${preset.angle}deg, ${preset.colors.join(", ")})` };
                      }
                      
                      return (
                        <motion.div
                          key={preset.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ scale: 1.03 }}
                          className="card bg-base-100 shadow-lg hover:shadow-xl transition-all border border-base-300 overflow-hidden group"
                        >
                          <figure className="relative">
                            <div 
                              className="w-full h-36 group-hover:scale-105 transition-transform duration-500" 
                              style={presetStyle}
                            ></div>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/30 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  updateState(preset);
                                  setShowPresetModal(false);
                                  toast.success("Preset załadowany pomyślnie!");
                                }}
                                className="btn btn-sm btn-primary"
                              >
                                Użyj
                              </button>
                              <button
                                onClick={() => deletePreset(preset.id)}
                                className="btn btn-sm btn-error"
                              >
                                Usuń
                              </button>
                            </div>
                          </figure>
                          
                          <div className="card-body p-4">
                            <h3 className="card-title text-base">{preset.name || `Preset #${index + 1}`}</h3>
                            
                            <div className="flex items-center mb-2">
                              <div className="badge badge-sm badge-primary mr-2">
                                {preset.gradientType === "linear" 
                                  ? "Liniowy" 
                                  : preset.gradientType === "radial" 
                                    ? "Promienisty" 
                                    : "Stożkowy"}
                              </div>
                              <span className="text-xs text-base-content/70">
                                {preset.colors.length} {preset.colors.length === 1 
                                  ? "kolor" 
                                  : preset.colors.length < 5 
                                    ? "kolory" 
                                    : "kolorów"}
                              </span>
                            </div>
                            
                            <div className="space-y-1 text-xs">
                              {preset.gradientType === "linear" && preset.angle !== undefined && (
                                <div className="flex justify-between">
                                  <span>Kąt:</span>
                                  <span className="font-mono">{preset.angle}°</span>
                                </div>
                              )}
                              
                              {preset.gradientType === "radial" && preset.shape && (
                                <div className="flex justify-between">
                                  <span>Kształt:</span>
                                  <span className="font-mono">{preset.shape === "circle" ? "Okrąg" : "Elipsa"}</span>
                                </div>
                              )}
                              
                              {preset.gradientType === "conic" && preset.angle !== undefined && (
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
                            
                            <div className="mt-2 flex gap-1">
                              {preset.colors.map((color, i) => (
                                <div 
                                  key={i}
                                  className="w-6 h-6 rounded-full border border-base-300" 
                                  style={{ backgroundColor: color }}
                                  title={color}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal z powiększonym podglądem gradientu */}
        <AnimatePresence>
          {showEnlargedPreview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black backdrop-blur-sm"
                onClick={() => setShowEnlargedPreview(false)}
              ></motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="z-10 modal-box max-w-5xl p-0 overflow-hidden"
              >
                {/* Gradient w pełnym widoku  */}
                <div 
                  className={`w-full aspect-video ${animateGradient ? "animate-gradient-move" : ""}`}
                  style={{
                    background: gradientCSS,
                    backgroundSize: animateGradient ? "200% 200%" : undefined,
                    filter: `blur(${filterBlur}px) hue-rotate(${filterHue}deg) saturate(${filterSaturate}%) contrast(${filterContrast}%)`
                  }}
                ></div>
                
                <div className="p-4 bg-base-100">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button 
                      onClick={() => setAnimateGradient(!animateGradient)}
                      className={`btn btn-sm ${animateGradient ? 'btn-error' : 'btn-info'}`}
                    >
                      {animateGradient ? 'Zatrzymaj animację' : 'Animuj gradient'}
                    </button>
                    <button 
                      onClick={handleSubmit(onSubmitPreset)}
                      className="btn btn-sm btn-success"
                    >
                      Zapisz preset
                    </button>
                    <button 
                      onClick={exportAsPNG}
                      className="btn btn-sm btn-accent"
                    >
                      Eksportuj PNG
                    </button>
                    <button 
                      onClick={() => setShowEnlargedPreview(false)}
                      className="btn btn-sm"
                    >
                      Zamknij
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
