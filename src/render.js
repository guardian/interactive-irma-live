const requireUncached = require('require-uncached');

import mainTemplate from './src/templates/main.html!text'
import 'svelte/ssr/register'

const Table = requireUncached('../src/components/interactive-table/render.html')


export async function render() {

// const shp = await (shapefile.open("example.shp")
//   .then(source => source.read())



    return `<div class="here">hihi</div>`;
}
