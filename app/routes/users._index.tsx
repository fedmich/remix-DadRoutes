// app/routes/users.tsx
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { connectAndQuery } from '~/lib/db';

import Layout from "~/components/Layout";


export const meta: MetaFunction = () => [
  { title: "Users - Dad Routes" },
  // { name: "description", content: "Discover the best routes and tips for family adventures." },
  // { name: "keywords", content: "family, travel, routes, adventures, Dad Routes" },
];

// Loader function to fetch users
export let loader: LoaderFunction = async () => {
  // Query to fetch random 25 users
  const queryText = 'SELECT * FROM users WHERE active = TRUE ORDER BY num_routes < 1, followers desc, following desc LIMIT 25';
  const result = await connectAndQuery(queryText);
  return json(result.rows);
};

// Component to display the users
export default function Users() {
  const users = useLoaderData();

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="border rounded-lg p-4 shadow-lg flex flex-col items-center text-center">
              {/* Display profile picture if available */}
              {user.picture ? (
                <img src={user.picture} alt={`${user.first_name} ${user.last_name}`} className="w-24 h-24 rounded-full mb-3 object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full mb-3 bg-gray-300 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-500">N/A</span>
                </div>
              )}
              <h3 className="font-bold text-lg">{user.first_name} {user.last_name}</h3>
              <p className="text-sm text-gray-700">{user.about_bio}</p>
              <div className="text-sm text-gray-600 mt-2">
                <span>{user.num_routes} Routes</span>
                | <span>{user.followers} Followers</span>
                | <span>{user.following} Following</span>
              </div>
              <a href={`/users/${user.id}`} className="text-blue-500 hover:underline mt-2">
                View Profile
              </a>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
