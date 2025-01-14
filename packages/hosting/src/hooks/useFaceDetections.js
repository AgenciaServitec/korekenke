import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

export const useFaceDetection = (videoRef) => {
  const [detections, setDetections] = useState([]);
  const [biometricVectors, setBiometricVectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny-face-detector"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models/face-landmark-68"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models/face-recognition"),
      ]);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar los modelos:", err);
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const detectFacesInVideo = async () => {
    if (
      videoRef.current &&
      !videoRef.current.paused &&
      !videoRef.current.ended
    ) {
      try {
        const videoElement = videoRef.current;
        const options = new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.5,
        });
        const detections = await faceapi
          .detectAllFaces(videoElement, options)
          .withFaceLandmarks()
          .withFaceDescriptors();

        const faceDescriptors = detections.map((d) => d.descriptor);

        setDetections(detections);
        setBiometricVectors(faceDescriptors);

        const canvas = document.getElementById("overlay");
        if (canvas) {
          const displaySize = {
            width: videoElement.videoWidth,
            height: videoElement.videoHeight,
          };
          faceapi.matchDimensions(canvas, displaySize);
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize,
          );
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }
      } catch (err) {
        console.error("Error al detectar rostros en video:", err);
        setError(err);
      }
    }
  };

  useEffect(() => {
    const loadAndDetect = async () => {
      try {
        await loadModels();
        intervalRef.current = setInterval(detectFacesInVideo, 300);
      } catch (err) {
        console.error("Error al cargar modelos y comenzar detección:", err);
      }
    };

    loadAndDetect();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [videoRef]);

  return {
    detections,
    biometricVectors,
    loading,
    error,
  };
};
