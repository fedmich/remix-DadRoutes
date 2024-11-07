import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react"; // Correct import for the hook

import { connectAndQuery } from '~/lib/db';
import Layout from '~/components/Layout';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import '~/styles/main.css';
import '~/search.css'; // Import CSS file for styling

interface Route {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  difficulty: string;
  num_stops: number;
  num_kids: number;
  user: string; // User name from the users table
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';

  const result = await connectAndQuery(
    `SELECT routes.*, users.first_name || ' ' || users.last_name AS user 
     FROM routes 
     LEFT JOIN users ON routes.userid = users.id 
     WHERE routes.name ILIKE $1 AND routes.active = true`,
    [`%${query}%`]
  );

  return json({ routes: result.rows, query }); // Return routes and query
};

export default function Search() {
  const { routes, query } = useLoaderData<{ routes: Route[]; query: string }>(); // Destructure routes and query
  const [sortOrder, setSortOrder] = useState<{ [key: string]: boolean }>({});

  const handleSort = (key: keyof Route) => {
    const order = sortOrder[key] ? 'asc' : 'desc';
    setSortOrder({ [key]: !sortOrder[key] });
    routes.sort((a, b) => {
      if (order === 'asc') return a[key] < b[key] ? -1 : 1;
      return a[key] > b[key] ? -1 : 1;
    });
  };

  return (
    <Layout>
      <h1>Search Routes</h1>
      <h2>Searching for: {query}</h2>
      <form method="get" action="/search">
        <input
          type="text"
          name="q"
          placeholder="Search routes..."
          defaultValue={query} // Prefill search textbox
        />
        <button type="submit">Search</button>
      </form>
      <table className="styled-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('user')}>User</th>
            <th onClick={() => handleSort('difficulty')}>Difficulty</th>
            <th onClick={() => handleSort('num_stops')}>Stops</th>
            <th onClick={() => handleSort('num_kids')}>Kids</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id}>
              <td>
                <Link to={`/routes/${route.id}`}>{route.name}</Link>
              </td>
              <td>{route.user}</td>
              <td>{route.difficulty}</td>
              <td>{route.num_stops}</td>
              <td>{route.num_kids}</td>
              <td>
                <Link to={`/routes/${route.id}`}>
                  <button className="view-button">View</button>
                </Link>
              </td>
              <td>
                <Link to={`/download/gpx/${route.id}`}>
                  <button className="download-button ">Download</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
