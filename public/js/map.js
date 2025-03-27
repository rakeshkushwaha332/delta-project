// public/js/map.js

// Set your token here if you're not injecting via EJS (in production you might want to expose it securely)
mapboxgl.accessToken = mapTokenFromServer || 'YOUR_PUBLIC_MAPBOX_TOKEN';

// Read coordinates from the DOM (provided via data attributes)
const mapContainer = document.getElementById('map');
const lng = mapContainer.dataset.lng;
const lat = mapContainer.dataset.lat;

// Parse coordinates and validate
if (lng && lat) {
    const map = new mapboxgl.Map({
        container: 'map',
        center: [parseFloat(lng), parseFloat(lat)],
        zoom: 12,
        style: 'mapbox://styles/mapbox/streets-v11'
    });

    new mapboxgl.Marker()
        .setLngLat([parseFloat(lng), parseFloat(lat)])
        .addTo(map);
} else {
    console.error("Map coordinates not provided.");
}
