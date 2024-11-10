// /app/routes/user/$id.tsx

import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { connectAndQuery } from "~/lib/db";
import type { User, Route } from "~/types"; // Assume you've defined types

import Layout from "~/components/Layout";
import UserRoutes from "~/components/UserRoutes";
import defaultAvatar from '~/assets/default_avatar.png';
import InvalidUser from "~/components/InvalidUser";

type LoaderData = {
    user: User;
    routeCount: number;
    routes: Route[]; // Add the type for routes
};

export const meta: MetaFunction = () => [
  { title: "User/ - Dad Routes" },
  { name: "description", content: "Discover the best routes and tips for family adventures." },
  { name: "keywords", content: "family, travel, routes, adventures, Dad Routes" },
];


const image_covers = [
    '/covers/cover-1.jpg',
    '/covers/cover-2.jpg',
    '/covers/cover-3.jpg',
];

export const loader: LoaderFunction = async ({ params }) => {
    const userId = params.id;
    if (!userId) {
        throw new Error("User ID is required.");
    }

    //   await connectDB(); // Ensure connection

    // Fetch user data
    const userRes = await connectAndQuery("SELECT first_name, picture, occupation, about_bio, website, twitter, youtube, instagram, linkedin, followers, following FROM users WHERE id = $1 AND active = true", [userId]);
 	if (!userRes) {
        return (
            <InvalidUser></InvalidUser>
        )
    }
    const user = userRes.rows[0];

    // Fetch count of routes using 'userid'
    const routeCountRes = await connectAndQuery("SELECT COUNT(*) FROM routes WHERE userid = $1 AND active = true", [userId]);
    const routeCount = parseInt(routeCountRes.rows[0].count, 10);

    // Fetch routes for the user
    const routesQuery = "SELECT * FROM routes WHERE userid = $1 AND active = true"; // Adjust the query as needed
    const routesResult = await connectAndQuery(routesQuery, [userId]);
    const routes = routesResult.rows; // This should return an array of Route objects


    return json<LoaderData>({ user, routeCount, routes });
};

export default function UserProfile() {
    const { user, routeCount, routes } = useLoaderData<LoaderData>();

    if( ! user){
        return (
            <InvalidUser></InvalidUser>
        )
    }

    // Determine which image to show by dividing the time by 10, 
    // and using modulo to ensure the result cycles through the images.
    const coverIndex = Math.floor(Date.now() / 1000 / 10) % image_covers.length;

    return (

        <Layout>

            {/* Breadcrumb Navigation */}
            <nav>
                <Link to="/users">Users</Link> &gt; <h2 style={{ display: 'inline', marginLeft: '8px' }}>{user.first_name}</h2>
            </nav>


            <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "20px" }}>
                {/* Cover Photo */}
                <div
                    style={{
                        width: "100%",
                        height: "200px",
                        backgroundColor: "#ddd",
                        position: "relative",
                        borderRadius: "8px",
                    }}
                >
                    <div
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            position: "absolute",
                            left: "20px",
                            bottom: "-75px",
                            border: "5px solid #fff",
                            backgroundColor: "#fff",
                        }}
                    >
                        <img
                            src={user.picture || defaultAvatar}
                            alt={`${user.first_name}'s avatar`}
                            style={{ borderRadius: '50%', width: "100%", height: "100%", objectFit: "cover", marginRight: '20px' }}
                        />

                    </div>
                </div>



                {/* User Info */}
                <div style={{ paddingTop: "80px" }}>



                    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
		    {/* <!-- User Info with Verified Button --> */}
                        <div class="flex items-center mt-4">
                            <h2 class="text-xl font-bold text-gray-800">{user.first_name}</h2>
                            <button class=" px-2 py-1 rounded-full">
                                <svg fill="#4d9aff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns: xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" viewBox="0 0 536.541 536.541" xml: space="preserve" stroke="#4d9aff">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <g>
                                            <g>
                                                <path d="M496.785,152.779c-3.305-25.085-16.549-51.934-38.826-74.205c-22.264-22.265-49.107-35.508-74.186-38.813 c-11.348-1.499-26.5-7.766-35.582-14.737C328.111,9.626,299.764,0,268.27,0s-59.841,9.626-79.921,25.024 c-9.082,6.965-24.235,13.238-35.582,14.737c-25.08,3.305-51.922,16.549-74.187,38.813c-22.277,22.271-35.521,49.119-38.825,74.205 c-1.493,11.347-7.766,26.494-14.731,35.57C9.621,208.422,0,236.776,0,268.27s9.621,59.847,25.024,79.921 c6.971,9.082,13.238,24.223,14.731,35.568c3.305,25.086,16.548,51.936,38.825,74.205c22.265,22.266,49.107,35.51,74.187,38.814 c11.347,1.498,26.5,7.771,35.582,14.736c20.073,15.398,48.421,25.025,79.921,25.025s59.841-9.627,79.921-25.025 c9.082-6.965,24.234-13.238,35.582-14.736c25.078-3.305,51.922-16.549,74.186-38.814c22.277-22.27,35.521-49.119,38.826-74.205 c1.492-11.346,7.766-26.492,14.73-35.568c15.404-20.074,25.025-48.422,25.025-79.921c0-31.494-9.621-59.848-25.025-79.921 C504.545,179.273,498.277,164.126,496.785,152.779z M439.256,180.43L246.477,373.209l-30.845,30.846 c-8.519,8.52-22.326,8.52-30.845,0l-30.845-30.846l-56.665-56.658c-8.519-8.52-8.519-22.326,0-30.846l30.845-30.844 c8.519-8.519,22.326-8.519,30.845,0l41.237,41.236L377.561,118.74c8.52-8.519,22.326-8.519,30.846,0l30.844,30.845 C447.775,158.104,447.775,171.917,439.256,180.43z"></path>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </button>
                        </div>
                        {/* <!-- Bio --> */}

                        {user.about_bio &&
                            <p class="text-gray-700 mt-2">
                                {user.about_bio}
                            </p>}

                        {/* <!-- Social Links --> */}
                        <div class="flex items-center mt-4 space-x-4">
                            <a href={user.twitter || '#'} class="text-blue-500 hover:underline"> Twitter </a>
                            <a href={user.website || '#'} class="text-blue-500 hover:underline"> Website </a>
                            <a href={user.youtube || '#'} class="text-blue-500 hover:underline"> YouYube </a>
                            <a href={user.instagram || '#'} class="text-blue-500 hover:underline"> Instagram </a>
                            <a href={user.linkedIn || '#'} class="text-blue-500 hover:underline"> LinkedIn </a>
                        </div>
                        {/* <!-- Separator Line --> */}
                        <hr class="my-4 border-t border-gray-300" />
                        {/* <!-- Stats --> */}
                        <div class="flex justify-between text-gray-600 mx-2">
                            <div class="text-center">
                                <span class="block font-bold text-lg">{user.followers || 0}</span>
                                <span class="text-xs">Followers</span>
                            </div>
                            <div class="text-center">
                                <span class="block font-bold text-lg">{user.following || 0}</span>
                                <span class="text-xs">Following</span>
                            </div>
                            <div class="text-center">
                                <span class="block font-bold text-lg">{routeCount || 0}</span>
                                <span class="text-xs">Routes</span>
                            </div>
                        </div>

                        {/* <!-- Separator Line --> */}
                        <hr class="my-4 border-t border-gray-300" />

                        <div class="w-full flex justify-center pt-5 pb-5">
                            <a href="#" class="mx-5">
                                <div aria-label="Github">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="#718096" stroke-width="1.5" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-github">
                                        <path
                                            d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22">
                                        </path>
                                    </svg>
                                </div>
                            </a>
                            <a href="#" class="mx-5">
                                <div aria-label="Twitter">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="#718096" stroke-width="1.5" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-twitter">
                                        <path
                                            d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z">
                                        </path>
                                    </svg>
                                </div>
                            </a>
                            <a href="#" class="mx-5">
                                <div aria-label="Instagram">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="#718096" stroke-width="1.5" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-instagram">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </div>
                            </a>
                        </div>



                    </div>

                    <UserRoutes userId={user.id} routes={routes} />

                </div>
            </div>



        </Layout >
    );
}
