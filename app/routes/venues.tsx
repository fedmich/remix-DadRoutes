// routes/venues.tsx
import { LoaderFunction, json } from "@remix-run/node";
import { connectAndQuery } from "~/lib/db";
import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import VenuesMap from "~/components/VenuesMap";

type Venue = {
    id: number;
    name: string;
    slug: string;
    latitude: number;
    longitude: number;
    description: string;
    star_rating: number;
    picture: string;
    photos: string;
    address: string;
    created_at: string;
    updated_at: string;
    marker_type?: string;
};

type LoaderData = {
    venues: Venue[];
    googleMapsApiKey: string;
};

export const loader: LoaderFunction = async ({ request }) => {
    const lat = 41.57006;
    const lng = -93.6466;
    const radius = 10; // Radius in km

    const query = `
    SELECT *, (
      6371 * acos(
        cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) +
        sin(radians($1)) * sin(radians(latitude))
      )
    ) AS distance
    FROM venues
    WHERE (
      6371 * acos(
        cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) +
        sin(radians($1)) * sin(radians(latitude))
      )
    ) <= $3
    ORDER BY distance
    LIMIT 20;
  `;
    const result = await connectAndQuery(query, [lat, lng, radius]);

    return json({
        venues: result.rows,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    });
};

export default function VenuesPage() {
    const { venues, googleMapsApiKey } = useLoaderData<LoaderData>();
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

    const handleVenueClick = (venue: Venue) => {
        setSelectedVenue(venue);
        // Optionally, you could center the map on the selected venue
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '300px', padding: '10px', overflowY: 'scroll' }}>
                <h2>Venues List</h2>
                {venues.map((venue) => (
                    <div key={venue.id} onClick={() => handleVenueClick(venue)} style={{ cursor: 'pointer', marginBottom: '10px', padding: '5px', border: '1px solid #ccc' }}>
                        <h3>{venue.name}</h3>
                        <p>{venue.address}</p>
                        <p>{venue.description}</p>
                        <p>Rating: {venue.star_rating}</p>
                    </div>
                ))}
            </div>
            <VenuesMap initialVenues={venues.map((venue) => ({
                ...venue,
                latitude: parseFloat(venue.latitude), // Convert to float
                longitude: parseFloat(venue.longitude), // Convert to float
            }))} googleMapsApiKey={googleMapsApiKey} />
        </div>
    );
}
