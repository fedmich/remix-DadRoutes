// routes/logout.tsx
import { LoaderFunction, redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/lib/session";

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    return redirect("/", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
};

export default function Logout() {
    return null;
}
