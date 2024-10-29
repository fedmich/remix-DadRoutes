// app/routes/google-callback.tsx
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";

import { getTokenFromCode } from "../lib/oauth-providers/google";

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!state || !code) {
    return redirect("/")
  }
  const idToken = await getTokenFromCode(code)

  const user = await db.users.find.where({ google_sub: idToken.sub })

  if (state === "register" && user) {
    return redirect("/sign-in")
  }

  if (state === "register") {
    const newUser = await db.insert.users({ google_sub: idToken.sub })
    await createSession(newUser)
    return redirect('/dashboard')
  }

  if (state === "sign-in" && !user) {
    return redirect("/register")
  }

  if (state === "sign-in") {
    await createSession(user)
    return redirect('/dashboard')
  }

  return redirect('/')
}

export default function GoogleCallback() {
  return (
    <div>
      <h1>GoogleCallback</h1>
    </div>
  );
}
