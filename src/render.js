// const requireUncached = require('require-uncached');

// import mainTemplate from './src/templates/main.html!text'
// import 'svelte/ssr/register'
import moment from 'moment'

// const Table = requireUncached('../src/components/interactive-table/render.html')


export async function render() {

// const shp = await (shapefile.open("example.shp")
//   .then(source => source.read())

    const date = moment().utcOffset('-0400').format('D MMMM, h:mma')

    console.log('rendering...')

    return `<div class="here">
    	<div class="scale">
            <div class="scale-component">
	            <div class="scale__title">Hurricane severity</div>
	            <div class="scale__section" data-label="5" style="background-color: #850000"></div>
	            <div class="scale__section" data-label="4" style="background-color: #bd0026"></div>
	            <div class="scale__section" data-label="3" style="background-color: #f03b20"></div>
	            <div class="scale__section" data-label="2" style="background-color: #fd8d3c"></div>
	            <div class="scale__section" data-label="1" style="background-color: #fecc5c"></div>
    	    </div>

    		<div class="scale__expl">The grey cone shows the likely path of the centre of the hurricane. It does not indicate the size of the storm</div>
    	</div>
    	<div class="map"></div>
    	<div class="notes">All times in Eastern Daylight Time | Source: US National Hurricane Center | Last updated: ${date}</div>
    </div>`;
}
