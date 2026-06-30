import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

interface LavaLampProps {
  color1: string;
  color2: string;
  speed: number;
  blobCount: number;
  temperature: number; // 0 to 1
}

const LavaLamp: React.FC<LavaLampProps> = ({ 
  color1 = '#ff4d00', 
  color2 = '#7000ff', 
  speed = 1.0, 
  blobCount = 12,
  temperature = 0.5
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const requestRef = useRef<number>(0);
  
  // Convert hex to THREE.Color
  const c1 = useMemo(() => new THREE.Color(color1), [color1]);
  const c2 = useMemo(() => new THREE.Color(color2), [color2]);

  const uniformsRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_color1: { value: c1 },
      u_color2: { value: c2 },
      u_speed: { value: speed },
      u_temp: { value: temperature },
      u_blob_count: { value: blobCount },
    };
    uniformsRef.current = uniforms;

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec3 u_color1;
      uniform vec3 u_color2;
      uniform float u_speed;
      uniform float u_temp;
      uniform float u_blob_count;
      varying vec2 vUv;

      float hash(float n) { return fract(sin(n) * 43758.5453123); }
      
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = vUv;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 p = uv;
        p.x *= aspect;

        float total = 0.0;
        float t = u_time * 0.4 * u_speed;
        
        for (float i = 0.0; i < 20.0; i++) {
          if (i >= u_blob_count) break;
          
          float radius = 0.08 + hash(i * 13.0) * 0.12;
          float speed_factor = 0.5 + hash(i * 7.0) * 0.5;
          
          float x = (0.2 + 0.6 * hash(i * 23.0)) * aspect;
          x += sin(t * 0.5 * speed_factor + i) * 0.15;
          
          float y_cycle = fract(t * 0.2 * speed_factor + hash(i * 31.0));
          float y = 0.0;
          
          if (y_cycle < 0.5) {
            y = smoothstep(0.0, 0.5, y_cycle) * 1.2 - 0.1;
          } else {
            y = (1.0 - smoothstep(0.5, 1.0, y_cycle)) * 1.2 - 0.1;
          }
          
          x += sin(y * 5.0 + t) * 0.05;
          vec2 blobPos = vec2(x, y);
          float d = length(p - blobPos);
          total += (radius * radius) / (d * d);
        }

        float bg_distort = 0.15 * sin(uv.y * 4.0 + t * 0.5) + 0.1 * cos(uv.x * 3.0 - t * 0.3);
        float threshold = 1.0;
        float softness = 0.15;
        float intensity = smoothstep(threshold - softness, threshold + softness, total + bg_distort);

        vec3 base_color = mix(vec3(0.01, 0.0, 0.02), u_color1 * 0.15, uv.y);
        vec3 blob_color = mix(u_color1, u_color2, uv.y);
        vec3 final_color = mix(base_color, blob_color, intensity);
        
        float highlight = smoothstep(threshold + 0.1, threshold + 0.5, total);
        final_color += highlight * mix(u_color1, vec3(1.0), 0.5) * 0.3;
        
        float rim = smoothstep(threshold - 0.05, threshold, total) - smoothstep(threshold, threshold + 0.05, total);
        final_color += rim * u_color2 * 0.6;

        final_color += blob_color * 0.1 * u_temp;

        float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv - 0.5));
        final_color *= vignette;

        gl_FragColor = vec4(final_color, 1.0);
      }
    `;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = (time: number) => {
      if (uniformsRef.current) {
        uniformsRef.current.u_time.value = time / 1000;
      }
      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      if (uniformsRef.current) {
        uniformsRef.current.u_resolution.value.set(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update uniforms without re-creating scene
  useEffect(() => {
    if (uniformsRef.current) {
      uniformsRef.current.u_color1.value = c1;
      uniformsRef.current.u_color2.value = c2;
      uniformsRef.current.u_speed.value = speed;
      uniformsRef.current.u_blob_count.value = blobCount;
      uniformsRef.current.u_temp.value = temperature;
    }
  }, [c1, c2, speed, blobCount, temperature]);

  // Update uniforms when props change without recreating the whole scene if possible
  // However, the useEffect dependency array handles it for now by recreating, 
  // which is fine for a single instance.
  
  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-gray-800/50 backdrop-blur-sm">
      {/* Glossy reflection overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-30 rounded-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-20 rounded-full" />
    </div>
  );
};

export default LavaLamp;
