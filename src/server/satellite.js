import moment from 'moment'
import fetch from 'node-fetch'
import request from 'request'
import fs from 'fs'
import child_process from 'child_process'

const startDay = '2017-09-06'
const endDay = '2017-09-06'
const startString = '08:00:35'
const endString = '20:00:35'

let h1, m1, s1;
[h1, m1, s1] = startString.split(':')

let h2, m2, s2;
[h2, m2, s2] = endString.split(':')

const start = moment(startDay).set({ 'hour' : h1, 'minute' : m1, 'second' : s1 })

const end = moment(endDay).set({ 'hour' : h2, 'minute' : m2, 'second' : s2 })

console.log(end.format('YYYY-MM-DD HHmmss'))

let current = start

let urls = new Set()

const wait = ms => new Promise((resolve, reject) => setTimeout(() => resolve() , ms));

const possible = ['35', '34', '36', '33', '37']

const requestRetry = (url, n, theIndex) => {

		return new Promise( (resolve, reject) => {

			let timeout = null

			// timeout = setTimeout(() => {
			//  	console.log('Timed out')
			//  	resolve(requestRetry(url, n - 1))
			//  }, 2000)

			if(n <= 0) {
				clearTimeout(timeout)
				reject('no more tries')
				return;
			}

			request(url, { encoding : 'binary', timeout : 20000 }, (err, resp, body) => {

				clearTimeout(timeout)

				if(!err && resp && Number(resp.statusCode) !== 404) {

					console.log('Success', resp.statusCode, url, urls.size)
					urls.add(url)
					resolve(body)
				}
				else {

					console.log('err', resp && resp.statusCode ? resp.statusCode + ' ' + theIndex : '')

					const newUrl = url.slice(0, -17) + possible[theIndex] + url.slice(-15)

					resolve(requestRetry(newUrl, n - 1, ((theIndex + 1) % possible.length) ))
				}

			})


	} )

}

const counts = {}

let xxx = 0

while(current <= end) {

	//console.log('cur', current.format('YYYY-MM-DD HHmmss'))
	//console.log(end.format('YYYY-MM-DD HHmmss'))

	let count = 0;

	let xMin = 3
	let xMax = 6

	let yMin = 1
	let yMax = 3

	const day = current.format('YYYY-MM-DD')
	//console.log(day)

	const hash = `${day.replace(/-/g, '')}_${current.format('HHmmss')}`
	counts[hash] = 0

	for(let x = xMin; x <= xMax; x++) {
		for(let y = yMin; y <= yMax; y++) {

			const curString = current.format('HHmmss')
		
			const url = `http://rammb-slider.cira.colostate.edu/data/imagery/${day.replace(/-/g, '')}/goes-16---full_disk/geocolor/${day.replace(/-/g, '')}${curString}/03/00${y}_00${x}.png`

			console.log(url)

			wait(Math.random()*1000).then(() => {

				requestRetry(url, 50, 0)//.then( resp => resp.blob() )
				
				.then( img => { //fs.createWriteStream(`satellite/${day.replace(/-/g, '')}_${curString}_00${y}_0${x}.png`).on('close', cb => {

					fs.writeFileSync(`satellite/${day.replace(/-/g, '')}_${curString}_00${y}_0${x}.png`, img, 'binary')

					xxx++

					counts[hash]++;

					//console.log(counts[hash])
					//console.log(xxx)

					if(counts[hash] === (xMax-xMin+1)*(yMax-yMin+1)) {
						console.log('downloaded everything')


						const cmd = 'montage'

						const args = ['-border', '0',
							'-geometry', '678x',
							'-tile', `${xMax-xMin + 1}x${yMax-yMin + 1}`,
							`${day.replace(/-/g, '')}_${curString}_0*`,
							`${day.replace(/-/g, '')}_${curString}_full.png`
							]

						console.log(args)

						const child = child_process.spawn(cmd, args, { cwd : './satellite' })

						child.on('exit', () => {
							console.log('doneeee')
						})


					}

				} )
				.catch(err => console.log(err))

				//.then(blob => fs.writeFileSync(`${day.replace(/-/g, '')}_00${x}_0${y}.png`, blob, 'binary'))

			})
		}
	}

	current = current.add('minute', 30)

}