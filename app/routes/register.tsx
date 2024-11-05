// app/routes/register.tsx
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { generateAuthUrl } from "../lib/oauth-providers/google";
import { Layout } from "~/root";

export async function loader({ request }: LoaderFunctionArgs) {
  // Put "register" in the state so we know where the user is 
  // coming from when they are sent back to us from Google.
  return json({ googleAuthUrl: generateAuthUrl("register") });
}

export default function Register() {
  const { googleAuthUrl } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="container mx-auto mt-16 overflow-hidden flex flex-col lg:flex-row items-center justify-center p-4 lg:p-16">

        {/* Left Side - Features */}
        <div className="flex-1 flex flex-col justify-center mb-10 lg:mb-0 lg:pr-10 text-center lg:text-left">
          <h2 className="text-4xl font-bold mb-4">Why Join Us?</h2>
          <ul className="text-lg space-y-2">
            <li>✓ Find and explore new bike routes.</li>
            <li>✓ Save your favorite rides.</li>
            <li>✓ Connect with other cycling enthusiasts.</li>
            <li>✓ Share your routes with friends and family.</li>
            <li>✓ Access exclusive members-only features.</li>
          </ul>
        </div>

        {/* Right Side - Sign-In Form */}
        <div className="flex-1 flex flex-col items-center">
          <h1 className="text-4xl font-semibold mb-6">Sign in to continue</h1>
          <p className="text-lg mb-6">Use the 1-click sign-up button below to get started.</p>

          <div className="w-full max-w-md">
            {/* Google Button */}
            <a
              href={googleAuthUrl}
              className="flex items-center justify-center w-full px-6 py-4 bg-white border border-gray-300 shadow-md rounded-lg hover:shadow-lg hover:bg-gray-100 transition duration-150"
              style={{ color: "#4285F4" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.35 11.1h-9.4v2.83h5.9c-.25 1.53-1.02 2.83-2.16 3.68v3.05h3.5c2.05-1.9 3.2-4.7 3.2-7.7 0-.63-.05-1.25-.14-1.86z" fill="#4285F4" />
                <path d="M12.1 20.25c2.4 0 4.4-.8 5.88-2.17l-2.8-2.16c-.8.54-1.8.88-3.08.88-2.37 0-4.4-1.6-5.12-3.82H3.42v2.38c1.5 2.98 4.6 5.1 8.68 5.1z" fill="#34A853" />
                <path d="M6.98 12.97c-.2-.63-.32-1.3-.32-1.97s.12-1.34.32-1.97V7.65H3.42c-.74 1.3-1.16 2.78-1.16 4.35 0 1.57.42 3.05 1.16 4.35l3.56-2.38z" fill="#FBBC05" />
                <path d="M12.1 5.68c1.3 0 2.4.45 3.28 1.32l2.46-2.45C16.5 3.2 14.5 2.3 12.1 2.3 7.98 2.3 4.88 4.42 3.42 7.65l3.56 2.38c.72-2.23 2.75-3.85 5.12-3.85z" fill="#EA4335" />
              </svg>
              Continue with Google
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}