import React, { useEffect, useRef } from "react";
import {
  Circle,
  GoogleMap,
  LoadScriptNext,
  Marker,
} from "@react-google-maps/api";
import { WorkPlaces } from "../../data-list";
import { currentConfig } from "../../config";

const libraries = ["geometry"];

const mapStyle = {
  width: "100%",
  height: "100%",
};

const geofenceOptions = {
  fillColor: "rgb(0,132,185)",
  fillOpacity: 0.2,
  strokeColor: "rgb(1,48,79)",
  strokeOpacity: 0.9,
  strokeWeight: 2,
};

export const MapComponent = ({
  user,
  center = null,
  zoom = 18,
  geofence,
  userLocation,
  onGeofenceValidate,
  radius = 50,
}) => {
  const workPlace = getWorkPlaceById(user?.workPlace);

  const mapCenter = workPlace?.coordinates ||
    center || { lat: -12.169543, lng: -77.021059 };

  const geofenceRadius = workPlace?.workPlaceRadius || radius;

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
        userLocation?.lat,
        userLocation?.lng,
      );

      // eslint-disable-next-line no-undef
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        geofenceCenter,
        userPosition,
      );

      onGeofenceValidate(distance <= geofenceRadius);
    }
  };

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.panTo(userLocation);
    }
    userValidate();
  }, [userLocation]);

  return (
    <LoadScriptNext
      googleMapsApiKey={currentConfig?.apiMaps?.apiKey}
      libraries={libraries}
    >
      <GoogleMap
        mapContainerStyle={mapStyle}
        zoom={zoom}
        options={{
          disableDefaultUI: true,
        }}
        onLoad={(map) => {
          mapRef.current = map;
          if (userLocation) {
            map.panTo(userLocation);
          }
        }}
      >
        {isValidLocation(userLocation) && (
          <Marker
            position={userLocation}
            title={"Tu ubicación"}
            animation={window.google?.maps.Animation?.BOUNCE}
          />
        )}

        {geofence && (
          <Circle
            center={mapCenter}
            radius={geofenceRadius}
            options={geofenceOptions}
          />
        )}
      </GoogleMap>
    </LoadScriptNext>
  );
};

const getWorkPlaceById = (workPlaceId) => {
  return WorkPlaces.find((place) => place.value === workPlaceId) || null;
};

const isValidLocation = (location) =>
  location && !isNaN(location.lat) && !isNaN(location.lng);
