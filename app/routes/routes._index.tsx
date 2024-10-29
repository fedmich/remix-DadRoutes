import { json, LoaderFunction } from '@remix-run/node'; // Use LoaderFunction from node
import { useLoaderData } from '@remix-run/react';
import { connectAndQuery } from '~/lib/db';
import { Link } from 'react-router-dom';


import Layout from "~/components/Layout";


export let loader: LoaderFunction = async ({ request }: Parameters<LoaderFunction>[0]) => {
  const userId = 4/* Get user ID from session */;

  const routesQuery = `
    SELECT * FROM routes 
    WHERE userid = $1 AND active = true
  `;

  const routes = await connectAndQuery(routesQuery, [userId]);
  return json(routes.rows); // Return rows from the query result
};

// Component to display routes
const RoutesList = () => {
  const routes = useLoaderData<typeof loader>(); // TypeScript-friendly use of loader data

  return (

    <Layout>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map(route => (
            <tr key={route.id}>
              <td>{route.id}</td>
              <td>{route.name}</td>
              <td>{route.latitude}</td>
              <td>{route.longitude}</td>
              <td><Link to={`/routes/${route.id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>

  );
};

export default RoutesList;
