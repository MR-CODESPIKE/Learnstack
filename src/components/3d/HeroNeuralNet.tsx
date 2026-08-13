import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Node3D {
  id: string;
  position: [number, number, number];
  layer: number;
}

interface Connection3D {
  from: [number, number, number];
  to: [number, number, number];
}

interface Pulse3D {
  from: [number, number, number];
  to: [number, number, number];
  progress: number;
  speed: number;
}

function NeuralNetworkScene({ isReducedMotion }: { isReducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const pulsesRef = useRef<Pulse3D[]>([]);

  // Generate node coordinates for 4 layers: Input(3), Hidden1(4), Hidden2(4), Output(2)
  const { nodes, connections } = useMemo(() => {
    const layerSizes = [3, 4, 4, 2];
    const layerXCoords = [-3.2, -1.1, 1.1, 3.2];
    const generatedNodes: Node3D[] = [];
    const generatedConnections: Connection3D[] = [];

    layerSizes.forEach((count, layerIdx) => {
      const x = layerXCoords[layerIdx];
      const spacing = 1.6;
      const startY = -((count - 1) * spacing) / 2;

      for (let i = 0; i < count; i++) {
        const y = startY + i * spacing;
        // Subtle depth jitter
        const z = (Math.sin(layerIdx * 2 + i * 1.5) * 0.4);
        generatedNodes.push({
          id: `l${layerIdx}-n${i}`,
          position: [x, y, z],
          layer: layerIdx,
        });
      }
    });

    // Connect layer i to layer i + 1
    for (let l = 0; l < layerSizes.length - 1; l++) {
      const currentLayerNodes = generatedNodes.filter((n) => n.layer === l);
      const nextLayerNodes = generatedNodes.filter((n) => n.layer === l + 1);

      currentLayerNodes.forEach((src) => {
        nextLayerNodes.forEach((dst) => {
          generatedConnections.push({
            from: src.position,
            to: dst.position,
          });
        });
      });
    }

    return { nodes: generatedNodes, connections: generatedConnections };
  }, []);

  // Initialize pulses traveling along random connections
  useEffect(() => {
    const initialPulses: Pulse3D[] = [];
    for (let i = 0; i < 8; i++) {
      const randomConn = connections[Math.floor(Math.random() * connections.length)];
      initialPulses.push({
        from: randomConn.from,
        to: randomConn.to,
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012,
      });
    }
    pulsesRef.current = initialPulses;
  }, [connections]);

  // Track mouse coordinates for subtle parallax tilt
  const mousePos = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePos.current = { x, y };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Pulse meshes ref
  const pulseMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Gentle rotation if motion is not reduced
    if (!isReducedMotion) {
      groupRef.current.rotation.y += delta * 0.15;
      
      // Parallax mouse tilt
      const targetRotX = mousePos.current.y * 0.2;
      const targetRotZ = -mousePos.current.x * 0.15;
      groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.z += (targetRotZ - groupRef.current.rotation.z) * 0.05;
    }

    // Update pulse positions along connection vectors
    pulsesRef.current.forEach((pulse, idx) => {
      pulse.progress += pulse.speed;
      if (pulse.progress >= 1) {
        pulse.progress = 0;
        const newConn = connections[Math.floor(Math.random() * connections.length)];
        pulse.from = newConn.from;
        pulse.to = newConn.to;
      }

      const mesh = pulseMeshRefs.current[idx];
      if (mesh) {
        mesh.position.x = THREE.MathUtils.lerp(pulse.from[0], pulse.to[0], pulse.progress);
        mesh.position.y = THREE.MathUtils.lerp(pulse.from[1], pulse.to[1], pulse.progress);
        mesh.position.z = THREE.MathUtils.lerp(pulse.from[2], pulse.to[2], pulse.progress);
      }
    });
  });

  // Prepare line objects
  const lineObjects = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: '#A6632B',
      transparent: true,
      opacity: 0.35,
      linewidth: 1,
    });
    return connections.map((c) => {
      const points = [new THREE.Vector3(...c.from), new THREE.Vector3(...c.to)];
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.Line(geom, mat);
    });
  }, [connections]);

  return (
    <group ref={groupRef}>
      {/* Connection Lines */}
      {lineObjects.map((lineObj, idx) => (
        <primitive key={`line-${idx}`} object={lineObj} />
      ))}

      {/* Nodes */}
      {nodes.map((node) => {
        // Warm brown palette: output terracotta, hidden amber bronze & mahogany
        const isOutput = node.layer === 3;
        const color = isOutput ? '#C77A38' : node.layer === 0 ? '#8C4A1B' : '#A6632B';
        
        return (
          <group key={node.id} position={node.position}>
            {/* Inner Glowing Sphere */}
            <mesh>
              <sphereGeometry args={[0.22, 24, 24]} />
              <meshBasicMaterial color={color} />
            </mesh>
            {/* Outer Aura Halo */}
            <mesh>
              <sphereGeometry args={[0.34, 16, 16]} />
              <meshBasicMaterial color={color} transparent opacity={0.25} />
            </mesh>
          </group>
        );
      })}

      {/* Traveling Signal Pulse Particles */}
      {pulsesRef.current.map((_, idx) => (
        <mesh
          key={`pulse-${idx}`}
          ref={(el) => (pulseMeshRefs.current[idx] = el)}
        >
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#8C4A1B" />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroNeuralNet() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] rounded-3xl liquid-glass-dock overflow-hidden shadow-2xl flex items-center justify-center group">
      {/* Subtle Background Warm Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#A6632B]/10 via-transparent to-[#8C4A1B]/10 pointer-events-none" />
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <NeuralNetworkScene isReducedMotion={isReducedMotion} />
      </Canvas>

      {/* Overlay Badge */}
      <div className="absolute bottom-4 left-4 sm:left-6 px-3 py-1.5 rounded-lg bg-[#F5EFE6]/90 border border-[#D6C5B3] text-xs font-mono text-[#6E5D4F] flex items-center gap-2 backdrop-blur-md shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#A6632B] animate-pulse" />
        <span>3D Neural Net Simulation • R3F</span>
      </div>
    </div>
  );
}
