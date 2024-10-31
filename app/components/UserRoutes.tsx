// /app/components/UserRoutes.tsx
import React, { useEffect, useState } from 'react';
import { connectAndQuery } from '~/lib/db';
import type { Route } from '~/types';
import '~/styles/main.css'; // Import CSS file for styling

type UserRoutesProps = {
  routes: Route[];
};

const UserRoutes: React.FC<UserRoutesProps> = ({ routes }) => {
  return (
    <div>

      {routes.length > 0 ? (
        <div>

          <h3>My Routes</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Route Name</th>
                <th>Difficulty</th>
                <th>Stops</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map(route => (
                <tr key={route.id}>
                  <td>{route.name}</td>
                  <td>{route.difficulty}</td>
                  <td>{route.num_stops}</td>
                  <td>
                    <a href={`/routes/${route.id}`}>View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>This user hasn't uploaded any routes yet.</p>
      )}


    </div>

  );
};

export default UserRoutes;
