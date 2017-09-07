import * as shapefile from 'shapefile'
import fetch from 'node-fetch'
import unzip from 'unzip'
import fs from 'fs'
import streamReduce from 'stream-reduce'
import fwd from 'fwd'
import es from 'event-stream'
import stream from 'stream'
import * as topojson from 'topojson'
import AdmZip from 'adm-zip'
import http from 'http'


const categories = [["<5%", "5-10%"], ["40-50%", "30-40%", "20-30%", "10-20%"], ["50-60%", "60-70%", "70-80%", "80-90%"], [">90%"]]
const titles = ['<10%', '10-50%', '50-90%', '>90%']

const mergeFeatures = topo => {

	return {
	    type : 'FeatureCollection',
	    features : categories.map( (probs, i) => {
	        return {
	            'geometry' : topojson.merge(topo, topo.objects.irma.geometries.filter(d => probs.indexOf(d.properties.PERCENTAGE) >= 0)) ,
	            'type' : 'Feature',
	            'properties' : titles[i],
	        }
	    } )
	}
}

const fetchAndUnzip = (url, regexp, n) => {

	console.log('Fetching ...')

	return fetch(url).then( resp => {

		let arr = []

		return new Promise((resolve, reject) => {

			http.get(url, resp => {

			let data = []
			let dataLen = 0

			resp.on('data', d => {
				data.push(d)
				dataLen += d.length

			})
			.on('end', () => {

				var buf = new Buffer(dataLen);

				console.log('here')

	            for (var i=0, len = data.length, pos = 0; i < len; i++) { 
	                data[i].copy(buf, pos); 
	                pos += data[i].length; 
	            } 

	            var zip = new AdmZip(buf);
	            var zipEntries = zip.getEntries();

	            zipEntries.forEach(entry => {
	            	if(regexp.test(entry.entryName)) {

	            		console.log(' * pushing ...')

	            		arr.push(entry.data)
	            	}
	            })

	            resolve(arr)

			})

		})

		})

	})

	// 	return new Promise((resolve, reject) => {

	// 		let arr = []

	// 		console.log('Extracting ...')

	// 		resp.body
	// 			.pipe(unzip.Parse())
	// 			.on('entry', (entry, x) => {

	// 				if(regexp.test(entry.path)){

	// 					console.log('matched entry')

	// 					console.log('Extracting ' + entry.path)

	// 					arr.push(entry)
	// 					entry.autodrain()
	// 				}

	// 				else {

	// 					console.log('no match')
	// 					entry.autodrain()
	// 				}

	// 				// if(arr.length >= n) { 
	// 				// 	console.log('Got enough files, move on ...');
	// 				// 	resolve(arr)
	// 				// }

	// 			})
	// 			.on('finish', () => {

	// 				console.log('here')
	// 				resolve(arr)
	// 			})

	// 	})
	// })

} 

const transform = ([dbf, shp]) => {

	return new Promise( (resolve, reject) => {

		let fc = { 'type' : 'FeatureCollection', 'features' : [] }

			console.log('Converting to GeoJSON ...')

			console.log(dbf)

			shapefile.open(shp, dbf)
					.then(src => src.read()
					.then(function parse (res) {

						if(res.done) { 
							resolve(fc)
							return;
						}
						fc.features.push(res.value)
						return src.read().then(parse)

					}))
					.catch('err', () => console.log(err))
	})

}

const doSomething = fc => {

	console.log(fc.features)

	fs.writeFileSync('./src/assets/test2.json', JSON.stringify(fc, null, 2))

}


async function getData() {

	let fc = { 'type' : 'FeatureCollection', 'features' : [] }

	// without any promises

	const merge = fc => {

		console.log('Merging features ...')

		const topo = topojson.topology({ irma : fc })
		const merged = mergeFeatures(topo)

		console.log('Writing to file ...')

		fs.writeFileSync('./src/assets/test.json', JSON.stringify(merged))
	}


	fetchAndUnzip('http://www.nhc.noaa.gov/gis/forecast/archive/wsp_120hr5km_latest.zip', /.*wsp34.*dbf$|.*wsp34.*shp$/, 2)
		.then(transform)
		.then(merge)
		// .then(() => {
		// 	fetchAndUnzip('http://www.nhc.noaa.gov/gis/forecast/archive/al112017_5day_029.zip', /.*pts\.dbf$|.*pts\.shp$/, 2)
		// 		.then(transform)
		// 		.then(doSomething)
		// })

		//})

	// shapefile.open().then(r => {
	// 	console.log(r)
	// })

	//console.log(json)
}

getData()