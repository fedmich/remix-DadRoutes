// components/VenuesMap.tsx
import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { getMarkerIcon } from '~/utils/getMarkerIcon'; // Import the utility function

type Venue = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    marker_type?: string;

    star_rating?: number; // Add star_rating
    picture?: string; // Add picture if available
};

type VenuesMapProps = {
    initialVenues: Venue[];
    googleMapsApiKey: string;
    onMarkerClick: (venue: Venue) => void; // New prop for handling marker click
};

export default function VenuesMap({ initialVenues, googleMapsApiKey, onMarkerClick }: VenuesMapProps) {
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null); // State for selected venue

    const handleMarkerClick = (venue: Venue) => {
        setSelectedVenue(venue);
        onMarkerClick(venue); // Call the prop function to handle the click
    };

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "600px" }}
                center={{ lat: 41.57006, lng: -93.6466 }}
                zoom={16}
            >
                {initialVenues.map((venue) => (
                    <Marker
                        key={venue.id}
                        position={{ lat: venue.latitude, lng: venue.longitude }}
                        icon={getMarkerIcon(venue.picture)} // Use the utility function here for the marker icon
                        onClick={() => handleMarkerClick(venue)}
                        title={venue.name}
                    />
                ))}

                {selectedVenue && (
                    <InfoWindow
                        position={{ lat: selectedVenue.latitude, lng: selectedVenue.longitude }}
                        onCloseClick={() => setSelectedVenue(null)} // Close the info window
                    >
                        <div>
                            <h3>{selectedVenue.name}</h3>
                            {selectedVenue.picture && <img src={selectedVenue.picture} alt={selectedVenue.name} style={{ width: '100px' }} />}
                            <div>
                                {selectedVenue.star_rating ? '⭐'.repeat(Math.round(selectedVenue.star_rating)) : 'No rating'}
                            </div>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );

}
