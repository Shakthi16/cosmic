import React, { useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { SolarSystem } from './SolarSystem';
import { GalaxyControls } from './GalaxyControls';
import { VoiceNarrator } from './VoiceNarrator';

// Subtle ParallaxStars background
const ParallaxStars = ({ velocity = 0.0001 }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += velocity * 0.02;
      groupRef.current.rotation.y += velocity * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars
        radius={300}
        depth={60}
        count={2000}
        factor={4}
        saturation={0}
        fade
        speed={0}
      />
      <Stars
        radius={500}
        depth={100}
        count={1000}
        factor={6}
        saturation={0}
        fade
        speed={0}
      />
    </group>
  );
};

const MilkyWayGalaxy = ({ onZoomToSolar }: { onZoomToSolar: () => void }) => {
  const meshRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.0002;
    if (particlesRef.current) particlesRef.current.rotation.y += 0.00015;
    if (glowRef.current) glowRef.current.rotation.y += 0.0001;
    if (dustRef.current) dustRef.current.rotation.y += 0.00018;
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.0005;
      // Subtle core pulsation
      const pulse = Math.sin(Date.now() * 0.001) * 0.01;
      coreRef.current.scale.setScalar(1 + pulse);
    }
  });

  // Main galaxy particles
  const galaxyGeometry = useMemo(() => {
    const count = 500000;
    const arms = 4;
    const spinFactor = 4;
    const innerRadius = 5;
    const outerRadius = 150;
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Milky Way color palette
    const coreColor = new THREE.Color(0.95, 0.9, 0.75);
    const armColor = new THREE.Color(0.4, 0.5, 0.9);
    const haloColor = new THREE.Color(0.15, 0.2, 0.3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.pow(Math.random(), 2) * (outerRadius - innerRadius) + innerRadius;
      const armAngle = (i % arms) * (Math.PI * 2 / arms);
      const spin = Math.log(radius / innerRadius + 1) * spinFactor;
      const angle = armAngle + spin + (Math.random() - 0.5) * 0.4;
      
      const armOffset = (Math.random() - 0.5) * 0.3 * radius;
      const verticalOffset = (Math.random() - 0.5) * 8 * (1 - radius / outerRadius);
      
      positions[i3] = Math.cos(angle) * radius + armOffset;
      positions[i3 + 1] = verticalOffset;
      positions[i3 + 2] = Math.sin(angle) * radius + armOffset;
      
      let color;
      if (radius < 8) {
        color = coreColor.clone();
        color.multiplyScalar(0.9 + Math.random() * 0.3);
      } else if (radius < 40) {
        color = armColor.clone();
        color.multiplyScalar(0.7 + Math.random() * 0.3);
      } else {
        color = haloColor.clone();
        color.multiplyScalar(0.5 + Math.random() * 0.2);
      }
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = radius < 8 
        ? 0.6 + Math.random() * 0.4
        : 0.2 + Math.random() * 0.3;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geometry;
  }, []);

  // Glow particles for halo effect
  const glowGeometry = useMemo(() => {
    const count = 100000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const glowColor = new THREE.Color(0.4, 0.45, 0.8);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 10 + Math.random() * 140;
      const angle = Math.random() * Math.PI * 2;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 15;
      positions[i3 + 2] = Math.sin(angle) * radius;
      
      colors[i3] = glowColor.r;
      colors[i3 + 1] = glowColor.g;
      colors[i3 + 2] = glowColor.b;
      
      sizes[i] = 0.3 + Math.random() * 0.7;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geometry;
  }, []);

  // Dust particles
  const dustGeometry = useMemo(() => {
    const count = 200000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const dustColor = new THREE.Color(0.2, 0.15, 0.1);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 5 + Math.random() * 145;
      const angle = Math.random() * Math.PI * 2;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = Math.sin(angle) * radius;
      
      const darkness = 0.4 + Math.random() * 0.4;
      colors[i3] = dustColor.r * darkness;
      colors[i3 + 1] = dustColor.g * darkness;
      colors[i3 + 2] = dustColor.b * darkness;
      
      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geometry;
  }, []);

  return (
    <group ref={meshRef}>
      {/* Main galaxy particles */}
      <points ref={particlesRef} geometry={galaxyGeometry}>
        <pointsMaterial
          size={0.3}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Glow particles for halo effect */}
      <points ref={glowRef} geometry={glowGeometry}>
        <pointsMaterial
          size={0.5}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Dust particles */}
      <points ref={dustRef} geometry={dustGeometry}>
        <pointsMaterial
          size={1.0}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.6}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </points>

      {/* Galaxy core */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[6, 32, 32]} />
        <meshStandardMaterial
          color="#ffeebb"
          emissive="#ffcc77"
          emissiveIntensity={3.0}
          transparent
          opacity={0.95}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      {/* Core glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshStandardMaterial
          color="#ffdd99"
          emissive="#ffaa66"
          emissiveIntensity={1.5}
          transparent
          opacity={0.4}
          side={THREE.BackSide}
          roughness={0.7}
        />
      </mesh>

      {/* Solar System marker */}
      {/* Solar System marker - Enhanced version */}
<group position={[42, 0.5, 22]}>
  {/* Main marker sphere with pulsing glow */}
  <group>
    <mesh onClick={onZoomToSolar}>
      <sphereGeometry args={[1.5, 32, 32]} /> {/* Increased size */}
      <meshStandardMaterial
        color="#00ffff"  // Changed to cyan for better visibility
        emissive="#00ffff"
        emissiveIntensity={4.0}
        transparent
        opacity={0.95}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
    
    {/* Glow effect */}
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[2.2, 32, 32]} />
      <meshStandardMaterial
        color="#00ffff"
        emissive="#00ffff"
        emissiveIntensity={1.5}
        transparent
        opacity={0.3}
        side={THREE.BackSide}
        roughness={0.8}
      />
    </mesh>
  </group>

  {/* Arrow indicator */}
  <group position={[0, 3.5, 0]} rotation={[0, 0, Math.PI / 4]}>
    <mesh>
      <coneGeometry args={[0.8, 2, 4]} /> {/* 4-sided pyramid as arrow head */}
      <meshStandardMaterial
        color="#00ffff"
        emissive="#00ffff"
        emissiveIntensity={3.0}
      />
    </mesh>
    <mesh position={[0, -1.5, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 3, 8]} /> {/* Arrow stem */}
      <meshStandardMaterial
        color="#00ffff"
        emissive="#00ffff"
        emissiveIntensity={3.0}
      />
    </mesh>
  </group>

  {/* Text label with improved styling */}
  <Text
    position={[0, 6, 0]}
    fontSize={1.2}
    color="#00ffff"
    anchorX="center"
    anchorY="middle"
    outlineWidth={0.05}
    outlineColor="#000000"
    font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
    strokeWidth={0.5}
    strokeColor="#003333"
  >
    Our Solar System
  </Text>

  {/* Connecting line from arrow to marker */}
  <mesh position={[0, 1.5, 0]}>
    <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
    <meshStandardMaterial
      color="#00ffff"
      emissive="#00ffff"
      emissiveIntensity={2.0}
      transparent
      opacity={0.8}
    />
  </mesh>
</group>
    </group>
  );
};

export const GalaxyExplorer = () => {
  const [view, setView] = useState<'galaxy' | 'solar'>('galaxy');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  const handleZoomToSolar = () => setView('solar');
  const handleBackToGalaxy = () => {
    setView('galaxy');
    setSelectedPlanet(null);
  };

  const handlePlanetClick = (planetName: string) => {
    setSelectedPlanet(planetName);
  };

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      <Canvas camera={{ position: [0, 80, 200], fov: 60 }}>
        <ambientLight intensity={0.15} />
        <pointLight position={[60, 60, 60]} intensity={1.2} color="#4455ff" />
        <pointLight position={[-60, -60, -60]} intensity={0.4} color="#ff44aa" />
        
        <Suspense fallback={null}>
          <ParallaxStars velocity={0.0001} />
          
          {view === 'galaxy' ? (
            <MilkyWayGalaxy onZoomToSolar={handleZoomToSolar} />
          ) : (
            <SolarSystem onPlanetClick={handlePlanetClick} />
          )}
          
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minDistance={50}
            maxDistance={1000}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      <GalaxyControls
        view={view}
        onBackToGalaxy={handleBackToGalaxy}
        onZoomToSolar={handleZoomToSolar}
      />

      <VoiceNarrator selectedPlanet={selectedPlanet} />
    </div>
  );
};