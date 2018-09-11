var osmosis = require("osmosis")
const url = 'http://www.nhc.noaa.gov/gis/archive_forecast_results.php?id=al06&year=2018'
const base = 'http://www.nhc.noaa.gov/gis/'
let arr = []

osmosis.get(url)
	.find('a')
	.set({
		'url' : '@href'
	})
	.data( obj => {
		
		arr.push(obj.url)

		console.log(obj)

	})
	.done(() => {

		const target = arr.filter(url => url && url.endsWith('.zip')).slice(-1)[0]
		console.log(base + target)
	})