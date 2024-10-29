// routes/$id.tsx

import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { connectAndQuery } from '~/lib/db';
// import GoogleMap from '~/components/GoogleMap';
import GoogleMapWithWaypoints from '~/components/GoogleMapWithWaypoints';


import Layout from "~/components/Layout";


// Define the TypeScript types for the data

type Route = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  difficulty: string;
  num_stops: number;
};


type Waypoint = {
  id: number;
  name_poi: string;
  latitude: number;
  longitude: number;
  // add other fields as needed
};

type LoaderData = {
  route: Route;
  waypoints: Waypoint[];
  googleMapsApiKey?: string; // Optional in case it's undefined
};

export let loader: LoaderFunction = async ({ params }) => {
  const routeId = params.id;

  if (!routeId) {
    throw new Response("Route ID not provided", { status: 404 });
  }

  const routeQuery = `
    SELECT * FROM routes 
    WHERE id = $1
  `;
  const waypointsQuery = `
    SELECT * FROM waypoints 
    WHERE route_id = $1
  `;

  const routeResult = await connectAndQuery(routeQuery, [parseInt(routeId!)]);
  const waypointsResult = await connectAndQuery(waypointsQuery, [parseInt(routeId!)]);

  if (!routeResult.rows.length) throw new Response("Route not found", { status: 404 });

  // Fetch the API key from environment variables
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  return json<LoaderData>({
    route: routeResult.rows[0],
    waypoints: waypointsResult.rows,
    googleMapsApiKey
  });
};

const RouteDetail = () => {
  const { route, waypoints, googleMapsApiKey } = useLoaderData<LoaderData>();

  // const mapCenter = { lat: route.latitude, lng: route.longitude };

  // Ensure route.latitude and route.longitude are converted to numbers
  const mapCenter = {
    lat: parseFloat(route.latitude as unknown as string) || 0,
    lng: parseFloat(route.longitude as unknown as string) || 0,
  };

  // Convert each waypoint's latitude and longitude to numbers
  const numericWaypoints = waypoints.map((waypoint) => ({
    ...waypoint,
    latitude: parseFloat(waypoint.latitude as unknown as string),
    longitude: parseFloat(waypoint.longitude as unknown as string),
  }));


  return (

    <Layout>
      <div>
        <h2>{route.name}</h2>
        <p>Difficulty: {route.difficulty}</p>
        <p>Number of Stops: {route.num_stops}</p>
        <h2>Waypoints</h2>
        <ul>
          {waypoints.map(waypoint => (
            <li key={waypoint.id}>{waypoint.name_poi}</li>
          ))}
        </ul>



        <div>
          <h1>{route.name}</h1>
          <GoogleMapWithWaypoints waypoints={numericWaypoints} center={mapCenter} googleMapsApiKey={googleMapsApiKey} />
        </div>

      </div>
    </Layout>

  );
};

export default RouteDetail;
