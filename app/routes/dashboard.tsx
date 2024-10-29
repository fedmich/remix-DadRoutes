// app/routes/dashboard.tsx
import { json, redirect, LoaderFunction } from "@remix-run/node";
import { getSession } from "~/lib/session"; // Import your session management
import { useLoaderData } from "@remix-run/react"; // Import useLoaderData for component

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));

    // Check if userId is in the session
    const userId = session.get("userId");

    if (!userId) {
        // Redirect to sign-in if user is not authenticated
        return redirect("/sign-in");
    }

    // Return userId for rendering
    return json({ userId });
};

export default function Dashboard() {
    // This will be populated with the loader's return value
    const data = useLoaderData<{ userId: string }>();

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Current User ID: {data.userId}</p>
        </div>
    );
}
