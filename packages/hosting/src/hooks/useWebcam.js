import { useState, useEffect, useRef } from "react";

export const useWebcam = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const setupStream = (stream) => {
      streamRef.current = stream;
      if (videoRef.current instanceof HTMLVideoElement) {
        videoRef.current.srcObject = stream;
      }
    };

    const handleError = (err) => {
      console.error("Error al acceder a la cámara:", err);
      setError(err);
      setHasPermission(false);
    };

    const startCamera = async () => {
      if (streamRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (isMounted) {
          setupStream(stream);
          setHasPermission(true);
          setError(null);
        }
      } catch (err) {
        if (isMounted) handleError(err);
      }
    };

    (async () => {
      await startCamera();
    })();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return {
    videoRef,
    hasPermission,
    error,
  };
};
