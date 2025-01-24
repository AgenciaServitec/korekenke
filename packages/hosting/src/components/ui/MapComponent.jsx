import React, { useEffect, useRef } from "react";
import {
  Circle,
  GoogleMap,
  LoadScriptNext,
  Marker,
} from "@react-google-maps/api";
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

const isValidLocation = (location) =>
  location && !isNaN(location.lat) && !isNaN(location.lng);

export const MapComponent = ({
  center = null,
  markers = [],
  zoom = 18,
  geofence,
  userLocation,
  onGeofenceValidate,
  radius = 50,
}) => {
  const { authUser } = useAuthentication();

  const workPlace = getWorkPlaceById(authUser?.workPlace);

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
    <LoadScriptNext
      googleMapsApiKey="AIzaSyAY2QCPZzFt0DzzRAxIhvY9JB8XkDbX3aU"
      libraries={libraries}
    >
      <GoogleMap
        mapContainerStyle={mapStyle}
        center={userLocation ? userLocation : mapCenter}
        zoom={zoom}
        onLoad={(map) => {
          mapRef.current = map;
          if (userLocation) {
            map.panTo(userLocation);
          }
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title || ""}
            icon={{
              url: "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%23FF6F00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-map-pin'><path d='M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z'></path><circle cx='12' cy='10' r='3'></circle></svg>",
            }}
          />
        ))}

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
