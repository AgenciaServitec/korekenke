import { useEffect, useState, useRef } from "react";

export const useUserLocation = ({ user }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const watchIdRef = useRef(null);

  const startTracking = () => {
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationError(null);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Permiso denegado para acceder a la ubicación.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("La ubicación no está disponible.");
              break;
            case error.TIMEOUT:
              setLocationError(
                "El tiempo de espera para obtener la ubicación expiró.",
              );
              break;
            default:
              setLocationError(
                "Ocurrió un error desconocido al obtener la ubicación.",
              );
          }
        },
        { enableHighAccuracy: true, maximumAge: 0 },
      );
    } else {
      setLocationError("Geolocalización no soportada");
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  useEffect(() => {
    startTracking();

    return () => {
      stopTracking();
    };
  }, [user]);

  return {
    userLocation,
    locationError,
    startTracking,
    stopTracking,
  };
};
