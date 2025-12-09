"use client";

import { useEffect, useRef, useState } from "react";
import ElasticSlider from "./ElasticSlider";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(70); // 0 - 100

  // Sync volume to audio element whenever volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Auto play background music
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = volume / 100;
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
  }, [volume]);

  return (
    <>
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

      {/* Dùng ElasticSlider để điều khiển âm lượng, dọc bên trái */}
      <div className="fixed left-3 lg:left-10 top-1/2 z-50 -translate-y-1/2">
        <ElasticSlider
          defaultValue={volume}
          startingValue={0}
          maxValue={100}
          isStepped
          stepSize={1}
          onChange={(val) => setVolume(Math.round(val))}
        />
      </div>
    </>
  );
}
