// /app/components/UserRoutes.tsx
import React, { useEffect, useState } from 'react';
import { connectAndQuery } from '~/lib/db';
import type { Route } from '~/types';
import '~/styles/main.css'; // Import CSS file for styling
import { Link } from 'react-router-dom';

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
                <th>#</th>
                <th>Route Name</th>
                <th>Difficulty</th>
                <th>Stops</th>
                <th>Kids</th>
                <th colSpan={2}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route, index) => (
                // waypoints.map((waypoint, index) =>
                <tr key={route.id}>
                  <td>{index +1}</td>
                  <td>
                    {route.name}
                    {route.description && 
                      <>
                      <p className="routeDescription">
                      {route.description}
                      </p>
                        
                      </>
                    }

                  </td>
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
        </div>
      ) : (
        <p>This user hasn't uploaded any routes yet.</p>
      )}


    </div>

  );
};

export default UserRoutes;
