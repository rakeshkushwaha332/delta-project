
    // Set Mapbox access token
    mapboxgl.accessToken = "<%= process.env.MAP_TOKEN %>";

    // // Parse the listing's location coordinates (assuming listing.location is a string like "lng,lat")
    // const coordinates = "<%= listing.location %>".split(',').map(Number);

    // Initialize the map
    const map = new mapboxgl.Map({
    container: 'map',
    center: {lng: 77.5946, lat: 12.9716},  // ✅ Pass valid coordinates.
    zoom: 12
});


    // // Add a marker for the listing's location
    // new mapboxgl.Marker()
    //     .setLngLat(coordinates)

          // Create a default Marker and add it to the map.
    const marker = new mapboxgl.Marker()
    .setLngLat(coordinates)
    .addTo(map);

