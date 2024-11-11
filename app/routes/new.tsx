import Layout from "~/components/Layout";
import { useState, useCallback, useEffect, useRef } from "react";
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
  // const [waypoints, setWaypoints] = useState<any[]>([]); // State to hold waypoints
  const [markers, setMarkers] = useState<any[]>([]); // Store markers with lat/lng
  const [source, setSource] = useState<any>(null); // Source marker
  const [destination, setDestination] = useState<any>(null); // Destination marker

  const fileInputRefs = useRef([]);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [waypoints, setWaypoints] = useState([]);
  const [quickAddLatLong, setQuickAddLatLong] = useState("");

  const [routeName, setRouteName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [numStops, setNumStops] = useState(0);
  const [description, setDescription] = useState("");





  // Toggle sidebar for mobile
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  /* 
    const downloadGPX = () => {
      const gpxContent = `
      <gpx version="1.1" creator="Dad Routes">
        ${waypoints.map(wp => `
          <wpt lat="${wp.lat}" lon="${wp.lng}">
            <name>${wp.name}</name>
          </wpt>
        `).join('')}
      </gpx>
    `;
      const blob = new Blob([gpxContent], { type: "application/gpx+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "waypoints.gpx";
      link.click();
      URL.revokeObjectURL(url);
    }; */

  const downloadGPX = () => {
    if (!routeName) {
      alert("Please enter a route name before downloading the GPX file.");
      return;
    }

    const gpxData = `
      <?xml version="1.0" encoding="UTF-8" standalone="no" ?>
      <gpx version="1.1" creator="Dad Routes">
        <metadata>
          <name>${routeName}</name>
          <desc>${description || ""}</desc>
          ${difficulty ? `<type>${difficulty}</type>` : ""}
          ${numStops ? `<extensions><numberOfStops>${numStops}</numberOfStops></extensions>` : ""}
        </metadata>
        <trk>
          <name>${routeName}</name>
          <desc>${description || ""}</desc>
          <trkseg>
            ${waypoints
        .map(
          (wp) => `
              <trkpt lat="${wp.lat}" lon="${wp.lng}">
                <name>${wp.name}</name>
              </trkpt>`
        )
        .join("\n")}
          </trkseg>
        </trk>
      </gpx>
    `;
    const blob = new Blob([gpxData], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "waypoints.gpx";
    link.click();
    URL.revokeObjectURL(url);
  }

  // Save waypoints to localStorage on "Save to Account"
  const saveToAccount = () => {
    localStorage.setItem('savedWaypoints', JSON.stringify(waypoints));
    window.location.href = '/sign-in';
  };



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


  const handleQuickAdd = () => {
    const input = document.getElementById("quick-add-input").value;
    const [lat, lng] = input.split(",").map(Number); // Parse and convert to numbers

    if (isNaN(lat) || isNaN(lng)) {
      alert("Please enter valid latitude and longitude separated by a comma.");
      return;
    }

    const newMarker = {
      position: { lat, lng },
      label: `Waypoint ${waypoints.length + 1}`,
      name: `Waypoint ${waypoints.length + 1}`,
      type: "waypoint",
    };

    // Add the new waypoint to the state
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    setWaypoints((prevWaypoints) => [
      ...prevWaypoints,
      { ...newMarker.position, name: newMarker.name },
    ]);

    // Clear the input field
    document.getElementById("quick-add-input").value = "";
  };

  // Update waypoint name
  const updateWaypointName = (index, newName) => {
    const updatedWaypoints = [...waypoints];
    updatedWaypoints[index].name = newName;
    setWaypoints(updatedWaypoints);
  };
  // Remove a waypoint from the list
  const removeWaypoint = (index: number) => {
    const updatedWaypoints = waypoints.filter((_, idx) => idx !== index);
    setWaypoints(updatedWaypoints);

    const updatedMarkers = markers.filter((_, idx) => idx !== index);
    setMarkers(updatedMarkers);
  };

  const handleUploadClick = (idx) => {
    fileInputRefs.current[idx].click();
  };

  const handleFileUpload = async (event, idx) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedWaypoints = [...waypoints];
        updatedWaypoints[idx].thumbnail = reader.result; // store the data URI
        setWaypoints(updatedWaypoints);
      };
      reader.readAsDataURL(file); // convert image to data URI
    }
  };


  return (

    <Layout>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-1/3 p-4 bg-gray-100">
          <h2 className="text-2xl">Add New Route</h2>



          {/* Route Name (Required) */}
          <div className="my-4">
            <label className="block font-semibold" htmlFor="route-name">Route Name <span className="text-red-500">*</span></label>
            <input
              id="route-name"
              type="text"
              required
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Optional Fields */}
          <div className="my-4">
            <label className="block font-semibold">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="my-4">
            <label className="block font-semibold">Number of Stops</label>
            <input
              type="number"
              min="0"
              max="6"
              value={numStops}
              onChange={(e) => setNumStops(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="my-4">
            <label className="block font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>


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

          {/* Quick Add Section */}
          <fieldset className="my-4">
            <legend className="text-lg font-semibold">Quick Add</legend>
            <input
              id="quick-add-input"
              type="text"
              placeholder="Latitude, Longitude"
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={handleQuickAdd}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Add Waypoint
            </button>
          </fieldset>


          <button
            onClick={addWaypoint}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
          >
            Place markers
          </button>
          <h3 className="mt-6">Waypoints</h3>


          {/* Waypoint List */}
          <ul>
            {waypoints.map((waypoint, idx) => (
              <li
                key={idx}
                className={`waypoint-item flex items-center p-4 mb-2 border-b ${idx % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}
              >
                {/* Thumbnail on the left */}
                <div className="w-16 h-16 mr-4 overflow-hidden border rounded-lg bg-gray-300">
                  {waypoint.thumbnail ? (
                    <img src={waypoint.thumbnail} alt={`Thumbnail for ${waypoint.name}`} className="object-cover w-full h-full" />
                  ) : (
                    <button onClick={() => handleUploadClick(idx)} className="text-xs text-gray-500">Add Image</button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={(ref) => (fileInputRefs.current[idx] = ref)}
                    onChange={(e) => handleFileUpload(e, idx)}
                    className="hidden"
                  />
                </div>

                {/* Waypoint Information */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{waypoint.name || `Waypoint ${idx + 1}`}</h3>
                  <p className="text-sm text-gray-600">Lat: {waypoint.lat.toFixed(6)}, Lng: {waypoint.lng.toFixed(6)}</p>
                </div>


                <button
                  onClick={() => removeWaypoint(idx)} // Logic for removing waypoint
                  className="text-red-500 ml-2"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>


          <br />
          <br />
          <hr />
          <br />
          <h3>Finished? Either download create an account : </h3>

          {/* Download and Save buttons */}
          <div className="cta-buttons">
            <button
              onClick={downloadGPX}
              className="w-full bg-green-500 text-white py-2 rounded mb-2"
            >Download GPX</button>
            <button onClick={saveToAccount} className="w-full bg-red-300 text-white py-2 rounded mb-2">Save to Account</button>
          </div>
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
