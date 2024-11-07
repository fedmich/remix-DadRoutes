import { LoaderFunction, json } from "@remix-run/node";
import { connectAndQuery } from "~/lib/db";

export const loader: LoaderFunction = async () => {
  
  try {
    console.log("Connecting to the database...");
    await connectAndQuery(''); // Ensure connection is established
    console.log("Connected to the database.");

    // Fetch active route counts grouped by user
    console.log("Fetching active route counts grouped by user...");
    const routesRes = await connectAndQuery(
      `SELECT userid, COUNT(id) AS count 
       FROM routes 
       WHERE active = true 
       GROUP BY userid`
    );

    // Check if routesRes is defined and has rows
    if (!routesRes || !routesRes.rows) {
      console.error("No results returned for route counts.");
      return json({ success: false, message: "No results found." }, { status: 500 });
    }

    console.log("Fetched route counts:", routesRes.rows);

    // Create a mapping of user ID to route count
    const routeCounts = new Map<number, number>();
    for (const row of routesRes.rows) {
      routeCounts.set(row.userid, parseInt(row.count, 10));
    }
    console.log("Route counts mapped:", Array.from(routeCounts.entries()));

    // Fetch all users
    console.log("Fetching all users...");
    const usersRes = await connectAndQuery('SELECT id FROM users');

    // Check if usersRes is defined and has rows
    if (!usersRes || !usersRes.rows) {
      console.error("No users found.");
      return json({ success: false, message: "No users found." }, { status: 500 });
    }

    console.log("Fetched users:", usersRes.rows);

    // Update num_routes for each user
    for (const user of usersRes.rows) {
      const userId = user.id;
      const routeCount = routeCounts.get(userId) || 0; // Default to 0 if not found
      console.log(`Updating user ${userId} with route count: ${routeCount}`);

      // Check for successful update
      const updateRes = await connectAndQuery(
        'UPDATE users SET num_routes = $1 WHERE id = $2',
        [routeCount, userId]
      );

      console.log(`Update result for user ${userId}:`, updateRes);
    }

    console.log("User route counts updated successfully.");
    return json({ success: true, message: "User route counts updated successfully." });

  } catch (error) {
    console.error("Error updating user route counts:", error);
    return json({ success: false, message: "Error updating user route counts." }, { status: 500 });

  }

};
