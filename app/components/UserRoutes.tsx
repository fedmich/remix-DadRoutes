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
    <div className='mt-8'>

      {routes.length > 0 ? (
        <div>
          <h3 className="mt-4 text-xl font-bold text-gray-800">My Routes</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th className="hidden md:table-cell">#</th>
                <th className="hidden sm:table-cell">Route Name</th>
                <th className="hidden sm:table-cell">Difficulty</th>
                <th className="hidden md:table-cell">Stops</th>
                <th className="hidden md:table-cell">Kids</th>
                <th className="hidden md:table-cell" colSpan={2}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route, index) => (
                // waypoints.map((waypoint, index) =>
                <tr key={route.id}>
                  <td className="hidden md:table-cell">{index + 1}</td>
                  <td className="hidden sm:table-cell">
                    <Link to={`/routes/${route.id}`}>
                      {route.name}
                    </Link>
                    {route.description &&
                      <>
                        <p className="routeDescription">
                          {route.description}
                        </p>

                      </>
                    }

                  </td>
                  <td className="hidden md:table-cell">{route.difficulty}</td>
                  <td className="hidden md:table-cell">{route.num_stops}</td>
                  <td className="hidden md:table-cell">{route.num_kids}</td>
                  <td className="hidden md:table-cell">

                    <Link to={`/routes/${route.id}`}>
                      <button className="view-button">View</button>
                    </Link>
                  </td>
                  <td className="hidden md:table-cell">
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
        <div>
          <h3 className="mt-4 text-xl font-bold text-gray-800">My Routes</h3>
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
              <tr>
                <td colSpan="7">
                  <p>This user hasn't uploaded any routes yet.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>

  );
};

export default UserRoutes;
