const requireUncached = require('require-uncached');

import mainTemplate from './src/templates/main.html!text'
import 'svelte/ssr/register'

const Table = requireUncached('../src/components/interactive-table/render.html')


export async function render() {

// const shp = await (shapefile.open("example.shp")
//   .then(source => source.read())



    return `<div class="here">
    	<div class="scale">
    		<div class="scale__title">Probability of tropical storm level winds in the next five days</div>
    		<div class="scale__section" data-label=">90%" style="background-color: #b51800"></div>
    		<div class="scale__section" data-label="50-90%" style="background-color: #ff9b0b"></div>
    		<div class="scale__section" data-label="10-50%" style="background-color: #ffce4b"></div>
    		<div class="scale__section" data-label="<10%" style="background-color: #ffffaf"></div>
    	</div>
    	<div class="map"></div>
    	<div class="notes">All times in Atlantic Standard Time | Source: US National Hurricane Center | Last updated: 7 September</div>
    </div>`;
}
