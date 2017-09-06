import GoogleMap from '../components/interactive-google-map/index.html'
import path from '../assets/path.json'

const el = document.querySelector(".here")

console.log(el);

function getColour(p) {
    if(p === ">90%") {
        return "#b51800"
    } else if(p === "50-90%") {
        return "#ff9b0b"
    } else if(p === "10-50%"){
        return "#ffce4b"
    } else {
        return "#ffffaf"
    }
}

const markers = path.features.map(d => {
    return {
        "lat": d.properties.LAT,
        "lng": d.properties.LON,
        "label": d.properties.DATELBL + " " + d.properties.TIMEZONE
    }
});


const map = new GoogleMap({
    target: el,
    data: {
        el: el,
        config: {
            center: { lat: 21.022154913629862, lng: -71.58270320625003 },
            zoom: el.clientWidth > 600 ? 5 : 4
        },
        markers: markers,
        markerConfig: {
            markerSize: 10,
            infoWindowWidth: 100
        },
        choropleth: f => {
            const colour = getColour(f.getProperty("band"));
            return {
                fillColor: colour,
                fillOpacity: 0.35,
                strokeColor: colour,
                strokeWeight: 1,
                strokeOpacity: 0.3
            }
        },
        key: "AIzaSyBGZVyAXHJwoA4Ea-a3kuD1AsuZwbrnLlM"
    }
})



//use this in map config, note f.getProperty(x) rather than f.properties.x

// choropleth : f => {

//         return {
//              fillColor: changeColour(f.getProperty('change')),
//              fillOpacity: 0.5,
//              strokeColor : 'white',
//              strokeWeight : 1.5
//          }
//      }

// this belongs inside the component

// map.data.addGeoJson(features)
// map.data.setStyle(choropleth)
// console.log(path)