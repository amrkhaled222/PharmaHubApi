"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Spinner from "../ui/Spinner";

const MapWithDraggableMarker = ({
  onChange,
  value = {
    lat: 30.0444, // Default latitude (Cairo, Egypt) in case Geolocation fails
    lng: 31.2357, // Default longitude
  },
}) => {
  const [location, setLocation] = useState(value);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get user's location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          onChange((prev) => {
            return {
              ...prev,
              Latitude: position.coords.latitude,
              Longitude: position.coords.longitude,
            };
          }); // Call onChange with the new location
          setIsLoaded(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoaded(true); // Allow the map to load even if Geolocation fails
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoaded(true); // Allow the map to load even if Geolocation is not available
    }
  }, []);

  const handleDragEnd = (e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    setLocation({ lat: newLat, lng: newLng });
    onChange((prev) => {
      return {
        ...prev,
        Latitude: newLat,
        Longitude: newLng,
      };
    }); // Call onChange with the new location
    console.log("New location:", newLat, newLng); // Log new location
  };

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  return (
    <div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={15}
        >
          <Marker
            position={location}
            draggable={true}
            onDragEnd={handleDragEnd}
          />
        </GoogleMap>
      ) : (
        <Spinner size="200"></Spinner>
      )}
    </div>
  );
};

export default MapWithDraggableMarker;
