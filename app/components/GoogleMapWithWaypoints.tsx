// components/GoogleMapWithWaypoints.tsx
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";

type Waypoint = {
  id: number;
  name_poi: string;
  latitude: number;
  longitude: number;
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


  console.log("Received center coordinates:", center);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        center={center}
        zoom={13}
        mapContainerStyle={{ width: "100%", height: "400px" }}
      >
        {waypoints.map((waypoint) => (
          <Marker
            key={waypoint.id}
            position={{ lat: waypoint.latitude, lng: waypoint.longitude }}
            title={waypoint.name_poi}
          />
        ))}
        <Polyline
          path={waypoints.map((waypoint) => ({
            lat: waypoint.latitude,
            lng: waypoint.longitude,
          }))}
          options={{ strokeColor: "#FF0000", strokeWeight: 2 }}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapWithWaypoints;
