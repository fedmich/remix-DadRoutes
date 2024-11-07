// lib/gpx.ts

const generateGPX = (route: any, waypoints: any[]) => {
  // Create the slug: convert name to lowercase, replace spaces with underscores
  const slug = route?.name.toLowerCase().replace(/\s+/g, '_');

  // Create the filename using the route ID and slug
  const filename = `dadroutes_route_#${route.id}-${slug}.gpx`;

  // GPX Header
  const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
  <gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
    <metadata>
      <name>${route.name}</name>
      <desc>${route.note || 'No description'}</desc>
      <author>
        <name>Dad Routes</name>
        <link href="https://dadroutes.com">DadRoutes.com</link>
      </author>
      <time>${new Date().toISOString()}</time>
    </metadata>
    <trk>
      <name>${route.name}</name>
      <trkseg>
  `;

  // Waypoints
  const waypointPoints = waypoints.map((waypoint) => {
    return `
      <trkpt lat="${waypoint.latitude}" lon="${waypoint.longitude}">
        <ele>0</ele>
        <name>${waypoint.name_poi}</name>
        ${waypoint.description ? `<desc>${waypoint.description}</desc>` : '<desc></desc>'}
      </trkpt>
    `;
  }).join('');

  const gpxFooter = `
      </trkseg>
    </trk>
  </gpx>`;

  return { gpxData: gpxHeader + waypointPoints + gpxFooter, filename };
};

export { generateGPX };
