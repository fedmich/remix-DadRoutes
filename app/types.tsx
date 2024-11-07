// /app/types.ts

export type User = {
    id: number; // Unique identifier for the user
    google_sub: string; // Google subscription ID
    first_name: string; // User's first name
    last_name: string; // User's last name
    about_bio?: string; // Optional bio about the user
    picture?: string;
    occupation?: string; // Optional occupation of the user
    website?: string; // Optional personal website URL
    twitter?: string; // Optional Twitter handle
    youtube?: string; // Optional YouTube handle
    instagram?: string; // Optional Instagram handle
    linkedin?: string; // Optional LinkedIn profile
    created_at: string; // Timestamp when the user was created
    updated?: string; // Timestamp when the user was last updated
  };

export type Route = {
  id: number; // Unique identifier for the route
  name: string; // Name of the route
  user_id: number; // ID of the user who created the route
  coordinates: string; // Coordinates of the route (may need to be more specific)
  created_at: string; // Timestamp when the route was created
  // Additional fields can be added here as necessary
};
