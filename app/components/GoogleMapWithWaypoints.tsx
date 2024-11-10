// components/GoogleMapWithWaypoints.tsx
import { GoogleMap, LoadScript, MarkerF, InfoWindowF, PolylineF } from "@react-google-maps/api";
import React, { useState } from "react";

type Waypoint = {
  id: number;
  name_poi: string;
  latitude: number;
  longitude: number;
  description: string;
};

type GoogleMapWithWaypointsProps = {
  waypoints: Waypoint[];
  center: { lat: number; lng: number };
  googleMapsApiKey?: string;
};

const GoogleMapWithWaypoints: React.FC<GoogleMapWithWaypointsProps> = ({ waypoints, center, googleMapsApiKey }) => {
  if (!googleMapsApiKey) {
    return <p>Google Maps API key is not available.</p>;
  }

  const [activeMarker, setActiveMarker] = useState<number | null>(null);


  // Define marker icons
  const defaultIcon = "https://res.cloudinary.com/dzhlavugc/image/upload/c_pad,w_50,h_50/v1731213768/bike_dzjp0m.png";
  const startIcon = "https://res.cloudinary.com/dzhlavugc/image/upload/c_pad,h_50/v1730994327/9978f02d-ae0a-4693-996d-9f8a950d2302.png";
  const endIcon = "https://res.cloudinary.com/dzhlavugc/image/upload/c_pad,h_50/v1730948335/f0193587-03c5-4db9-8cc0-de5ab08ae54e.png";
  console.log("Received center coordinates:", center);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        center={center}
        zoom={13}
        mapContainerStyle={{ width: "100%", height: "100vh" }}
      >
        {waypoints.map((waypoint, index) => (

          <MarkerF
            key={waypoint.id}
            position={{ lat: waypoint.latitude, lng: waypoint.longitude }}
            icon={
              index === 0
                ? startIcon
                : index === waypoints.length - 1
                  ? endIcon
                  : defaultIcon
            }
            onMouseOver={() => setActiveMarker(waypoint.id)}
            onMouseOut={() => setActiveMarker(null)}
          >
            {activeMarker === waypoint.id && (
              <InfoWindowF
                position={{ lat: waypoint.latitude, lng: waypoint.longitude }}>
                <div style={{ fontSize: "14px" }}>
                  <b>{waypoint?.name_poi}</b>
                  <br />
                  <small>{waypoint?.description}</small>
                </div>
              </InfoWindowF>
            )}
          </MarkerF>

        ))}
        <PolylineF
          path={waypoints.map((waypoint) => ({
            lat: waypoint.latitude,
            lng: waypoint.longitude,
          }))}
          options={{ strokeColor: "#05C653", strokeWeight: 2 }}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapWithWaypoints;
