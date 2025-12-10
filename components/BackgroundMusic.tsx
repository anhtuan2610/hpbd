"use client";

import { useEffect, useRef, useState } from "react";
import ElasticSlider from "./ElasticSlider";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const trackRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [volume, setVolume] = useState(70); // 0 - 100

  // Initialize Web Audio API khi audio element sẵn sàng
  useEffect(() => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      // Tạo AudioContext (sẽ bị suspended cho đến khi có user interaction)
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      // Tạo MediaElementSource từ audio element
      const track = audioContext.createMediaElementSource(audioRef.current);
      trackRef.current = track;

      // Tạo GainNode để điều khiển volume
      const gainNode = audioContext.createGain();
      gainNodeRef.current = gainNode;

      // Kết nối: source -> gainNode -> destination
      track.connect(gainNode).connect(audioContext.destination);

      // Set volume ban đầu
      gainNode.gain.value = volume / 100;

    } catch (error) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resume AudioContext khi có user interaction (yêu cầu của browser)
  const resumeAudioContext = async () => {
    if (audioContextRef.current?.state === "suspended") {
      try {
        await audioContextRef.current.resume();
      } catch (error) {
      }
    }
  };

  // Sync volume to gainNode (hoạt động trên cả desktop và mobile)
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100;
    }
  }, [volume]);

  // Auto play background music
  useEffect(() => {
    const playAudio = async () => {
      if (!audioRef.current) return;

      // Resume AudioContext nếu bị suspended
      await resumeAudioContext();

      try {
        await audioRef.current.play();
      } catch (error) {
      }
    };

    // Try to play immediately
    playAudio();

    // Also try to play on any user interaction (click, touch, keypress)
    const handleFirstInteraction = async () => {
      await resumeAudioContext();
      if (audioRef.current && audioRef.current.paused) {
        try {
          await audioRef.current.play();
        } catch (error) {
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

  // Cleanup: đóng AudioContext khi component unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current
          .close()
          .then(() => {})
          .catch(() => {});
      }
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="/spring-day.m4a"
        loop
        preload="auto"
        className="hidden"
        onLoadedData={() => {}}
        onError={() => {}}
        onPlay={() => {}}
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
