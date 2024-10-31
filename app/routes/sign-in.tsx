// app/routes/sign-in.tsx

import { type LoaderFunctionArgs, json } from "@remix-run/node"; // Import json here
import { useLoaderData } from "@remix-run/react";

import { generateAuthUrl } from "../lib/oauth-providers/google";

import Layout from '~/components/Layout';

export async function loader({ request }: LoaderFunctionArgs) {
  return json({ googleAuthUrl: generateAuthUrl("sign-in") });
}

export default function SignIn() {
  const { googleAuthUrl } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <h1>Sign in to continue.</h1>
      <p>Use the 1 click sign up button below to continue.</p>

      <div>
        <div className="g-signin2" data-width="300" data-height="200" data-longtitle="true">
          <a href={googleAuthUrl}>Continue with Google</a>
        </div>

      </div>

    </Layout>

  );

}