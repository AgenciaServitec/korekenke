import React, {useEffect, useRef} from "react";
import { Circle, GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useAuthentication } from "../../providers";
import { WorkPlaces } from "../../data-list";

const mapStyle = {
  width: "100%",
  height: "100%",
};

const getWorkPlaceById = (workPlaceId) => {
  return WorkPlaces.find((place) => place.value === workPlaceId) || null;
};

const geofenceOptions = {
  fillColor: "#2699e3",
  fillOpacity: 0.2,
  strokeColor: "rgba(0,81,255,0.5)",
  strokeOpacity: 0.6,
  strokeWeight: 2,
};

const libraries = ["geometry"];

const isValidLocation = (location) => location && !isNaN(location.lat) && !isNaN(location.lng);

export const MapComponent = ({
  center = null,
  markers = [],
  zoom = 18,
  geofence,
  userLocation,
  onGeofenceValidate,
}) => {
  const { authUser } = useAuthentication();

  const workPlace = getWorkPlaceById(authUser?.workPlace);

  const mapCenter = center ||
    workPlace?.coordinates || { lat: -12.169543, lng: -77.021059 };

    const mapRef = useRef(null);

    const userValidate = () => {
      if (!isValidLocation(userLocation) || !isValidLocation(mapCenter)) return;

    if (window.google && window.google.maps && window.google.maps.geometry) {
      // eslint-disable-next-line no-undef
      const geofenceCenter = new google.maps.LatLng(
        mapCenter.lat,
        mapCenter.lng,
      );
      // eslint-disable-next-line no-undef
      const userPosition = new google.maps.LatLng(
        userLocation.lat,
        userLocation.lng,
      );

      // eslint-disable-next-line no-undef
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        geofenceCenter,
        userPosition,
      );

      const isWithinGeofence = distance <= 50;
      onGeofenceValidate(isWithinGeofence);
    }
  };

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.panTo(userLocation);
    }
    userValidate();
  }, [userLocation]);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAY2QCPZzFt0DzzRAxIhvY9JB8XkDbX3aU"
      libraries={libraries}
    >
      <GoogleMap
        mapContainerStyle={mapStyle}
        center={userLocation ? userLocation : mapCenter}
        zoom={zoom}
        onLoad={(map) => (mapRef.current = map)}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title || ""}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        ))}

        {geofence && (
          <Circle center={mapCenter} radius={50} options={geofenceOptions} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};
