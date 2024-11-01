// components/VenuesMap.tsx
import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type Venue = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    marker_type?: string;
};

type VenuesMapProps = {
    initialVenues: Venue[];
    googleMapsApiKey: string;
};

export default function VenuesMap({ initialVenues, googleMapsApiKey }: VenuesMapProps) {
    const [venues, setVenues] = useState<Venue[]>(initialVenues);

    console.log(initialVenues); // Check if venues are passed correctly

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "600px" }}
                center={{ lat: 41.57006, lng: -93.6466 }}
                zoom={10}
            >
                {initialVenues.map((venue) => (
                    <Marker
                        key={venue.id}
                        position={{ lat: venue.latitude, lng: venue.longitude }}
                        title={venue.name}
                    />
                ))}
            </GoogleMap>
        </LoadScript>
    );

}
