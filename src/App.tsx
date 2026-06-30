import { useState } from 'react';
import LavaLamp from './components/LavaLamp';
import Controls from './components/Controls';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [color1, setColor1] = useState('#ff3e00');
  const [color2, setColor2] = useState('#ff00d4');
  const [speed, setSpeed] = useState(1.0);
  const [blobCount, setBlobCount] = useState(12);
  const [temperature, setTemperature] = useState(0.5);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-20 blur-[120px] pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color1}, ${color2}, transparent)`
        }}
      />

      <div className="z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Lava Lamp Visualizer Container */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Lamp Body Top */}
          <div className="w-32 h-12 bg-gradient-to-b from-[#222] to-[#111] rounded-t-full shadow-lg z-20 border-t border-white/10" />
          
          {/* The Glass Container */}
          <div className="relative w-64 md:w-80 h-[500px] md:h-[600px] -my-2 group">
            {/* Inner Glass Glow */}
            <div 
              className="absolute inset-0 rounded-full mix-blend-screen pointer-events-none transition-all duration-1000 opacity-20 blur-3xl animate-pulse"
              style={{ backgroundColor: color2 }}
            />
            
            <LavaLamp 
              color1={color1} 
              color2={color2} 
              speed={speed} 
              blobCount={blobCount} 
              temperature={temperature}
            />
            
            {/* Surface Reflections */}
            <div className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
               <div className="absolute top-0 left-1/4 w-1/4 h-full bg-gradient-to-r from-white/10 to-transparent skew-x-[-15deg] opacity-20" />
               <div className="absolute top-0 right-1/4 w-1/12 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-[-15deg] opacity-30" />
            </div>

            {/* Ambient Glow from within */}
            <div 
              className="absolute inset-0 rounded-full mix-blend-screen pointer-events-none transition-opacity duration-500 opacity-30 blur-2xl"
              style={{ backgroundColor: color1 }}
            />
          </div>

          {/* Lamp Base */}
          <div className="w-48 h-32 bg-gradient-to-b from-[#111] via-[#222] to-[#0a0a0a] rounded-t-[40%] rounded-b-2xl shadow-2xl relative z-20 border-t border-white/5">
            {/* Base switch or logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500/20 rounded-full blur-sm animate-pulse" />
          </div>

          {/* Floor shadow/glow */}
          <div 
            className="w-64 h-8 blur-2xl rounded-[100%] mt-2 opacity-50"
            style={{ backgroundColor: color1 }}
          />
        </div>

        {/* Info and Controls */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              LAVA<span className="text-purple-500">GLOW</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
              A mesmerizing liquid physics simulation. Adjust the parameters to create your perfect ambient atmosphere.
            </p>
          </div>

          <Controls 
            color1={color1} setColor1={setColor1}
            color2={color2} setColor2={setColor2}
            speed={speed} setSpeed={setSpeed}
            blobCount={blobCount} setBlobCount={setBlobCount}
            temperature={temperature} setTemperature={setTemperature}
          />

          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Volcano', c1: '#ff3e00', c2: '#ffb300' },
              { name: 'Midnight', c1: '#7000ff', c2: '#00c3ff' },
              { name: 'Toxic', c1: '#00ff40', c2: '#bfff00' },
              { name: 'Cosmic', c1: '#ff00d4', c2: '#7000ff' },
            ].map((vibe) => (
              <button
                key={vibe.name}
                onClick={() => {
                  setColor1(vibe.c1);
                  setColor2(vibe.c2);
                }}
                className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all active:scale-95"
              >
                {vibe.name}
              </button>
            ))}
          </div>

          <div className="flex gap-4 text-xs font-mono text-gray-600 uppercase tracking-widest">
            <span>60 FPS</span>
            <span>•</span>
            <span>WEBGL CORE</span>
            <span>•</span>
            <span>INTERACTIVE</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative floating elements */}
      <AnimatePresence>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            initial={{ 
              width: 100, 
              height: 100, 
              x: Math.random() * 2000 - 1000, 
              y: Math.random() * 2000 - 1000,
              opacity: 0 
            }}
            animate={{ 
              y: [null, Math.random() * 100 - 50],
              opacity: [0, 0.05, 0],
            }}
            transition={{ 
              duration: 10 + Math.random() * 20, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              backgroundColor: i % 2 === 0 ? color1 : color2,
              filter: 'blur(80px)',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default App;
