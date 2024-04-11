mapboxgl.accessToken = 'pk.eyJ1IjoianlvdGlzaGJrIiwiYSI6ImNsdXBlcGE0eTFib3MybG1tbTBrNmpxdWgifQ.mB5MAjjERIMAXjF5rfnytg';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/navigation-day-v1', // stylesheet location
    center: campground.geometry.coordinates, // starting position [lng, lat]
    //center: [-74.5, 40],
    zoom: 10 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)

