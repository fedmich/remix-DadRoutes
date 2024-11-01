// routes/venues.tsx
import { LoaderFunction, json } from "@remix-run/node";
import { connectAndQuery } from "~/lib/db";

import VenuesMap from "~/components/VenuesMap";
import { useLoaderData } from "@remix-run/react";

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
    marker_type?: string; // Optional if it exists
};

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get("lat") || "41.57006");
    const lng = parseFloat(url.searchParams.get("lng") || "-93.6466");
    const radius = parseFloat(url.searchParams.get("radius") || "10"); // Radius in km

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
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY // Pass the API key
    });
};


type LoaderData = {
    venues: Venue[];
    googleMapsApiKey: string;
};

export default function VenuesPage() {
    const { venues, googleMapsApiKey } = useLoaderData<LoaderData>();

    return (
        <div>
            <h1>Venues Map</h1>
            <VenuesMap initialVenues={venues} googleMapsApiKey={googleMapsApiKey} />
        </div>
    );
}