mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map',
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/mapbox/dark-v11',
  center: listing.geometry.coordinates,
  zoom: 8
});

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${listing.location}</ h5><p><i> <b> Exact Location will be Provided after booking </b></i> </p>`
    )
  )
  .addTo(map);