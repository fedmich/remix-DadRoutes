// routes/routes/$id.tsx
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { connectAndQuery } from '~/lib/db';

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

    const route = await connectAndQuery(routeQuery, [parseInt(routeId)]);
    const waypoints = await connectAndQuery(waypointsQuery, [parseInt(routeId)]);

    if (!route.rows.length) throw new Response("Route not found", { status: 404 });

    return json({ route: route.rows[0], waypoints: waypoints.rows });
};

const RouteDetail = () => {
    const { route, waypoints } = useLoaderData<typeof loader>();

    return (
        <div>
            <h1>{route.name}</h1>
            <p>Difficulty: {route.difficulty}</p>
            <p>Number of Stops: {route.num_stops}</p>
            <h2>Waypoints</h2>
            <ul>
                {waypoints.map(waypoint => (
                    <li key={waypoint.id}>{waypoint.name_poi}</li>
                ))}
            </ul>
        </div>
    );
};

export default RouteDetail;
