// routes/download/gpx.tsx

import { json, LoaderFunction } from "@remix-run/node";
import { connectAndQuery } from "~/lib/db";  // Import database helper
import { generateGPX } from "~/lib/gpx";  // Import GPX generation function

// Loader function to fetch route, generate GPX and download
export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;

  // Fetch the route by id
  const routeQuery = `
    SELECT * FROM routes WHERE id = $1 AND active = true
  `;
  const route = await connectAndQuery(routeQuery, [id]);

  if (!route.rows.length) {
    throw new Response("Route not found or inactive", { status: 404 });
  }

  // Fetch waypoints for the route
  const waypointsQuery = `
    SELECT * FROM waypoints WHERE route_id = $1 AND active = true
  `;
  const waypoints = await connectAndQuery(waypointsQuery, [id]);

  if (!waypoints.rows.length) {
    throw new Response("This route doesnt have any waypoints.", { status: 404 });
  }

  const gpx = generateGPX(route.rows[0], waypoints.rows);

  // return new Response(gpxContent, { status: 200, headers });

  // Send the file as a response
  return new Response(gpx.gpxData, {
    headers: {
      'Content-Type': 'application/gpx+xml',
      'Content-Disposition': `attachment; filename="${gpx.filename}"`,
    },
  });

};
