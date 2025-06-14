import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Play, Pause } from 'lucide-react';

interface VoiceNarratorProps {
  selectedPlanet: string | null;
}

const planetNarrations = {
  Mercury: `Did you know Mercury completes a full orbit around the Sun in just 88 Earth days? That means a year on Mercury is shorter than three months on Earth! But here's the twist - a single day on Mercury lasts 59 Earth days. This tiny planet has the most extreme temperature swings in the solar system, from 800°F during the day to -290°F at night. Mercury is also shrinking - scientists estimate it's contracted about 9 miles in diameter over billions of years as its core cools.`,

  Venus: `Venus is truly bizarre! It rotates backwards compared to most planets, meaning the Sun rises in the west and sets in the east. A day on Venus (243 Earth days) is longer than its year (225 Earth days). The atmospheric pressure is crushing - 90 times Earth's - equivalent to being 3,000 feet underwater. Its thick clouds of sulfuric acid create a runaway greenhouse effect, making it the hottest planet at 900°F, even hotter than Mercury despite being farther from the Sun.`,

  Earth: `Our home planet Earth rotates at 1,000 mph at the equator, completing a full spin every 23 hours and 56 minutes. But we orbit the Sun at a staggering 67,000 mph! Earth is the only known planet with liquid water on its surface and the only one with active plate tectonics. The Moon stabilizes our tilt, creating stable seasons. Interestingly, Earth isn't perfectly round - it bulges at the equator due to its rotation, making the diameter 26 miles wider at the equator than pole-to-pole.`,

  Mars: `Mars has the tallest volcano in the solar system - Olympus Mons stands 16 miles high, three times taller than Mount Everest! A Martian day is almost identical to Earth's at 24.6 hours, but a year lasts 687 Earth days. The planet's red color comes from iron oxide (rust) in its soil. Mars has seasons like Earth, but they're twice as long. During winter, up to 30% of the atmosphere freezes into dry ice at the poles. Scientists believe Mars once had rivers and lakes billions of years ago.`,

  Jupiter: `Jupiter is a monster! It's so massive that it could swallow all other planets combined. The Great Red Spot is a storm bigger than Earth that's raged for at least 400 years. Jupiter spins incredibly fast - a day lasts just 10 hours, causing it to bulge at the equator. It has 95 known moons, including Europa which may have a subsurface ocean with more water than Earth's oceans combined. Jupiter's powerful magnetic field is 20,000 times stronger than Earth's, creating spectacular auroras at its poles.`,

  Saturn: `Saturn is the lightest planet - it would float in water if you could find a bathtub big enough! Its spectacular rings are made of billions of ice chunks, some as small as dust and others as big as mountains. The rings stretch 175,000 miles across but are only about 30 feet thick. A day on Saturn is just 10.7 hours, but it takes 29 Earth years to orbit the Sun. Saturn's moon Titan has lakes of liquid methane and an atmosphere thicker than Earth's, making it a prime target in the search for extraterrestrial life.`,

  Uranus: `Uranus rolls around the Sun on its side with a 98-degree tilt, making its seasons extreme - each pole gets 42 years of continuous sunlight followed by 42 years of darkness. It's the coldest planet with atmospheric temperatures of -370°F. Uranus has 13 faint rings and 27 moons named after Shakespeare characters. A day lasts 17 hours, but a year equals 84 Earth years. The planet's blue-green color comes from methane in its atmosphere absorbing red light. Uranus was the first planet discovered with a telescope in 1781.`,

  Neptune: `Neptune has the strongest winds in the solar system - they whip around at 1,300 mph, faster than the speed of sound on Earth! Despite being the farthest planet, it has an internal heat source radiating 2.6 times more energy than it receives from the Sun. A year on Neptune lasts 165 Earth years - it's only completed one orbit since its discovery in 1846. The moon Triton orbits backwards and is gradually spiraling inward, destined to be torn apart by Neptune's gravity in about 100 million years. Neptune's vivid blue color comes from methane absorbing red light.`
};

export const VoiceNarrator = ({ selectedPlanet }: VoiceNarratorProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [showNarration, setShowNarration] = useState(true);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentNarrationRef = useRef<string>('');

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find(v => v.name.includes('Google UK English Male')) ||
        voices.find(v => v.lang.includes('en-US')) ||
        voices[0];
      setVoice(preferredVoice || null);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      stopNarration();
    };
  }, []);

  useEffect(() => {
    if (selectedPlanet) {
      const narration = planetNarrations[selectedPlanet as keyof typeof planetNarrations];
      currentNarrationRef.current = narration;
      stopNarration();
      playNarration(narration);
    }
  }, [selectedPlanet]);

  const playNarration = (text: string) => {
    if (!voice || !text) return;

    stopNarration();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
    utteranceRef.current = utterance;
  };

  const stopNarration = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    utteranceRef.current = null;
  };

  const togglePlayPause = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else if (selectedPlanet) {
      playNarration(currentNarrationRef.current);
    }
  };

  const toggleNarrationVisibility = () => {
    setShowNarration(!showNarration);
  };

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-50">
      {selectedPlanet && (
        <div className="flex gap-2">
          <Button
            onClick={togglePlayPause}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
            size="sm"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>

          <Button
            onClick={toggleNarrationVisibility}
            className="bg-gray-600 hover:bg-gray-700 text-white"
            aria-label="Toggle narration visibility"
            size="sm"
          >
            {showNarration ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
      )}

      {selectedPlanet && showNarration && (
        <div className="bg-black/80 text-white p-4 rounded-lg max-w-md backdrop-blur-sm mt-2">
          <h3 className="font-bold text-lg">{selectedPlanet}</h3>
          <p className="text-sm mt-1">
            {planetNarrations[selectedPlanet as keyof typeof planetNarrations]}
          </p>
        </div>
      )}
    </div>
  );
};
