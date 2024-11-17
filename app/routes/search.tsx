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

export const meta: MetaFunction = () => [
  { title: "Search - Dad Routes" },
  // { name: "description", content: "Discover the best routes and tips for family adventures." },
  // { name: "keywords", content: "family, travel, routes, adventures, Dad Routes" },
];

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';

  const result = await connectAndQuery(
    `SELECT routes.*, users.first_name || ' ' || users.last_name AS user 
     FROM routes 
     LEFT JOIN users ON routes.userid = users.id 
     WHERE 
     routes.active = true
     AND (
      routes.name ILIKE $1
      OR routes.description ILIKE $2
      )
      `,
    [`%${query}%`, `%${query}%`]
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
      <table className="styled-table whitespace-nowrap">
        <thead>
          <tr>
            <th className="hidden md:table-cell">#</th>
            <th className="hidden sm:table-cell" onClick={() => handleSort('name')}>Name</th>
            <th className="hidden md:table-cell" onClick={() => handleSort('user')}>User</th>
            <th className="hidden sm:table-cell" onClick={() => handleSort('difficulty')}>Difficulty</th>
            <th className="hidden md:table-cell" onClick={() => handleSort('num_stops')}>Stops</th>
            <th className="hidden md:table-cell" onClick={() => handleSort('num_kids')}>Kids</th>
            <th className="hidden md:table-cell" colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route, index) => (
            <tr key={route.id}>
              <td className="hidden md:table-cell">{index + 1}</td>
              <td className="hidden sm:table-cell">
                <Link to={`/routes/${route.id}`}>{route.name}</Link>
                {route.description &&
                  <>
                    <p className="routeDescription">
                      {route.description}
                    </p>

                  </>
                }

              </td>
              <td className="hidden md:table-cell">{route.user}</td>
              <td className="hidden sm:table-cell">{route.difficulty}</td>
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


      <div className="grid grid-cols-1 gap-4 md:hidden">
        <div>
          {routes.map((route, index) => (
            <div class="bg-white p-4 rounded-lg shadow mb-2 mt-2">
              <div key={route.id}>
                <div>
                  <Link to={`/routes/${route.id}`}>{route.name}</Link>
                </div>

                <div>
                  {route.description &&
                    <>
                      <p className="routeDescription">
                        {route.description}
                      </p>

                    </>
                  }
                </div>
                <div class="mt-1 mb-2">
                  Difficulty: <b>{route.difficulty}</b>
                  <br /> Stops: <b>{route.num_stops}</b>
                  <br /> Kids: <b>{route.num_kids}</b>
                </div>

                <div class="flex items-center space-m2 text-sm">
                  <Link class="mr-2" to={`/routes/${route.id}`}>
                    <button className="view-button">View</button>
                  </Link>
                  <br />
                  <Link to={`/download/gpx/${route.id}`}>
                    <button className="download-button ">Download</button>
                  </Link>

                </div>
              </div>

            </div>
          ))}

        </div>
      </div>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto max-w-7x1">
          <div className="flex flex-wrap w-full mb-4 p-4">
            <div className="w-full mb-6 lg:mb-0">
              <h1 className="sm:text-4xl text-5xl font-medium font-bold title-font mb-2 text-gray-900">Featured</h1>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
            </div>
          </div>
          <div className="flex flex-wrap -m-4">
            <div className="xl:w-1/4 md:w-1/2 p-4">
              <div className="bg-white p-6 rounded-lg">
                <img className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72  rounded w-full object-cover object-center mb-6" src="https://kuyou.id/content/images/ctc_2020021605150668915.jpg" alt="Image Size 720x400" />
                <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">Chichen Itza</h2>
                <p className="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
              </div>
            </div>
            <div className="xl:w-1/4 md:w-1/2 p-4">
              <div className="bg-white p-6 rounded-lg">
                <img className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6" src="https://asset.kompas.com/crops/Pk_pN6vllxXy1RshYsEv74Q1BYA=/56x0:1553x998/750x500/data/photo/2021/06/16/60c8f9d68ff4a.jpg" alt="Image Size 720x400" />
                <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">Colosseum Roma</h2>
                <p className="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
              </div>
            </div>
            <div className="xl:w-1/4 md:w-1/2 p-4">
              <div className="bg-white p-6 rounded-lg">
                <img className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6" src="https://images.immediate.co.uk/production/volatile/sites/7/2019/07/33-GettyImages-154260931-216706f.jpg?quality=90&resize=768%2C574" alt="Image Size 720x400" />
                <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">Great Pyramid of Giza</h2>
                <p className="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
              </div>
            </div>
            <div className="xl:w-1/4 md:w-1/2 p-4">
              <div className="bg-white p-6 rounded-lg">
                <img className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6" src="https://wisatamuda.com/wp-content/uploads/2019/02/1-Golden-Gate-Bridge-Gambar-dan-Foto-Tempat-Wisata-Terbaik-di-San-Fransisco-USA.jpg" alt="Image Size 720x400" />
                <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">San Francisco</h2>
                <p className="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


    </Layout>
  );
}
