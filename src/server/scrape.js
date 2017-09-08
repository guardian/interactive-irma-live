var osmosis = require("osmosis")
const url = 'http://www.nhc.noaa.gov/gis/archive_forecast_results.php?id=al11&year=2017'
const base = 'http://www.nhc.noaa.gov/gis/'
let arr = []

osmosis.get(url)
	.find('a')
	.set({
		'url' : '@href'
	})
	.data( obj => {
		
		arr.push(obj.url)

	})
	.done(() => {

		const target = arr.filter(url => url && url.endsWith('.zip')).slice(-1)[0]
		console.log(base + target)
	})