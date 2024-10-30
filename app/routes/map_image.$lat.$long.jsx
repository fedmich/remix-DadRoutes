// app/routes/map_image.$lat.$long.jsx
import { json, useLoaderData } from "@remix-run/react";

export async function loader({ params }) {
    const { lat, long } = params;

    if (!lat || !long) {
        throw new Response("Latitude and longitude are required", { status: 400 });
    }

    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${long}&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${long}&key=${googleMapsApiKey}`;

    return json({ mapImageUrl });
}

export default function MapImage() {
    const { mapImageUrl } = useLoaderData();

    return (
        <div>
            <h1>Static Map Image</h1>
            <img src={mapImageUrl} alt="Static map of coordinates" />
        </div>
    );
}
