import L from "leaflet"
import * as esri from "esri-leaflet"

import BBox from "@turf/bbox"
import BBoxPolygon from "@turf/bbox-polygon"
import Envelope from "@turf/envelope"
import Union from "@turf/union"
import Difference from "@turf/difference"
import { point, featureCollection } from "@turf/helpers"

import { config } from "./config.js"

export let map = {
	map: null,
	mapLayer: null,
	mapOverlayLayer: null,
	mapName: null,
	mapOverlayName: null,
	mapOverlayOpacity: 50,
	layerMyItems: null,
	layerSearchItems: null,
	layerHotsprings: null,
	rect: null,
	rectUndo: null,

	init() {
		this.rectUndo = this.rect;

		this.map = L.map("mapbase", {editable: true}).setView(
			config.defaultMapView.center,
			config.defaultMapView.zoom
		);

		this.setMap("USGS");

		L.control.scale().addTo(this.map);
	},
	setMap(mapName, mapOverlay) {
		if (this.mapLayer) {
			this.map.removeLayer(this.mapLayer);
		}

		if (config.maps[mapName].esriBasemap) {
			this.mapLayer = esri.basemapLayer(mapName);
		} 
		else if (config.maps[mapName].esri) {
			this.mapLayer = esri.tiledMapLayer({
				url: config.maps[mapName].url, 
				...config.maps[mapName].options
			})
		}
		else {
			this.mapLayer = L.tileLayer(
				config.maps[mapName].url,
				config.maps[mapName].options,
			)
		}

		this.map.attributionControl.remove();

		this.mapLayer.addTo(this.map);

		if (mapOverlay) {
			this.setMapOverlay(mapOverlay);
		}
	},
	setMapOverlay(mapName) {
		if (this.mapOverlayLayer) {
			this.map.removeLayer(this.mapOverlayLayer);
		}

		if (!mapName) return;

		if (config.maps[mapName].esriBasemap) {
			this.mapOverlayLayer = esri.basemapLayer(mapName);
		} 
		else if (config.maps[mapName].esri) {
			this.mapOverlayLayer = esri.tiledMapLayer({
				url: config.maps[mapName].url, 
				...config.maps[mapName].options
			})
		}
		else {
			this.mapOverlayLayer = L.tileLayer(
				config.maps[mapName].url,
				config.maps[mapName].options,
			)
		}

		this.map.attributionControl.remove();

		this.setMapOverlayOpacity();

		this.mapOverlayLayer.addTo(this.map);
	},
	setMapOverlayOpacity(value) {
		let opacity = value != undefined ? value : this.mapOverlayOpacity;
		this.mapOverlayOpacity = opacity;

		if (this.mapOverlayLayer) {
			this.mapOverlayLayer.setOpacity(opacity/100);
		}
	},

	// MARK AREA

	boundsToPolygon(bounds) {
		let p1 = L.GeoJSON.latLngToCoords(bounds.getSouthWest());
		let p2 = L.GeoJSON.latLngToCoords(bounds.getNorthEast());
		p1 = point(p1);
		p2 = point(p2);
		let f = featureCollection([p1, p2]);
		return Envelope(f);
	},
	unionMarkedWithPolygon(p) {
		this.rectUndo = this.rect;
		if (!this.rect) {
			this.rect = p;
		}
		else {
			this.rect = Union(this.rect, p)
		}
	},
	differenceMarkedWithPolygon(p) {
		this.rectUndo = this.rect;
		this.rect = Difference(this.rect, p);
	},
	undo() {
		if (this.rectUndo == this.rect) {
			return
		}
		this.rect = this.rectUndo;
	}
}
