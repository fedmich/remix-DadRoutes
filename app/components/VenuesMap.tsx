import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type VenuesMapProps = {
    initialVenues: Venue[];
    googleMapsApiKey: string;
};

export default function VenuesMap({ initialVenues, googleMapsApiKey }: VenuesMapProps) {
    const [venues, setVenues] = useState(initialVenues);

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "600px" }}
                center={{ lat: 41.57006, lng: -93.6466 }}
                zoom={10}
            >
                {venues.map((venue) => (
                    <Marker
                        key={venue.id}
                        position={{ lat: venue.latitude, lng: venue.longitude }}
                        icon={venue.marker_type ? `/path/to/marker/${venue.marker_type}.png` : undefined}
                        title={venue.name}
                    />
                ))}
            </GoogleMap>
        </LoadScript>
    );
}
