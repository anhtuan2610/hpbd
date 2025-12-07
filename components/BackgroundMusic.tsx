"use client";

import { useEffect, useRef } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto play background music
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 0.7; // Set volume to 70%
          await audioRef.current.play();
          console.log("Background music playing successfully");
        } catch (error) {
          console.log(
            "Auto-play was prevented. Will play on first user interaction:",
            error
          );
        }
      }
    };

    // Try to play immediately
    playAudio();

    // Also try to play on any user interaction (click, touch, keypress)
    const handleFirstInteraction = async () => {
      if (audioRef.current && audioRef.current.paused) {
        try {
          await audioRef.current.play();
          console.log("Background music started after user interaction");
        } catch (error) {
          console.error("Failed to play background music:", error);
        }
      }
    };

    // Listen for various user interactions
    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("touchstart", handleFirstInteraction, {
      once: true,
    });
    document.addEventListener("keydown", handleFirstInteraction, {
      once: true,
    });
    document.addEventListener("mousedown", handleFirstInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("mousedown", handleFirstInteraction);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/spring-day.m4a"
      loop
      preload="auto"
      className="hidden"
      onLoadedData={() => {
        console.log("Background music file loaded successfully");
      }}
      onError={(e) => {
        console.error("Error loading background music:", e);
      }}
      onPlay={() => {
        console.log("Background music is playing");
      }}
    />
  );
}
