// app/routes/dashboard.tsx
import { getSession } from "~/lib/session"; // Import your session management

import { LoaderFunction, json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import LoggedInLayout from "~/components/LoggedInLayout";
// import Layout from "~/components/Layout";
import { connectAndQuery } from "~/lib/db";
import type { Route, User } from "~/types";

import '~/styles/main.css'; // Import CSS file for styling
import { Link } from 'react-router-dom';

export const meta: MetaFunction = () => [
    { title: "Dashboard - Dad Routes" },
    // { name: "description", content: "Discover the best routes and tips for family adventures." },
    // { name: "keywords", content: "family, travel, routes, adventures, Dad Routes" },
];

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
    const user_infos = result_user.rows; // Assuming result.rows contains the query data

    if (!user_infos) {
        // Redirect to sign-in if user is not authenticated
        return redirect("/sign-in?2");
    }

    const user_info = user_infos[0];
    const userId = user_info.id;

    if (!userId) {
        // Redirect to sign-in if user is not authenticated
        return redirect("/sign-in");
    }

    // Query to retrieve routes associated with the user ID
    const result = await connectAndQuery('SELECT * FROM routes WHERE userid = $1', [userId]);

    // Assign the data from the query result
    const routes = result.rows; // Assuming result.rows contains the query data

    return json({ routes, user_info });
};

export default function Dashboard() {
    const { routes, user_info } = useLoaderData<{ routes: Route[], user_info: User }>();

    return (
        <LoggedInLayout user={user_info}>
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
                            <td>

                                <Link to={`/routes/${route.id}`}>
                                    {route.name}
                                </Link>
                            </td>
                            <td>{route.difficulty}</td>
                            <td>{route.num_stops}</td>
                            <td>{route.num_kids}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => window.location.href = "/upload"}>Upload GPX File</button>
                <button onClick={() => window.location.href = "/new"}>Start a New Map</button>
            </div>
        </LoggedInLayout>
    );
}
