// app/routes/google-callback.tsx
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getTokenFromCode } from "../lib/oauth-providers/google";
import { connectDB, query, disconnectDB } from "../lib/db";
import { getSession, commitSession } from "../lib/session"; // Import the session functions

export async function loader({ request }: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!state || !code) {
        return redirect("/");
    }

    let idToken;
    try {
        idToken = await getTokenFromCode(code);
    } catch (error) {
        console.error("Error getting token from code:", error);
        return redirect("/error");
    }

    await connectDB();

    let user;
    try {
        const res = await query('SELECT * FROM users WHERE google_sub = $1', [idToken.sub]);
        user = res.rows[0];
    } catch (error) {
        console.error("Error querying database:", error);
        await disconnectDB();
        return redirect("/error");
    }

    const firstName = idToken.given_name || "";
    const lastName = idToken.family_name || "";
    const userInfoJson = JSON.stringify(idToken);

    const session = await getSession(request.headers.get("Cookie"));

    if (state === "register") {
        if (user) {
            await disconnectDB();
            return redirect("/sign-in");
        } else {
            try {
                await query(
                    'INSERT INTO users (google_sub, first_name, last_name, userinfo) VALUES ($1, $2, $3, $4)',
                    [idToken.sub, firstName, lastName, userInfoJson]
                );
                session.set("userId", idToken.sub); // Store user info in the session
                await disconnectDB();
                return redirect('/dashboard', {
                    headers: {
                        "Set-Cookie": await commitSession(session), // Set the cookie
                    },
                });
            } catch (error) {
                console.error("Error creating new user:", error);
                await disconnectDB();
                return redirect("/error");
            }
        }
    }

    if (state === "sign-in") {
        if (!user) {
            await disconnectDB();
            return redirect("/register");
        }
        session.set("userId", user.google_sub); // Store user info in the session
        await disconnectDB();
        return redirect('/dashboard', {
            headers: {
                "Set-Cookie": await commitSession(session), // Set the cookie
            },
        });
    }

    await disconnectDB();
    return redirect('/');
}

export default function GoogleCallback() {
    return (
        <div>
            <h1>Google Callback</h1>
        </div>
    );
}
