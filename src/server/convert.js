import fs from 'fs'
import * as topojson from 'topojson'
import * as turf from '@turf/turf'

const cone = JSON.parse(fs.readFileSync('data/' + process.argv[2]))
const dates = JSON.parse(fs.readFileSync('data/' + process.argv[3]))

const categories = [["<5%", "5-10%"], ["40-50%", "30-40%", "20-30%", "10-20%"], ["50-60%", "60-70%", "70-80%", "80-90%"], [">90%"]]
const titles = ['<10%', '10-50%', '50-90%', '>90%']

const key = Object.keys(cone.objects)[0]

console.log(cone.objects[key].geometries)

const mergeFeatures = topo => {
	return {
	    type : 'FeatureCollection',
	    features : categories.map( (probs, i) => {

	    	const geo = topojson.merge(cone, cone.objects[key].geometries.filter(d => probs.indexOf(d.properties.PERCENTAGE) >= 0))

	        return {
	            'geometry' : geo,
	            'type' : 'Feature',
	            'properties' : { 'band' : titles[i] },
	        }
	    } )
	}
}

const coneMerged = mergeFeatures(topojson.topology({ irma : cone }))

fs.writeFileSync('data/cone_merged.json', JSON.stringify(coneMerged, null, 2))

console.log('All done.')