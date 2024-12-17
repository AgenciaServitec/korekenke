import React, { useEffect } from "react";
import { Circle, GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapStyle = {
  width: "100%",
  height: "400px",
};

const mapCenter = {
  lat: -12.169445,
  lng: -77.021013,
};

const otherCenter = {
  lat: -12.175648,
  lng: -77.020647,
};

const geofenceOptions = {
  fillColor: "#2699e3",
  fillOpacity: 0.2,
  strokeColor: "rgba(0,81,255,0.5)",
  strokeOpacity: 0.6,
  strokeWeight: 2,
};

export const MapComponent = ({
  center = mapCenter,
  markers = [],
  zoom = 18,
  geofence,
  userLocation,
  onGeofenceValidate,
}) => {
  const userValidate = () => {
    if (!userLocation) return;

    if (window.google && window.google.maps && window.google.maps.geometry) {
      // eslint-disable-next-line no-undef
      const geofenceCenter = new google.maps.LatLng(center.lat, center.lng);
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
    userValidate();
  }, [userLocation]);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAY2QCPZzFt0DzzRAxIhvY9JB8XkDbX3aU"
      libraries={["geometry"]}
    >
      <GoogleMap
        mapContainerStyle={mapStyle}
        center={center}
        zoom={zoom}
        onLoad={userValidate}
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
          <Circle center={center} radius={50} options={geofenceOptions} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};
