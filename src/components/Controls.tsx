import React from 'react';
import { Settings2, Thermometer, Zap, Droplets, Palette } from 'lucide-react';

interface ControlsProps {
  color1: string;
  setColor1: (c: string) => void;
  color2: string;
  setColor2: (c: string) => void;
  speed: number;
  setSpeed: (s: number) => void;
  blobCount: number;
  setBlobCount: (n: number) => void;
  temperature: number;
  setTemperature: (t: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
  color1, setColor1,
  color2, setColor2,
  speed, setSpeed,
  blobCount, setBlobCount,
  temperature, setTemperature
}) => {
  return (
    <div className="bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl text-white w-full max-w-md space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Settings2 className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-bold tracking-tight">Lava Lamp Settings</h2>
      </div>

      <div className="space-y-4">
        {/* Colors */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Palette className="w-4 h-4" />
            <span>Liquid Colors</span>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-xs uppercase tracking-wider text-gray-500">Primary</label>
              <div className="relative h-10 rounded-lg overflow-hidden border border-white/10">
                <input 
                  type="color" 
                  value={color1} 
                  onChange={(e) => setColor1(e.target.value)}
                  className="absolute inset-0 w-full h-full cursor-pointer bg-transparent border-none scale-150"
                />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs uppercase tracking-wider text-gray-500">Secondary</label>
              <div className="relative h-10 rounded-lg overflow-hidden border border-white/10">
                <input 
                  type="color" 
                  value={color2} 
                  onChange={(e) => setColor2(e.target.value)}
                  className="absolute inset-0 w-full h-full cursor-pointer bg-transparent border-none scale-150"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Thermometer className="w-4 h-4" />
              <span>Color Temperature</span>
            </div>
            <span className="text-purple-400 font-mono">{(temperature * 100).toFixed(0)}%</span>
          </div>
          <input 
            type="range" min="0" max="1" step="0.01" 
            value={temperature} 
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Speed */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-4 h-4" />
              <span>Viscosity / Speed</span>
            </div>
            <span className="text-purple-400 font-mono">{speed.toFixed(1)}x</span>
          </div>
          <input 
            type="range" min="0.1" max="3" step="0.1" 
            value={speed} 
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Blob Count */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Droplets className="w-4 h-4" />
              <span>Blob Density</span>
            </div>
            <span className="text-purple-400 font-mono">{blobCount}</span>
          </div>
          <input 
            type="range" min="1" max="20" step="1" 
            value={blobCount} 
            onChange={(e) => setBlobCount(parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <button 
          onClick={() => {
            setColor1('#ff3e00');
            setColor2('#7000ff');
            setSpeed(1.0);
            setBlobCount(12);
            setTemperature(0.5);
          }}
          className="w-full py-2 bg-white/5 hover:bg-white/10 transition-colors rounded-xl text-xs uppercase tracking-widest font-bold"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default Controls;
