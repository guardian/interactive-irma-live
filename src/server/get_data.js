import * as shapefile from 'shapefile'
import fetch from 'node-fetch'
import unzip from 'unzip'
import fs from 'fs'
import streamReduce from 'stream-reduce'
import fwd from 'fwd'
import es from 'event-stream'
import stream from 'stream'

async function getData() {

	let fc = { 'type' : 'FeatureCollection', 'features' : [] }

	let shp = undefined;
	let dbf = undefined;

	fetch('http://www.nhc.noaa.gov/gis/forecast/archive/wsp_120hr5km_latest.zip').then( res => {
		res.body
			.pipe(unzip.Parse())
			
			.on('entry', entry => {

				if(entry.path.endsWith('shp')) {
					shp = entry
				}
				if(entry.path.endsWith('dbf')) {
					dbf = entry
				}

				if(shp && dbf) {
					parse()
				}
			})
	})

	const parse = () => {

		shapefile.open(shp, dbf)
			.then(src => src.read()
			.then(function parse (res) {

				if(res.done) { return }
				
				console.log(res.value)
				fc.features.push(res.value)
				return src.read().then(parse)

			}))
			.then(() => {

				console.log(fc)
				fs.writeFileSync('./src/assets/test.json', JSON.stringify(fc))

			})
	}

		//})

	// shapefile.open().then(r => {
	// 	console.log(r)
	// })

	//console.log(json)
}

getData()