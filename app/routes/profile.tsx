// /routes/profile.tsx
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useActionData } from "@remix-run/react";
import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { getSession } from "~/lib/session";
import { connectAndQuery } from "~/lib/db";
import LoggedInLayout from "~/components/LoggedInLayout";
import type { User } from "~/types";

// Loader to fetch user data and handle redirection if not logged in
export const loader: LoaderFunction = async ({ request }) => {
    //   const userId = getUserIdFromSession(request); // Implement this function based on your session setup

    const session = await getSession(request.headers.get("Cookie"));

    // Check if userId is in the session
    const authId = session.get("authId");

    if (!authId) {
        // Redirect to sign-in if user is not authenticated
        return redirect("/sign-in?1");
    }
    const result_user = await connectAndQuery('SELECT id, first_name, last_name, occupation, about_bio, email, picture  FROM users WHERE google_sub = $1', [authId]);

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
        return redirect("/sign-in?3");
    }

    return json({ user_info });
};

// Action to handle form submission and update the database
export const action: ActionFunction = async ({ request }) => {

    const formData = await request.formData();
    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;
    const occupation = formData.get("occupation") as string;
    const aboutBio = formData.get("about_bio") as string;

    const session = await getSession(request.headers.get("Cookie"));

    // Check if userId is in the session
    const authId = session.get("authId");

    if (!authId) {
        // Redirect to sign-in if user is not authenticated
        return redirect("/sign-in?1");
    }
    const result_user = await connectAndQuery('SELECT id, first_name, last_name, occupation, about_bio, email, picture  FROM users WHERE google_sub = $1', [authId]);

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


    await connectAndQuery(
        `UPDATE users SET first_name = $1, last_name = $2, occupation = $3, about_bio = $4 WHERE id = $5`,
        [firstName, lastName, occupation, aboutBio, userId]
    );

    return redirect("/dashboard");
};

// Profile Page Component
export default function Profile() {
    const { user_info } = useLoaderData<{ user_info: User }>();
    const user = user_info;

    return (
        <LoggedInLayout user={user_info}>
            <h1>Edit Profile</h1>
            <div style={{ maxWidth: "600px", margin: "auto" }}>
                {/* Avatar Section */}
                <div style={{ display: "flex", alignItems: "center", flexDirection: "column", marginBottom: "1.5rem" }}>
                    {user_info.picture ? (
                        <img
                            src={user_info.picture}
                            alt="User Avatar"
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginBottom: "1rem",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                backgroundColor: "#e0e0e0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2rem",
                                color: "#9e9e9e",
                                marginBottom: "1rem",
                            }}
                        >
                            ?
                        </div>
                    )}
                    <button
                        type="button"
                        style={{
                            backgroundColor: "#007BFF",
                            color: "#FFF",
                            padding: "0.5rem 1rem",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginBottom: "1.5rem",
                        }}
                        // Placeholder for upload functionality
                        onClick={() => alert("Upload feature coming soon!")}
                    >
                        Upload Image
                    </button>
                </div>

                {/* Profile Form */}
                <Form method="post" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            defaultValue={user_info.first_name}
                            required
                            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            defaultValue={user_info.last_name}
                            required
                            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>Occupation</label>
                        <input
                            type="text"
                            name="occupation"
                            defaultValue={user_info.occupation}
                            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>About Bio</label>
                        <textarea
                            name="about_bio"
                            defaultValue={user_info.about_bio}
                            rows={4}
                            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
                        ></textarea>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>Email</label>
                        <input
                            type="text"
                            value={user_info.email}
                            readOnly
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                borderRadius: "4px",
                                border: "1px solid #ddd",
                                backgroundColor: "#f9f9f9",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: "0.75rem 1.5rem",
                            backgroundColor: "#007BFF",
                            color: "#FFF",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            alignSelf: "flex-start",
                        }}
                    >
                        Save Profile
                    </button>
                </Form>
            </div>
        </LoggedInLayout>
    );
}
