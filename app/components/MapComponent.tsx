// app/components/MapComponent.tsx
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapComponentProps {
    routes: { id: number; name: string; latitude: number; longitude: number }[];
    viewport: { latitude: number; longitude: number; zoom: number };
    setViewport: (viewport: { latitude: number; longitude: number; zoom: number }) => void;
    apiKey: string; // Add apiKey prop
}

const MapComponent = ({ routes, viewport, setViewport, apiKey }: MapComponentProps) => {
    // Handle the center change
    const onMapCenterChanged = (map: google.maps.Map) => {
        const center = map.getCenter();
        if (center) {
            setViewport({
                latitude: center.lat(),
                longitude: center.lng(),
                zoom: viewport.zoom,
            });
        }
    };

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={{ height: '100%', width: '100%' }}
                center={{ lat: viewport.latitude, lng: viewport.longitude }}
                zoom={viewport.zoom}
                onCenterChanged={() => onMapCenterChanged} // Use arrow function to pass the handler correctly
                onLoad={(map) => onMapCenterChanged(map)} // Capture initial load as well
            >
                {routes.map(route => (
                    <Marker
                        key={route.id}
                        position={{ lat: route.latitude, lng: route.longitude }}
                        title={route.name}
                    />
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;
