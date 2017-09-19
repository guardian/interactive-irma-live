var fs = require("fs")
var topojson = require("topojson")
var simplify = require("simplify-geojson")

const cone = JSON.parse(fs.readFileSync('data/' + process.argv[2]))
const dates = JSON.parse(fs.readFileSync('data/' + process.argv[3]))

const key = Object.keys(cone.objects)[0]

const coneMerged = topojson.feature(cone, cone.objects[key])

const simple = simplify(coneMerged, 0.035)

fs.writeFileSync('data/cone_merged.json', JSON.stringify(simple, null, 2))

console.log('Merged shapes.')