// /app/components/UserRoutes.tsx
import React, { useEffect, useState } from 'react';
import { connectAndQuery } from '~/lib/db';
import type { Route } from '~/types';

type UserRoutesProps = {
  userId: number;
};

const UserRoutes: React.FC<UserRoutesProps> = ({ userId }) => {
  const [routes, setRoutes] = useState<Route[]>([]);

  // Fetch routes function
  const fetchRoutes = async () => {
    console.log("Fetching routes for userId:", userId); // Check if this log appears
    try {
      const res = await connectAndQuery(
        "SELECT id, name, latitude, longitude FROM routes WHERE userid = $1 AND active = true",
        [userId]
      );
      console.log("Fetched Routes:", res.rows); // Check what data is fetched
      setRoutes(res.rows);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  // Use effect to fetch routes on mount
  useEffect(() => {
    fetchRoutes();
  }, [userId]);

  // Refresh button handler
  const handleRefresh = () => {
    console.log('handleRefresh')
    fetchRoutes(); // Call fetchRoutes again
  };

  return (
    <div>
      <div>
        <button onClick={handleRefresh}>Refresh</button> {/* Refresh button */}
      </div>
      {routes.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(route => (
              <tr key={route.id}>
                <td>{route.name}</td>
                <td>{route.latitude}</td>
                <td>{route.longitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>This user hasn't uploaded any routes yet.</p>
      )}
    </div>
  );
};

export default UserRoutes;
