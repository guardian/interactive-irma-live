import GoogleMap from '../components/interactive-google-map/index.html'
import path from '../assets/path.json'

import history from '../assets/data/track.json'
import moment from 'moment'

// import history from '../assets/history.json'

const el = document.querySelector(".here .map")

function getColour(p) {
    if (p === ">90%") {
        return "#b51800"
    } else if (p === "50-90%") {
        return "#ff9b0b"
    } else if (p === "10-50%") {
        return "#ffce4b"
    } else {
        return "#ffffaf"
    }
}

let markers = path.features
    .filter(f => {

        //2017-09-08 8:00 AM Fri EDT

        const split = f.properties.FLDATELBL.split(' ')

        const hour = Number(split[1].slice(0, -3))

        let date = moment(split[0])
        date = date.hour(split[2] === 'AM' ? hour : hour + 12)

        return date > moment()

        //console.log(moment(f.properties.ADVDATE).format('D MMMM, h:mm a'))

        //ADVDATE":"200 PM AST Thu Sep 07 2017

    })
    .map(d => {
        return {
            "lat": d.properties.LAT,
            "lng": d.properties.LON,
            "label": d.properties.DATELBL,
            "severity": d.properties.SSNUM
        }
    });

let historyMarkers = history.features.map(d => {
    return {
        "lat": d.geometry.coordinates[1],
        "lng": d.geometry.coordinates[0],
        "label": d.properties.Name
    }
});

var lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 3
};


const map = new GoogleMap({
    target: el,
    data: {
        el: el,
        config: {
            center: { lat: 24.266188981138203, lng: -71.71453914375003 },
            zoom: el.clientWidth > 600 ? 5 : 4
        },
        markers: markers,
        historyMarkers: historyMarkers,
        markerConfig: {
            markerSize: 10,
            infoWindowWidth: 100
        },
        choropleth: f => {
            const colour = getColour(f.getProperty("band"));
            return {
                fillColor: colour,
                fillOpacity: ["10-50%", "<10%"].indexOf(f.getProperty("band")) > -1 ? 0.2 : 0.35,
                strokeColor: colour,
                strokeWeight: f.getProperty('band') === '50-90%' ? 0 : 1,
                strokeOpacity: 0.5,
                icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '17px'
                }],
            }
        },
        key: "AIzaSyBGZVyAXHJwoA4Ea-a3kuD1AsuZwbrnLlM"
    }
})

if (window.resize) {
    window.resize();
}


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