// routes/venues.tsx
import { LoaderFunction, json } from "@remix-run/node";
import { connectAndQuery } from "~/lib/db";
import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";;
import Layout from "~/components/Layout";
import VenuesMap from "~/components/VenuesMap";
import { getMarkerIcon } from '~/utils/getMarkerIcon'; // Import the utility function

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


export const meta: MetaFunction = () => [
    { title: "Venues - Dad Routes" },
    // { name: "description", content: "Discover the best routes and tips for family adventures." },
    // { name: "keywords", content: "family, travel, routes, adventures, Dad Routes" },
  ];

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

const VenuesPage = () => {
    const { venues, googleMapsApiKey } = useLoaderData<LoaderData>();
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

    // Determine the initial map center based on the venues data
    const initialCenter = venues.length > 0
        ? { lat: venues[0].latitude, lng: venues[0].longitude }
        : { lat: 41.57006, lng: -93.6466 };

    const [mapCenter, setMapCenter] = useState(initialCenter);

    const handleMarkerClick = (venue: Venue) => {
        setMapCenter({ lat: venue.latitude, lng: venue.longitude }); // Center map on marker
    };

    const handleListItemClick = (venue: Venue) => {
        setMapCenter({ lat: venue.latitude, lng: venue.longitude }); // Center map on venue
    };

    const handleVenueClick = (venue: Venue) => {
        setSelectedVenue(venue);
        // Optionally, you could center the map on the selected venue
    };

    return (

        <Layout>
            <h2>Venues List</h2>
            <div style={{ display: "flex", height: "80vh" }}> {/* Adjust height here */}
                <div style={{ width: "300px", overflowY: "auto", maxHeight: "100%", border: "1px solid #ddd" }}>
                    {venues.map((venue) => (
                        <div key={venue.id} onClick={() => handleListItemClick(venue)} style={{ cursor: "pointer", padding: "10px", border: "1px solid #ddd", marginBottom: "5px" }}>
                            <h4>{venue.name}</h4>
                            {venue.picture && <img src={getMarkerIcon(venue.picture)} alt={venue.name} style={{ width: '50px', height: 'auto' }} />}
                            <div>
                                {venue.star_rating ? '⭐'.repeat(Math.round(venue.star_rating)) : 'No rating'}
                            </div>
			    
			    
                        <p>{venue.address}</p>
                        <p>{venue.description}</p>
                        <p>Rating: {venue.star_rating}</p>
			
                        </div>
                    ))}
                </div>
                <VenuesMap
                    initialVenues={venues.map((venue) => ({
                        ...venue,
                        latitude: parseFloat(venue.latitude),
                        longitude: parseFloat(venue.longitude),
                    }))}
                    googleMapsApiKey={googleMapsApiKey}
                    onMarkerClick={handleMarkerClick} // Pass down marker click handler
                    center={mapCenter} // Add a center prop for the map
                />
            </div>
        </Layout>
    );
};

export default VenuesPage;
