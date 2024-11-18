import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import Layout from "~/components/Layout";
import { connectAndQuery } from "~/lib/db";
import { getSession } from "~/lib/session"; // Adjust this import based on your session management
import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js'; // Ensure to install xml2js with npm/yarn

export const loader: LoaderFunction = async ({ request }) => {
  //   const userId = getUserIdFromSession(request); // Implement this function based on your session setup

  const session = await getSession(request.headers.get("Cookie"));

  // Check if userId is in the session
  const authId = session.get("authId");

  if (!authId) {
    // Redirect to sign-in if user is not authenticated
    return redirect("/sign-in");
  }
  const result_user = await connectAndQuery('SELECT * FROM users WHERE google_sub = $1', [authId]);

  // Assign the data from the query result
  const user_infos = result_user.rows; // Assuming result.rows contains the query data

  if (!user_infos) {
    // Redirect to sign-in if user is not authenticated
    return redirect("/sign-in");
  }

  const user_info = user_infos[0];
  const userId = user_info.id;

  if (!userId) {
    // Redirect to sign-in if user is not authenticated
    return redirect("/sign-in");
  }

  return json({ user_info });
};

export default function Upload() {
  const actionData = useActionData();

  return (
    const { user } = useLoaderData();
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form method="post" encType="multipart/form-data" className="p-4">
          <div className="mb-4">
            <label className="block mb-2">Name of route:</label>
            <input
              type="text"
              name="routeName"
              required
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">GPX file:</label>
            <input
              type="file"
              name="gpxFile"
              accept=".gpx"
              required
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Difficulty:</label>
            <select
              name="difficulty"
              className="border rounded px-2 py-1 w-full"
            >
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Difficult">Difficult</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Number of Kids:</label>
            <input
              type="number"
              name="numKids"
              min="0"
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Number of Stops:</label>
            <input
              type="number"
              name="numStops"
              min="0"
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
          >
            Save my route
          </button>
          {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
        </form>
      </div>
    </Layout>
  );
}



export const action = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const authId = session.get("authId"); // Original line commented out for debugging

  const result_user = await connectAndQuery('SELECT * FROM users WHERE google_sub = $1', [authId]);
  const user_info = result_user.rows;

  if (!user_info || user_info.length === 0) {
    return json({ error: "User not authenticated." }, { status: 401 });
  }

  const userId = user_info[0].id;

  // Get the form data directly from the request
  const formData = await request.formData();
  const routeName = formData.get("routeName");
  const gpxFile = formData.get("gpxFile");
  const difficulty = formData.get("difficulty");
  const numKids = formData.get("numKids") ? parseInt(formData.get("numKids")) : null;
  const numStops = formData.get("numStops") ? parseInt(formData.get("numStops")) : null;

/*
  // Check if GPX file is provided
  if (!gpxFile || !(gpxFile instanceof File)) {
    return json({ error: "GPX file is required." }, { status: 400 });
  }
  */

  // Insert the route into the database with default lat/lon as 0
  const result_route = await connectAndQuery(
    `INSERT INTO routes (name, userid, latitude, longitude, difficulty, num_kids, num_stops, url_gpx, created_at, updated_at, active) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), TRUE) RETURNING id`,
    [routeName, userId, 0, 0, difficulty, numKids, numStops, gpxFile.name]
  );

  const routeId = result_route.rows[0].id;

  // Parse the GPX file from the FormData
  const gpxText = await gpxFile.text(); // Get the file contents as text

  // Save the GPX file to the uploaded path if necessary
  try {

    // You can choose to log the GPX file text or do something else with it here
    // console.log(`GPX Data for Route ID ${routeId}:`, gpxText);
    console.log(`GPX Data for Route ID ${routeId}`);

  } catch (error) {
    console.error("Error processing GPX file:", error);
  }

  // Parse the GPX data and insert waypoints
  await parseGpxAndInsertWaypoints(gpxText, routeId);

  // Redirect to the edit route page
  return redirect(`/route/edit/${routeId}`);
};


async function parseGpxAndInsertWaypoints(gpxText, routeId) {
  try {
    const gpxData = await parseStringPromise(gpxText);
    const waypoints = [];
    let firstWaypointLat;
    let firstWaypointLon;

    // Check if there are track points
    if (gpxData.gpx.trk && gpxData.gpx.trk[0] && gpxData.gpx.trk[0].trkseg && gpxData.gpx.trk[0].trkseg[0]) {
      const trackpoints = gpxData.gpx.trk[0].trkseg[0].trkpt;
      for (let i = 0; i < trackpoints.length; i++) {
        const trkpt = trackpoints[i];
        const lat = trkpt.$.lat;
        const lon = trkpt.$.lon;
        const namePoi = trkpt.name ? trkpt.name[0] : `Waypoint`;
        const sourceData = JSON.stringify(trkpt);

        // Capture the first waypoint's coordinates
        if (i === 0) {
          firstWaypointLat = lat;
          firstWaypointLon = lon;
        }

        waypoints.push({ routeId, lat, lon, namePoi, sourceData });
      }
    } else {
      console.warn("No track points found in GPX data.");
    }

    // Check if there are waypoints
    if (gpxData.gpx.wpt) {
      const waypointsData = gpxData.gpx.wpt;
      for (const wpt of waypointsData) {
        const lat = wpt.$.lat;
        const lon = wpt.$.lon;
        const namePoi = wpt.name ? wpt.name[0] : `Waypoint`;
        const sourceData = JSON.stringify(wpt);

        waypoints.push({ routeId, lat, lon, namePoi, sourceData });

        // Capture the first waypoint's coordinates if not already set
        if (!firstWaypointLat && !firstWaypointLon) {
          firstWaypointLat = lat;
          firstWaypointLon = lon;
        }
      }
    }

    // Log waypoints for debugging
    console.log("Waypoints to be inserted:", waypoints);

    // Insert waypoints into the database
    for (const waypoint of waypoints) {
      await connectAndQuery(
        `INSERT INTO waypoints (route_id, latitude, longitude, name_poi, source_data, created_at, updated_at, active) 
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), TRUE)`,
        [waypoint.routeId, waypoint.lat, waypoint.lon, waypoint.namePoi, waypoint.sourceData]
      );
    }

    // If waypoints were inserted, update the route with the first waypoint's coordinates
    if (firstWaypointLat && firstWaypointLon) {
      await connectAndQuery(
        `UPDATE routes SET latitude = $1, longitude = $2 WHERE id = $3`,
        [firstWaypointLat, firstWaypointLon, routeId]
      );
    }
  } catch (error) {
    console.error("Error parsing GPX:", error);
  }
}