import { useEffect, useState } from "react";

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
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
      );
    } else {
      setLocationError("Geolocalización no soportada");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return {
    userLocation,
    locationError,
  };
};
