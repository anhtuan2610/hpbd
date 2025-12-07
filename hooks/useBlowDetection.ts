"use client";

import { useEffect, useRef, useState } from "react";

export function useBlowDetection(
  onBlowDetected: () => void,
  threshold: number = 0.5, // Ngưỡng âm lượng để phát hiện thổi
  sensitivity: number = 0.7 // Độ nhạy (0-1)
) {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<
    "prompt" | "granted" | "denied" | "unknown"
  >("unknown");
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const lastBlowTimeRef = useRef<number>(0);
  const BLOW_COOLDOWN = 500; // Cooldown 500ms để tránh spam

  const startListening = async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log("🎤 Đang yêu cầu quyền truy cập microphone...");

      // Kiểm tra secure context (HTTPS hoặc localhost)
      const isSecureContext =
        location.protocol === "https:" ||
        location.hostname === "localhost" ||
        location.hostname === "127.0.0.1" ||
        location.hostname === "[::1]";

      if (!isSecureContext) {
        // Khi truy cập qua IP network (192.168.x.x), không phải secure context
        // Trình duyệt sẽ không cho phép truy cập microphone
        throw new Error(
          `Microphone yêu cầu HTTPS hoặc localhost để hoạt động.\n\nBạn đang truy cập qua: ${location.protocol}//${location.hostname}\n\nGiải pháp:\n1. Truy cập qua localhost: http://localhost:3000\n2. Hoặc dùng HTTPS (khi deploy)\n3. Hoặc cấu hình HTTPS cho local development`
        );
      }

      // Kiểm tra xem trình duyệt có hỗ trợ getUserMedia không
      // Hỗ trợ cả API mới (mediaDevices.getUserMedia) và API cũ (navigator.getUserMedia)
      const nav = navigator as any;
      const getUserMedia =
        navigator.mediaDevices?.getUserMedia ||
        nav.getUserMedia ||
        nav.webkitGetUserMedia ||
        nav.mozGetUserMedia;

      if (!getUserMedia) {
        throw new Error(
          "Trình duyệt không hỗ trợ microphone. Vui lòng dùng Chrome, Firefox hoặc Safari."
        );
      }

      // Yêu cầu quyền truy cập microphone
      let stream: MediaStream;

      if (navigator.mediaDevices?.getUserMedia) {
        // Sử dụng API mới
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });
      } else {
        // Fallback cho API cũ
        stream = await new Promise<MediaStream>((resolve, reject) => {
          const oldGetUserMedia =
            (navigator as any).getUserMedia ||
            (navigator as any).webkitGetUserMedia ||
            (navigator as any).mozGetUserMedia;

          oldGetUserMedia.call(navigator, { audio: true }, resolve, reject);
        });
      }

      streamRef.current = stream;
      setHasPermission(true);
      setIsListening(true);
      setIsLoading(false);
      setError(null);
      console.log("✅ Đã có quyền truy cập microphone");

      // Tạo AudioContext
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Tạo AnalyserNode để phân tích audio
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; // Kích thước FFT (Fast Fourier Transform)
      analyser.smoothingTimeConstant = 0.3;
      analyserRef.current = analyser;

      // Kết nối microphone với analyser
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      microphoneRef.current = microphone;

      // Tạo mảng để lưu dữ liệu audio
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      dataArrayRef.current = dataArray as any;

      console.log("🎧 Bắt đầu phân tích audio...");

      // Hàm phân tích audio liên tục
      const analyze = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);

        // Tính toán tổng năng lượng ở tần số thấp (tiếng thổi thường ở 20-200Hz)
        // Chỉ lấy 10 bin đầu tiên (tần số thấp)
        let sum = 0;
        const lowFreqBins = Math.min(10, dataArrayRef.current.length);
        for (let i = 0; i < lowFreqBins; i++) {
          sum += dataArrayRef.current[i];
        }
        const average = sum / lowFreqBins / 255; // Normalize về 0-1

        // Log giá trị để debug (chỉ log khi có âm thanh)
        if (average > 0.1) {
          console.log(`📊 Audio level: ${(average * 100).toFixed(2)}%`);
        }

        // Phát hiện tiếng thổi: amplitude cao ở tần số thấp
        const now = Date.now();
        if (
          average > threshold * sensitivity &&
          now - lastBlowTimeRef.current > BLOW_COOLDOWN
        ) {
          lastBlowTimeRef.current = now;
          console.log("💨 PHÁT HIỆN TIẾNG THỔI! (Blow detected!)");
          onBlowDetected();
        }

        animationFrameRef.current = requestAnimationFrame(analyze);
      };

      analyze();
    } catch (err: any) {
      console.error("❌ Lỗi khi truy cập microphone:", err);
      setHasPermission(false);
      setIsListening(false);
      setIsLoading(false);

      // Xử lý các loại lỗi khác nhau
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setPermissionStatus("denied");
        setError(
          "Bạn đã từ chối quyền truy cập microphone. Vui lòng click vào icon 🔒 hoặc 🎤 ở thanh địa chỉ trình duyệt và cho phép microphone, sau đó làm mới trang."
        );
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        setError(
          "Không tìm thấy microphone. Vui lòng kiểm tra thiết bị của bạn."
        );
      } else if (
        err.name === "NotReadableError" ||
        err.name === "TrackStartError"
      ) {
        setError(
          "Microphone đang được sử dụng bởi ứng dụng khác. Vui lòng đóng ứng dụng đó."
        );
      } else {
        setError(err.message || "Lỗi không xác định khi truy cập microphone.");
      }
    }
  };

  const stopListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsListening(false);
    console.log("🛑 Đã dừng nghe microphone");
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return {
    startListening,
    stopListening,
    isListening,
    hasPermission,
    error,
    isLoading,
    permissionStatus,
  };
}
