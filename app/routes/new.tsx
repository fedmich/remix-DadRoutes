import Layout from "~/components/Layout";
import { useState, useCallback, useEffect } from "react";
import { json, LoaderFunction } from "@remix-run/node";
import {
  GoogleMap,
  LoadScript,
  MarkerF,
  InfoWindowF,
  Autocomplete,
  useLoadScript,
} from "@react-google-maps/api";
import { getSession } from "~/lib/session"; // Adjust to where session handling is located
import { useLoaderData } from "@remix-run/react";;

const center = { lat: 41.8781, lng: -93.0977 }; // Coordinates for Iowa, USA
const libraries = ["places"];


export const meta: MetaFunction = () => [
  { title: "New route - Dad Routes" },
  // { name: "description", content: "Discover the best routes and tips for family adventures." },
  // { name: "keywords", content: "family, travel, routes, adventures, Dad Routes" },
];


export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  // Add any server-side logic to fetch data if needed

  return json({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
  });
};

const NewRoutePage = () => {
  const { googleMapsApiKey } = useLoaderData();
  const [waypoints, setWaypoints] = useState<any[]>([]); // State to hold waypoints
  const [markers, setMarkers] = useState<any[]>([]); // Store markers with lat/lng
  const [source, setSource] = useState<any>(null); // Source marker
  const [destination, setDestination] = useState<any>(null); // Destination marker

  // Load the Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries,
  });

  // Handle error if the Google Maps API fails to load
  if (loadError) {
    return <div>Error loading Google Maps API: {loadError.message}</div>;
  }

  // Handle the selection of source and destination markers
  const handlePlaceSelect = useCallback((place: any, type: "source" | "destination") => {
    const position = place.geometry.location;

    // Create marker
    const marker = {
      position: { lat: position.lat(), lng: position.lng() },
      label: type === "source" ? "A" : "B",
      type,
      name: place.name,
      photos: place.photos,
    };

    setMarkers((prev) => [...prev, marker]);

    if (type === "source") {
      setSource(marker);
    } else {
      setDestination(marker);
    }
  }, []);

  // Handle map click to add a new marker and update the waypoint list
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();

    // Create a new waypoint marker
    const newMarker = {
      position: { lat, lng },
      label: `Waypoint ${waypoints.length + 1}`,
      type: "waypoint",
      name: `Waypoint ${waypoints.length + 1}`,
    };

    // Add the new marker to the markers state
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

    // Add the new waypoint to the list
    setWaypoints((prevWaypoints) => [
      ...prevWaypoints,
      { lat, lng, name: newMarker.name },
    ]);

    // Automatically set the first waypoint as the "source"
    if (waypoints.length === 0) {
      setSource(newMarker);
    }
  }, [waypoints]);


  const handleMarkerDragEnd = (index: number, newPosition: google.maps.LatLng) => {

    // Update the marker's position in the state
    const updatedMarkers = [...markers];
    updatedMarkers[index] = {
      ...updatedMarkers[index],
      position: {
        lat: newPosition.lat(),
        lng: newPosition.lng(),
      },
    };

    // Update the markers state
    setMarkers(updatedMarkers);

    // Update the waypoint's coordinates to reflect the new position
    const updatedWaypoints = [...waypoints];
    updatedWaypoints[index] = {
      ...updatedWaypoints[index],
      lat: newPosition.lat(),
      lng: newPosition.lng(),
    };

    // Update the waypoints state
    setWaypoints(updatedWaypoints);

    // If it's the source marker, update the source state
    if (updatedMarker.type === "source") {
      setSource(updatedMarker);
    }

    // If it's the destination marker, update the destination state
    else if (updatedMarker.type === "destination") {
      setDestination(updatedMarker);
    }
  };



  // Add a waypoint to the list
  const addWaypoint = () => {
    if (source && destination) {
      setWaypoints([
        { name: "Source", lat: source.position.lat, lng: source.position.lng },
        ...waypoints,
        { name: "Destination", lat: destination.position.lat, lng: destination.position.lng },
      ]);
    }
  };

  // Remove a waypoint from the list
  const removeWaypoint = (index: number) => {
    const updatedWaypoints = waypoints.filter((_, idx) => idx !== index);
    setWaypoints(updatedWaypoints);

    const updatedMarkers = markers.filter((_, idx) => idx !== index);
    setMarkers(updatedMarkers);
  };

  return (

    <Layout>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-1/3 p-4 bg-gray-100">
          <h2 className="text-2xl">Add New Route</h2>
          <div>
            <h3>Source</h3>
            <input
              id="source-place"
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Source address"
            // On input change, call the API or logic to handle source address selection
            />
          </div>
          <div>
            <h3>Destination</h3>
            <input
              id="destination-place"
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Destination address"
            // On input change, call the API or logic to handle destination address selection
            />
          </div>
          <button
            onClick={addWaypoint}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
          >
            Place markers
          </button>
          <h3 className="mt-6">Waypoints</h3>
          <ul>
            {waypoints.map((wp, idx) => (
              <li key={idx}>
                {wp.name} - {wp.lat}, {wp.lng}
                <button
                  onClick={() => removeWaypoint(idx)} // Logic for removing waypoint
                  className="text-red-500 ml-2"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Google Map */}
        <div className="flex-1">
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100vh" }}
              center={center}
              zoom={14}
              onClick={handleMapClick} // Handle map click to add markers
            >
              {markers.map((marker, index) => (
                <MarkerF
                  key={index}
                  position={marker.position}
                  label={marker.label}
                  draggable
                  onDragEnd={(e) => handleMarkerDragEnd(index, e.latLng)} // Pass the latLng of the event
                >
                  <InfoWindowF position={marker.position}>
                    <div>
                      <strong>{marker.name}</strong>
                      {marker.photos && marker.photos.length > 0 && (
                        <img
                          src={marker.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 })}
                          alt={marker.name}
                          className="w-24"
                        />
                      )}
                    </div>
                  </InfoWindowF>
                </MarkerF>
              ))}

            </GoogleMap>
          )}
        </div>
      </div>

    </Layout>
  );
};

export default NewRoutePage;
