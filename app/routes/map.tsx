// app/routes/map.tsx
import { useEffect, useState } from 'react';
import { LoaderFunction, json } from "@remix-run/node";
import { connectAndQuery } from '~/lib/db';
import Layout from '~/components/Layout';
import MapComponent from '~/components/MapComponent';

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';

    // Fetch routes based on search query
    const routes = await connectAndQuery(
        `
      SELECT id, name, latitude, longitude
      FROM routes
      WHERE active = true AND name ILIKE $1
    `,
        [`%${query}%`]
    );

    // Fetch the API key from environment variables
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!googleMapsApiKey) {
        throw new Error("Google Maps API key is not defined in environment variables.");
    }

    return json({ routes: routes.rows, googleMapsApiKey });
};

const MapPage = () => {
    const [routes, setRoutes] = useState([]);
    const [viewport, setViewport] = useState({
        latitude: 37.7749, // Default latitude (adjust as needed)
        longitude: -122.4194, // Default longitude (adjust as needed)
        zoom: 10, // Default zoom level
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [apiKey, setApiKey] = useState('');

    // Fetch routes from the loader
    useEffect(() => {
        const fetchRoutes = async () => {
            const response = await fetch(`/map?q=${searchQuery}`);
            const data = await response.json();
            setRoutes(data.routes);
            if (data.googleMapsApiKey) {
                setApiKey(data.googleMapsApiKey);
            }
            // If there are routes, set the first route as the map center
            if (data.routes.length > 0) {
                setViewport({
                    latitude: data.routes[0].latitude,
                    longitude: data.routes[0].longitude,
                    zoom: 10, // Adjust zoom as needed
                });
            }
        };

        fetchRoutes();
    }, [searchQuery]);

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formElements = event.currentTarget.elements as typeof event.currentTarget.elements & {
            search: { value: string }; // Assert that `search` is a string input
        };

        setSearchQuery(formElements.search.value); // Access search input value safely
    };

    return (
        <Layout>
            <div style={{ display: 'flex' }}>
                {/* Left Sidebar for Filters */}
                <aside style={{ width: '250px', padding: '20px' }}>
                    <h2>Filters</h2>
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            name="search"
                            placeholder="Search routes by name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>

                    {/* Additional filters */}
                    <div className="filters">
                        <label>
                            Distance:
                            <input type="number" name="distance" placeholder="km" />
                        </label>
                        <label>
                            Number of Stops:
                            <input type="number" name="numStops" />
                        </label>
                        <label>
                            Number of Kids:
                            <input type="number" name="numKids" />
                        </label>
                        <label>
                            Difficulty:
                            <select name="difficulty">
                                <option value=""></option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </label>
                    </div>
                </aside>

                {/* Right Side for Map */}
                <div style={{ flex: 1, height: '500px' }}>
                    <MapComponent
                        routes={routes}
                        viewport={viewport}
                        setViewport={setViewport}
                        apiKey={apiKey} // Pass the API key here
                    />
                </div>
            </div>
        </Layout>
    );
};

export default MapPage;
