import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

interface Preset {
  id: number;
  gradientType: "linear" | "radial" | "conic";
  angle: number;
  shape?: "circle" | "ellipse";
  colors: string[];
}

export default function PresetModal({ params }: { params: { presetId: string } }) {
  const presetId = Number(params.presetId);
  const dataDir = path.join(process.cwd(), 'data');
  const filePath = path.join(dataDir, 'presets.json');
  let presets: Preset[] = [];
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    presets = JSON.parse(data);
  } catch (error) {
    notFound();
  }
  const preset = presets.find((p) => p.id === presetId);
  if (!preset) {
    notFound();
  }
  const gradientCSS = preset.gradientType === "linear"
    ? `linear-gradient(${preset.angle}deg, ${preset.colors.join(", ")})`
    : preset.gradientType === "radial"
    ? `radial-gradient(${preset.shape}, ${preset.colors.join(", ")})`
    : `conic-gradient(from ${preset.angle}deg, ${preset.colors.join(", ")})`;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="modal-box relative">
        <h2 className="text-xl font-bold mb-4">Preset Detail</h2>
        <div className="w-80 h-48 rounded" style={{ background: gradientCSS }}></div>
        <p className="mt-4">Type: {preset.gradientType}</p>
        {preset.gradientType === "linear" || preset.gradientType === "conic" ? (
          <p>Angle: {preset.angle}°</p>
        ) : (
          <p>Shape: {preset.shape}</p>
        )}
        <button className="btn btn-error absolute top-2 right-2" onClick={() => window.history.back()}>
          Zamknij
        </button>
      </div>
    </div>
  );
}
