// app/routes/users.tsx
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { connectAndQuery } from '~/lib/db';

import Layout from "~/components/Layout";


// Loader function to fetch users
export let loader: LoaderFunction = async () => {
  // Query to fetch random 25 users
  const queryText = 'SELECT * FROM users ORDER BY RANDOM() LIMIT 25';
  const result = await connectAndQuery(queryText);
  return json(result.rows);
};

// Component to display the users
export default function Users() {
  const users = useLoaderData();

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Users</h2> {/* Added heading */}


      <div className="grid grid-cols-3 gap-4 p-4">
        {users.map((user) => (
          <div key={user.id} className="border rounded-lg p-4 shadow-lg">
            <h2 className="font-bold text-lg">{user.first_name} {user.last_name}</h2>
            <p className="text-sm">{user.about_bio}</p>
            <a href={`/users/${user.id}`} className="text-blue-500 hover:underline">
              View Profile
            </a>
          </div>
        ))}
      </div>
    </Layout>
  );
}
