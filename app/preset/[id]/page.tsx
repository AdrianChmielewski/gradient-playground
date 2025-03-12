import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

/**
 * ISR - Incremental Static Regeneration
 * Strona dla pojedynczego presetu odświeżana co 60 sekund.
 */
export const revalidate = 60;

export default function PresetPage({ params }: { params: { id: string } }) {
  const presetId = Number(params.id);
  // Ścieżka do pliku JSON z zapisanymi presetami (folder "data" w katalogu głównym)
  const filePath = path.join(process.cwd(), 'data', 'presets.json');
  let presets = [];
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    presets = JSON.parse(data);
  } catch (err) {
    notFound();
  }
  // Wyszukiwanie presetu o danym id
  const preset = presets.find((p: any) => p.id === presetId);
  if (!preset) {
    notFound();
  }
  let gradientCSS = "";
  if (preset.gradientType === "linear") {
    gradientCSS = `linear-gradient(${preset.angle}deg, ${preset.colors.join(", ")})`;
  } else if (preset.gradientType === "radial") {
    gradientCSS = `radial-gradient(${preset.shape}, ${preset.colors.join(", ")})`;
  } else if (preset.gradientType === "conic") {
    gradientCSS = `conic-gradient(from ${preset.angle}deg, ${preset.colors.join(", ")})`;
  }
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Gradient Preset {preset.id}</h1>
      <div className="w-full h-64 rounded-lg" style={{ background: gradientCSS }}></div>
      <div className="mt-4">
        <p className="text-lg">Type: {preset.gradientType}</p>
        {preset.gradientType === "linear" || preset.gradientType === "conic" ? (
          <p className="text-lg">Angle: {preset.angle}°</p>
        ) : (
          <p className="text-lg">Shape: {preset.shape}</p>
        )}
        <p className="text-lg">Colors: {preset.colors.join(", ")}</p>
      </div>
    </div>
  );
}
