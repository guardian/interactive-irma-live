const requireUncached = require('require-uncached');

import mainTemplate from './src/templates/main.html!text'
import 'svelte/ssr/register'
import moment from 'moment'

const Table = requireUncached('../src/components/interactive-table/render.html')


export async function render() {

// const shp = await (shapefile.open("example.shp")
//   .then(source => source.read())

    const date = moment().utcOffset('-0400').format('D MMMM, h:mm a')

    return `<div class="here">
    	<div class="scale">
    		<div class="scale__section" data-label="The storm's center is likely to pass through this area" style="background-color: #767676"></div>
    	</div>
    	<div class="map"></div>
    	<div class="notes">All times in Atlantic Standard Time | Source: US National Hurricane Center | Last updated: ${date}</div>
    </div>`;
}
