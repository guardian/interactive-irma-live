import * as shapefile from 'shapefile'
import fetch from 'node-fetch'



async function getData() {
	const shp = await fetch('http://www.nhc.noaa.gov/gis/forecast/archive/wsp_120hr5km_latest.zip');
	const json = await shapefile.read(shp);
}



console.log(json)