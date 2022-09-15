const busLocationsUrl =
    'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip'

//use your own token
mapboxgl.accessToken =
    'pk.eyJ1IjoiYW5uYWR2ZW50dXJhIiwiYSI6ImNsN3p6MDdjYTAxNXkzd3FubTNqaDAxOGMifQ.SoHWnytCaH_kT-ZbQ35OTQ'

const busesMap = {}

// This is the map
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.10855085778486, 42.36788708050452],
    zoom: 14,
})

// Request bus data from MBTA
async function getBusInfo() {
    const response = await fetch(busLocationsUrl)
    const json = await response.json()
    return json.data
}

// create the marker
function createMarker(position) {
    const image = document.createElement('img')
    image.src = 'blue.png'
    const busMarker = new mapboxgl.Marker({
        element: image,
    })
    busMarker.setLngLat(position)
    busMarker.addTo(map)
    return busMarker
}

//integrate all functions
async function update() {
    const result = await getBusInfo()
    result.forEach((bus) => {
        const position = [bus.attributes.longitude, bus.attributes.latitude]
        let busMarker = busesMap[bus.id]
        if (busMarker == null) {
            busMarker = createMarker(position)
            busesMap[bus.id] = busMarker
            return
        }

        busMarker.setLngLat(position)
    })
}
update()
setInterval(update, 15000)
