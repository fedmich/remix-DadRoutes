// app/routes/login.tsx
import { json, redirect, LoaderFunction } from "@remix-run/node";
import { getSession, commitSession } from "~/lib/session";


export const loader: LoaderFunction = async ({ request }) => {
    const formData = new URLSearchParams(await request.text());
    const idToken = { sub: formData.get("idToken") }; // Replace with actual token retrieval logic

    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", idToken.sub); // Store user info in the session

    return redirect("/dashboard", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
};
