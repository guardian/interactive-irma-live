URL=`babel-node scrape.js | tail -1`

mkdir -p data
wget http://www.nhc.noaa.gov/gis/forecast/archive/wsp_120hr5km_latest.zip -O cone.zip
wget $URL -O dates.zip

unzip -o cone.zip -d data/
unzip -o dates.zip -d data/

cd data
shp2json -o cone.json *wsp34*.shp
shp2json -o dates.json *pts.shp

cd ..
babel-node convert.js cone.json dates.json