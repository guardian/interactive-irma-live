class Topography {

	constructor (topo) {
		this.topo = topo
	}

	mapProperties (key, f) {

		this.topo.objects[key] = {
			type : 'GeometryCollection',
			geometries : this.topo.objects[key].geometries.map((geo, i) => {
				
				return {
					arcs : geo.arcs,
					type : geo.type,
					id : geo.id,
					properties : f(geo.id, geo.properties, i)
				}
			} )

		}

	return this

	}

	reduceFeatures (key, f) {

		this.topo.objects[key] = {

			type : 'GeometryCollection',
			geometries : this.topo.objects[key].geometries.reduce(f, [])

		}

		return this

	}

	valueOf () {
		return this.topo
	}
}

export default Topography