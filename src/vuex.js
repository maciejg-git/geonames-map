import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { config } from './config.js'
import { tools } from "./tools.js";

Vue.use(Vuex);
// !drawpointsavelocalstoragename localstoragesettings !nodeprosteapicookies loginform 
// error tests gitpush deletemarkers searchregexp mapsidebar 
// GIT poemosobno

// distances !settingsfilter !controlsmapstatemarkerboundhom settingsmodal geonamesporzadek
// contextmenucomponent measuredistancesavegroup dodacmoreconfig contextmenunewvue backupdata
// !name zoomaftersearch !settingscomponentzamiastmap filterregexp

// !netlify !distance vuexporzadek drawingcontrols areacontrol mapexport

// undu

export const vuex = new Vuex.Store({
	state: {

		// GEONAMES

		items2: [],
		resultCounter: 0,
		states: [
			{
				state: "Montana", 
				code: "MT",
				value: true
			},
			{
				state: "Wyoming", 
				code: "WY",
				value: true
			},
			{
				state: "Colorado", 
				code: "CO",
				value: true
			},
			{
				state: "New Mexico",
				code: "NM",
				value: true
			},
		],
		filtersCategory: [],
		isLoading: false,
		isLoadingItems: [],
		resultCount: [],
		searchFeatures: [],

		searchHistory: [],

		// MAP

		mapMyItems: [],
		mapSearchItems: [],
		mapIsLoading: false,
		alertMessages: [],
		mapSettings: {
			filters: [],
		},
		map: "USGS",
		mapOverlay: null,
		mapOverlayOpacity: 50,
		filterSearch: "",
		isLayerHotspringsVisible: false,
		savedMarkedArea: true,

		// SETTINGS

		settings: {
			mapControls: null,
			useSpace: true,
			markedAreaColor: "red",
		},
	},

	// GETTERS

	getters: {
		filteredItems2: state => {
			return state.items2.filter(item => {
				let filterState = state.states.some(state => {
					return (item.State === state.code) && state.value 
				})
				if (!filterState) return false
				let filterCategory = state.filtersCategory.some(filter =>{
					return (item.Category == filter.category) && filter.value
				})
				if (!filterCategory) return false;
				return true;
			})
		},
		filteredItemsByFeature: (state, getters) => index => {
			return getters.filteredItems2.filter(item => item.index == index);
		},
		filteredItemsByFeatureCount: (state, getters) => index => {
			return getters.filteredItemsByFeature(index).length;
		},
		itemsByFeatureCount: (state, getters) => index => {
			return state.items2.filter(item => item.index == index).length;
		},

		// FILTERED MAP MARKERS

		filteredMapMyItems: (state) => filter => {
			let regexp = new RegExp(filter, "i");
			return state.mapMyItems.filter(item => item.text.search(regexp) >= 0);
		},

		// FILTERED MAP SEARCH ITEMS

		filteredMapSearchItems: (state) => {
			let regexp = new RegExp(state.filterSearch, "i")
			return state.mapSearchItems.filter(item => 
				item.Name.search(regexp) >= 0 
				|| item.State.search(regexp) >= 0 
				|| item.Category.search(regexp) >=0);
		},

		// sort items

		sortedItems: (state, getters) => (index, order) => {
			return getters.filteredItemsByFeature(index).sort((a, b) => {
				var nameA = a[order].toUpperCase();
				var nameB = b[order].toUpperCase();
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			})
		},

		// result count

		resultCountByFeature: (state, getters) => index => {
			return getters.itemsByFeatureCount(index) - 
				getters.filteredItemsByFeatureCount(index);
		}
	},

	// MUTATIONS

	mutations: {

		// SET ITEMS

		setItems2(state, payload) {
			state.items2 = state.items2.concat(payload.data);
		},
		resetItems(state) {
			state.items2 = [];
		},

		// SET BASE MAP SEARCH ITEMS

		setMapSearchItems(state, payload) {
			state.mapSearchItems = payload.data;
		},
		resetMapSearchItems(state) {
			state.mapSearchItems = [];
		},

		// FILTER

		setFilterState(state, f) {
			state.states[f.index].value = f.value;
		},
		setFilterCategory(state, f) {
			state.filtersCategory[f.index].value = f.value;
		},
		setFilteredCount(state, payload) {
			state.resultCount[payload.index].nameFiltered = payload.count;
		},
		setFiltersCategory(state) {
			for (let f of config.categories) {
				state.filtersCategory.push({
					category: f,
					value: !config.disabledFilterCategory.includes(f) 
				})
			}
		},

		// FILTER
		// PRESETS

		setAllFilterState(state, payload) {
			let filter = (payload == "all" ? 1 : 0);
			for (let s of state.states) {
				s.value = filter;
			}
		},
		setAllFilterCategory(state, payload) {
			if (payload == "all") {
				for (let c of state.filtersCategory) {
					c.value = true;
				}
			}
			else if (payload == "none") {
				for (let c of state.filtersCategory) {
					c.value = false;
				}
			}
			else if (payload == "default") {
				for (let c of state.filtersCategory) {
					c.value = !config.disabledFilterCategory.includes(c.category);
				}
			}
		},

		// LOADING

		setIsLoading(state, value) {
			state.isLoading = value;
		},
		setIsLoadingItems(state, payload) {
			Vue.set(state.isLoadingItems, payload.index, payload.value);
		},
		resetIsLoadingItems(state, payload) {
			state.isLoadingItems = [];
		},

		// RESULTS COUNT

		setResult(state, payload) {
			state.resultCount.splice(payload.index, 0, payload.resultCount);
		},
		resetResult(state) {
			state.resultCount = [];
		},
		setResultCounter(state, reset) {
			if (reset) {
				state.resultCounter = 0;
			}
			else {
				state.resultCounter++;
			}
		},
		setSearchFeatures(state, payload) {
			state.searchFeatures = payload.name;
		},

		// HISTORY

		setHistory(state, payload) {
			let index = state.searchHistory.indexOf(payload.searchString);
			if (index >= 0) {
				state.searchHistory.splice(index, 1);
			}
			state.searchHistory.unshift(payload.searchString)
		},
		loadHistory(state, payload) {
			state.searchHistory = payload.searchHistory;
		},

		// MAP

		loadMapMyItems(state, payload) {
			state.mapMyItems = payload.data;
		},
		addMyItem(state, f) {
			state.mapMyItems.unshift(f);
		},
		setMapIsLoading(state, value) {
			state.mapIsLoading = value;
		},
		addMessage(state , payload) {
			state.alertMessages.push(payload);
		},
		removeMessage(state , payload) {
			let index = state.alertMessages.indexOf(payload);
			state.alertMessages.splice(index, 1);
		},
		setMap(state, payload) {
			state.map = payload;
		},
		setMapOverlay(state, payload) {
			state.mapOverlay = payload;
		},
		setMapOverlayOpacity(state, payload) {
			state.mapOverlayOpacity = payload;
		},
		setFilterSearch(state, payload) {
			state.filterSearch = payload;
		},

		// MAP SETTINGS

		setMapSettingsFilters(state) {
			for (let f of config.categories) {
				state.mapSettings.filters.push({
					category: f,
					value: true,
				})
			}
		},
	},

	// ACTIONS

	actions: {

		// GEONAMES

		getItems({ commit, state }, urls) {
			let mapGoogleQuery = {
        basemap: "terrain",
        center: "",
        zoom: config.mapGoogleZoom
      };

			for (let i = 0; i < urls.length; i++) {
				commit("setIsLoading", true);
				commit("setIsLoadingItems", { index: i, value: true });
				let res = axios.get(urls[i]).then((res) => {
					for (let i2 of res.data) {
						i2.index = i;
						mapGoogleQuery.center = `${i2.Lat},${i2.Lon}`;
						i2.mapGoogle = tools.createUrl(config.mapGoogleUrl, mapGoogleQuery);
						i2.mapNa = config.mapNaUrl + i2.Lat + "," + i2.Lon + ",12z";
					}
					commit("setItems2", { data: res.data });
					commit("setIsLoadingItems", { index: i, value: false });
					let resultCount = {
						name: state.searchFeatures[i],
						nameCount: res.data.length,
						nameFiltered: 0
					}
					commit("setResultCounter", false);
					commit("setResult", { index: i, resultCount })
					commit("setIsLoading", false); 
				})
			}
		},

		// MAP

		getMapSearchItems({ commit, state, dispatch }, url) {
			commit("setMapIsLoading", true);
			let promise = axios.get(url).then(
				(res) => {
					commit("setMapSearchItems", { data: res.data });
					commit("setMapIsLoading", false);
				},
				(error) => {
					dispatch("addMessage", {
						text: `${error.name} ${error.message}`, 
						type: "warning"
					});
					commit("setMapIsLoading", false);
				})
			return promise;
		},

		// MAP ALERT

		addMessage({ commit, dispatch }, payload) {
			commit("addMessage", payload);
			dispatch("dismissMessage", payload);
		},
		dismissMessage({ commit, state }, payload) {
			setTimeout(function() {
				commit("removeMessage", payload);
			}, 3000);
		},
	}
})
