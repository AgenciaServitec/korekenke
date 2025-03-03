import { useEffect, useState, useCallback, useRef } from "react";

export const useFingerprint = (onSamplesReceived) => {
  const [sdk, setSdk] = useState(null);
  const [device, setDevice] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const retryIntervalRef = useRef(null);

  const checkDevices = useCallback(async (sdkInstance) => {
    try {
      const devices = await sdkInstance.onDeviceConnected();
      if (devices && devices.length > 0) {
        setDevice(devices[0]);
        setIsReady(true);
        clearInterval(retryIntervalRef.current);
      } else {
        setRetryCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error checking devices:", error);
      setRetryCount((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    if (!window.Fingerprint) {
      console.error("SDK de huellas no encontrado");
      return;
    }

    const sdkInstance = new window.Fingerprint.WebApi();
    setSdk(sdkInstance);

    retryIntervalRef.current = setInterval(() => {
      checkDevices(sdkInstance);
    }, 2000);

    checkDevices(sdkInstance);

    sdkInstance.onDeviceConnected = (deviceInfo) => {
      clearInterval(retryIntervalRef.current);
      setDevice(deviceInfo);
      setIsReady(true);
    };

    sdkInstance.onDeviceDisconnected = () => {
      setDevice(null);
      setIsReady(false);
      if (!retryIntervalRef.current) {
        retryIntervalRef.current = setInterval(() => {
          checkDevices(sdkInstance);
        }, 2000);
      }
    };

    sdkInstance.onCommunicationFailed = (error) => {
      console.error("Fallo en la comunicación con el SDK:", error);
    };

    sdkInstance.onSamplesAcquired = (data) => {
      try {
        let samplesRaw = data.samples;
        if (!samplesRaw) {
          console.error("No se recibieron muestras");
          return;
        }
        if (typeof samplesRaw === "string") {
          samplesRaw = samplesRaw.trim();
          if (samplesRaw === "") {
            console.error("La cadena de muestras está vacía");
            return;
          }
          const parsedSamples = JSON.parse(samplesRaw);
          if (Array.isArray(parsedSamples) && parsedSamples.length > 0) {
            const template = parsedSamples[0].Data;
            if (!template || template.trim() === "") {
              console.error("La plantilla está vacía");
              return;
            }
            if (onSamplesReceived) {
              onSamplesReceived(template);
            }
          } else {
            console.error(
              "No hay muestras válidas en el arreglo",
              parsedSamples,
            );
          }
        } else if (Array.isArray(samplesRaw)) {
          if (samplesRaw.length > 0) {
            const template = samplesRaw[0].Data;
            if (onSamplesReceived) {
              onSamplesReceived(template);
            }
          } else {
            console.error("La lista de muestras está vacía");
          }
        } else {
          console.error("Formato desconocido para 'samples':", samplesRaw);
        }
      } catch (error) {
        console.error("Error al procesar la muestra:", error);
      }
    };

    setSdk(sdkInstance);

    return () => {
      clearInterval(retryIntervalRef.current);
      if (sdkInstance && sdkInstance.stopAcquisition) {
        sdkInstance.stopAcquisition();
      }
    };
  }, [checkDevices]);

  const startCapture = useCallback(
    async (format = window.Fingerprint.SampleFormat.Intermediate) => {
      if (!sdk) {
        throw new Error("SDK no inicializado");
      }
      await sdk.startAcquisition(format);
    },
    [sdk],
  );

  const disconnect = useCallback(async () => {
    if (sdk && sdk.stopAcquisition) {
      await sdk.stopAcquisition();
      console.log("Captura detenida y dispositivo desconectado.");
    }
  }, [sdk]);

  return { device, isReady, startCapture, disconnect };
};
