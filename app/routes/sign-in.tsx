// app/routes/sign-in.tsx

import { type LoaderFunctionArgs, json } from "@remix-run/node"; // Import json here
import { useLoaderData } from "@remix-run/react";

import { generateAuthUrl } from "../lib/oauth-providers/google";

export async function loader({ request }: LoaderFunctionArgs) {
  return json({ googleAuthUrl: generateAuthUrl("sign-in") });
}

export default function SignIn() {
  const { googleAuthUrl } = useLoaderData<typeof loader>();

  return (
    <div>
      <a href={googleAuthUrl}>Continue with Google</a>
    </div>
  );
}