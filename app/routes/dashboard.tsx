// app/routes/dashboard.tsx
import { getSession } from "~/lib/session"; // Import your session management

import { LoaderFunction, json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Layout from "~/components/Layout";
import { connectAndQuery } from "~/lib/db";
import type { Route } from "~/types";

import '~/styles/main.css'; // Import CSS file for styling

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));

    // Check if userId is in the session
    const authId = session.get("authId");

    if (!authId) {
        // Redirect to sign-in if user is not authenticated
        return redirect("/sign-in");
    }
    const result_user = await connectAndQuery('SELECT * FROM users WHERE google_sub = $1', [authId]);

    // Assign the data from the query result
    const user_info = result_user.rows; // Assuming result.rows contains the query data

    if (!user_info) {
        // Redirect to sign-in if user is not authenticated
        return redirect("/sign-in?2");
    }

    const userId = user_info[0].id;

    if (!userId) {
        // Redirect to sign-in if user is not authenticated
        return redirect("/sign-in");
    }

    // Query to retrieve routes associated with the user ID
    const result = await connectAndQuery('SELECT * FROM routes WHERE userid = $1', [userId]);

    // Assign the data from the query result
    const routes = result.rows; // Assuming result.rows contains the query data

    return json({ routes });
};

export default function Dashboard() {
    const { routes } = useLoaderData<{ routes: Route[] }>();

    return (
        <Layout>
            <h1>My Routes</h1>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Difficulty</th>
                        <th>Number of Stops</th>
                        <th>Number of Kids</th>
                    </tr>
                </thead>
                <tbody>
                    {routes.map(route => (
                        <tr key={route.id}>
                            <td>{route.name}</td>
                            <td>{route.difficulty}</td>
                            <td>{route.num_stops}</td>
                            <td>{route.num_kids}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => window.location.href = "/upload"}>Upload GPX File</button>
                <button onClick={() => window.location.href = "/new-map"}>Start a New Map</button>
            </div>
        </Layout>
    );
}
