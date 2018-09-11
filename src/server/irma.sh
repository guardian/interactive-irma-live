cd "${0%/*}"
URL=`node scrape.js | tail -1`

pwd

rm -rf data
mkdir -p data
wget https://www.nhc.noaa.gov/gis/forecast/archive/wsp_120hr5km_latest.zip -O cone.zip
wget $URL -O dates.zip

wget https://www.nhc.noaa.gov/gis/best_track/al062018_best_track.kmz -O track.kmz

unzip -o cone.zip -d data/
unzip -o dates.zip -d data/
unzip -o track.kmz -d data/

cd data
../../../node_modules/.bin/topojson -o cone.json *pgn.shp -p
../../../node_modules/.bin/topojson -o dates.json *pts.shp -p
../../../node_modules/.bin/togeojson al062018.kml > track.json

cd ..
node ./convert.js cone.json dates.json

cp -R data ../assets/