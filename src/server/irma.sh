URL=`node scrape.js | tail -1`

rm -rf data
mkdir -p data
wget http://www.nhc.noaa.gov/gis/forecast/archive/wsp_120hr5km_latest.zip -O cone.zip
wget $URL -O dates.zip

wget http://www.nhc.noaa.gov/gis/best_track/al152017_best_track.kmz -O track.kmz

unzip -o cone.zip -d data/
unzip -o dates.zip -d data/
unzip -o track.kmz -d data/

cd data
topojson -o cone.json *pgn.shp -p
topojson -o dates.json *pts.shp -p
togeojson al152017.kml > track.json

cd ..
node ./convert.js cone.json dates.json

cp -R data ../assets/