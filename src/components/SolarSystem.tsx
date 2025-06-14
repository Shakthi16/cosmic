import React, { useRef, useState, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Text, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { VoiceNarrator } from './VoiceNarrator'; // Add this import

interface Planet {
  name: string;
  distance: number;
  size: number;
  color: string;
  rotationSpeed: number;
  orbitSpeed: number;
  description: string;
  texture?: string;
  ring?: {
    innerRadius: number;
    outerRadius: number;
    color: string;
  };
}

const planets: Planet[] = [
  {
    name: 'Mercury',
    distance: 10,
    size: 0.8,
    color: '#8c7853',
    rotationSpeed: 0.004,
    orbitSpeed: 0.04,
    description: 'The smallest and innermost planet in our solar system',
    texture: 'textures/mercury.jpg'
  },
  {
    name: 'Venus',
    distance: 14,
    size: 0.95,
    color: '#ffc649',
    rotationSpeed: 0.002,
    orbitSpeed: 0.015,
    description: 'The hottest planet with a thick, toxic atmosphere',
    texture: 'textures/venus.jpg'
  },
  {
    name: 'Earth',
    distance: 18,
    size: 1.0,
    color: '#6b93d6',
    rotationSpeed: 0.01,
    orbitSpeed: 0.01,
    description: 'Our beautiful blue home planet, the only known world with life',
    texture: 'textures/earth.jpg'
  },
  {
    name: 'Mars',
    distance: 22,
    size: 0.9,
    color: '#cd5c5c',
    rotationSpeed: 0.009,
    orbitSpeed: 0.008,
    description: 'The red planet, a cold desert world with the largest volcano in the solar system',
    texture: 'textures/mars.jpg'
  },
  {
    name: 'Jupiter',
    distance: 30,
    size: 2.0,
    color: '#d8ca9d',
    rotationSpeed: 0.02,
    orbitSpeed: 0.004,
    description: 'The largest planet, a gas giant with over 80 moons including the four Galilean moons',
    texture: 'textures/jupiter.jpg'
  },
  {
    name: 'Saturn',
    distance: 38,
    size: 1.7,
    color: '#fad5a5',
    rotationSpeed: 0.018,
    orbitSpeed: 0.003,
    description: 'The ringed planet, famous for its spectacular ring system made of ice and rock',
    texture: 'textures/saturn.jpg',
    ring: {
      innerRadius: 1.8,
      outerRadius: 2.8,
      color: '#e5d8b0'
    }
  },
  {
    name: 'Uranus',
    distance: 46,
    size: 1.4,
    color: '#4fd0e7',
    rotationSpeed: 0.015,
    orbitSpeed: 0.002,
    description: 'An ice giant that rotates on its side, with faint rings and 27 known moons',
    texture: 'textures/uranus.jpg',
    ring: {
      innerRadius: 1.5,
      outerRadius: 2.0,
      color: '#a0e0f0'
    }
  },
  {
    name: 'Neptune',
    distance: 54,
    size: 1.3,
    color: '#4b70dd',
    rotationSpeed: 0.016,
    orbitSpeed: 0.001,
    description: 'The windiest planet with storms reaching speeds of 2,100 km/h',
    texture: 'textures/neptune.jpg'
  }
];

const PlanetComponent = ({ 
  planet, 
  onPlanetClick,
  isPlaying
}: { 
  planet: Planet; 
  onPlanetClick: (name: string) => void;
  isPlaying: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [selected, setSelected] = useState(false);
  const [hovered, setHovered] = useState(false);

  const texture = planet.texture 
    ? useLoader(THREE.TextureLoader, planet.texture)
    : null;

  useFrame(() => {
    if (!isPlaying) return;
    if (meshRef.current) meshRef.current.rotation.y += planet.rotationSpeed;
    if (orbitRef.current) orbitRef.current.rotation.y += planet.orbitSpeed;
  });

  return (
    <group ref={orbitRef}>
      {/* Orbit ring - made more visible */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[planet.distance - 0.2, planet.distance + 0.2, 128]} />
        <meshStandardMaterial 
          color="#666666" 
          transparent 
          opacity={0.5} 
          side={THREE.DoubleSide}
          emissive="#888888"
          emissiveIntensity={0.5}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
      
      <mesh 
        ref={meshRef}
        position={[planet.distance, 0, 0]}
        onClick={() => {
          onPlanetClick(planet.name);
          setSelected(!selected);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
      >
        <sphereGeometry args={[planet.size, 64, 64]} />
        <meshStandardMaterial 
          map={texture}
          color="#ffffff" // Base color set to white to make textures more visible
          emissive={planet.color}
          emissiveIntensity={0.3}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      {(selected || hovered) && (
        <Text
          position={[planet.distance, planet.size + 1.5, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        >
          {planet.name}
        </Text>
      )}

      {planet.ring && (
        <group position={[planet.distance, 0, 0]} rotation={[Math.PI / 2, 0.2, 0]}>
          <mesh>
            <ringGeometry args={[planet.ring.innerRadius, planet.ring.outerRadius, 64]} />
            <meshStandardMaterial 
              color={planet.ring.color} 
              transparent 
              opacity={0.9} // Increased opacity for better visibility
              side={THREE.DoubleSide}
              roughness={0.5}
              metalness={0.3}
              emissive={planet.ring.color}
              emissiveIntensity={0.5} // Increased emissive intensity
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

interface SolarSystemProps {
  onPlanetClick: (name: string) => void;
}

export const SolarSystem = ({ onPlanetClick }: SolarSystemProps) => {
  const sunRef = useRef<THREE.Mesh>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const sunTexture = useLoader(THREE.TextureLoader, 'textures/sun.jpg');

  useFrame(() => {
    if (!isPlaying) return;
    if (sunRef.current) sunRef.current.rotation.y += 0.005;
  });

  return (
    <Suspense fallback={null}>
      {/* Brighter background for better planet visibility */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <color attach="background" args={['#111111']} />
      
      {/* Increased lighting intensity */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={5} color="#ff6600" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />
      <pointLight position={[0, 10, 10]} intensity={1} color="#ffffff" />
      
      {showControls && (
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          minDistance={5}
          maxDistance={100}
        />
      )}

      {/* UI Controls */}
      <group position={[-10, 10, 0]}>
        <Text
          position={[0, -1, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          onClick={() => setIsPlaying(!isPlaying)}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
          
        </Text>
        <Text
          position={[0, -2, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          onClick={() => setShowControls(!showControls)}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          {showControls ? 'Hide Controls' : 'Show Controls'}
        </Text>
      </group>

      {/* Sun - made brighter */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial 
          map={sunTexture}
          emissive="#ff6600"
          emissiveIntensity={2} // Increased emissive intensity
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Sun corona effect - made more visible */}
      <group position={[0, 0, 0]}>
        <mesh>
          <sphereGeometry args={[3.5, 32, 32]} />
          <meshStandardMaterial 
            color="#ffaa00" 
            transparent 
            opacity={0.5} // Increased opacity
            emissive="#ff6600"
            emissiveIntensity={1} // Increased intensity
            side={THREE.BackSide}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[4.5, 32, 32]} />
          <meshStandardMaterial 
            color="#ff8800" 
            transparent 
            opacity={0.3} // Increased opacity
            emissive="#ff4400"
            emissiveIntensity={0.8} // Increased intensity
            side={THREE.BackSide}
          />
        </mesh>
      </group>

      {/* Planets */}
      {planets.map((planet) => (
        <PlanetComponent
          key={planet.name}
          planet={planet}
          onPlanetClick={onPlanetClick}
          isPlaying={isPlaying}
        />
      ))}

      {/* Title */}
      <Text
        position={[0, 15, 0]}
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#000000"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      >
        Solar System Explorer
      </Text>
      
      {/* Instructions */}
      <Text
        position={[0, -15, 0]}
        fontSize={0.6}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
        maxWidth={20}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
      >
        Click on planets to learn more about them
        {"\n"}
        Use mouse to rotate, scroll to zoom
      </Text>
    </Suspense>
  );
};