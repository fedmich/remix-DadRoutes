// /app/routes/user/$id.tsx

import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { connectAndQuery } from "~/lib/db";
import type { User, Route } from "~/types"; // Assume you've defined types

import Layout from "~/components/Layout";

type LoaderData = {
    user: User;
    routeCount: number;
};

export const loader: LoaderFunction = async ({ params }) => {
    const userId = params.id;
    if (!userId) {
        throw new Error("User ID is required.");
    }

    //   await connectDB(); // Ensure connection

    // Fetch user data
    const userRes = await connectAndQuery("SELECT * FROM users WHERE id = $1", [userId]);
    const user = userRes.rows[0];

    // Fetch count of routes using 'userid'
    const routeCountRes = await connectAndQuery("SELECT COUNT(*) FROM routes WHERE userid = $1", [userId]);
    const routeCount = parseInt(routeCountRes.rows[0].count, 10);

    return json({ user, routeCount });
};

export default function UserProfile() {
    const { user, routeCount } = useLoaderData<LoaderData>();

    return (

        <Layout>

            {/* Breadcrumb Navigation */}
            <nav>
                <Link to="/users">Users</Link> &gt; <h2 style={{ display: 'inline', marginLeft: '8px' }}>{user.first_name}</h2>
            </nav>


            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
                {/* Cover Photo */}
                <div
                    style={{
                        width: "100%",
                        height: "200px",
                        backgroundColor: "#ddd",
                        position: "relative",
                        borderRadius: "8px",
                    }}
                >
                    <div
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            position: "absolute",
                            left: "20px",
                            bottom: "-75px",
                            border: "5px solid #fff",
                            backgroundColor: "#fff",
                        }}
                    >
                        <img
                            src={user.userinfo?.avatarUrl || "/default-avatar.jpg"} // replace with actual image source
                            alt={`${user.first_name}'s avatar`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                </div>

                {/* User Info */}
                <div style={{ paddingTop: "80px" }}>
                    <h1>{user.first_name}</h1>
                    {user.occupation && <p>{user.occupation}</p>}
                    {user.about_bio && <p>{user.about_bio}</p>}
                    <p>Total Bike Routes: {routeCount}</p>

                    {/* Social Links */}
                    <div style={{ marginTop: "20px" }}>
                        {user.website && (
                            <p>
                                <a href={user.website} target="_blank" rel="noopener noreferrer">
                                    Website
                                </a>
                            </p>
                        )}
                        {user.twitter && (
                            <p>
                                <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer">
                                    Twitter
                                </a>
                            </p>
                        )}
                        {user.youtube && (
                            <p>
                                <a href={`https://youtube.com/${user.youtube}`} target="_blank" rel="noopener noreferrer">
                                    YouTube
                                </a>
                            </p>
                        )}
                        {user.instagram && (
                            <p>
                                <a href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer">
                                    Instagram
                                </a>
                            </p>
                        )}
                        {user.linkedin && (
                            <p>
                                <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer">
                                    LinkedIn
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            </div>

        </Layout>
    );
}
