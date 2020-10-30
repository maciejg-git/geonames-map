<template>
  <div>
    <div class="bg-light">

      <MapNavbar 
         :active="activeSidebar" 
         @clickSidebarIcon="toggleSidebar" 
         />

      <div class="row no-gutters">

        <!-- SIDEBAR COL -->

        <div class="col-auto">

          <VSidebar 
             label="My Markers" 
             :badge="mapMyItems.length"
             v-show="isMyItemsSidebarVisible"
             :canCompact="true"
             >
            <MapBaseSidebarMyItems 
               :isVisible="isMyItemsSidebarVisible"
               @click-my-item="clickSidebarMyItem"
               @open-context="openContextMyItems"
               @update-filter="handleMyItemsFilterUpdate"
               @mouseenter="handleMouseenterMyItem"
               @mouseleave="handleMouseleaveMyItem"
               />
          </VSidebar>

          <VSidebar 
             label="Search" 
             :badge="mapSearchItems.length" 
             v-show="isSearchSidebarVisible" 
             :canCompact="true"
             >
            <MapBaseSidebarSearch 
               ref="mapSidebarSearch"
               :isVisible="isSearchSidebarVisible"
               @click-search-item="clickSidebarSearchItem"
               @open-context="openContextSearch"
               @search-complete="handleSearch"
               @update-filter="handleSearchFilterUpdate"
               @mouseenter="handleMouseenterSearchItem"
               @mouseleave="handleMouseleaveSearchItem"
               />
          </VSidebar>

          <VSidebar 
             label="Settings" 
             v-show="isSettingsSidebarVisible"
             :canCompact="false"
             >
             <MapSidebarSettings 
               @imported-my-items="handleImportedMyItems"
               @imported-marked-area="handleImportedMarkedArea"
               />
          </VSidebar>

          <VSidebar 
             label="Maps" 
             v-show="isMapsSidebarVisible"
             :canCompact="false"
             >
             <MapSidebarMaps />
          </VSidebar>

        </div>
        
        <!-- MAP COL -->

        <div class="col">
          <Map 
           ref="map"
           @map-created="handleMapCreated" 
           />

          <MapBaseControl 
           :myItemsMarkerVisibility="isMyItemsMarkersVisible"
           :searchMarkerVisibility="isSearchMarkersVisible"
           :markedAreaVisibility="isMarkedAreaVisible"
           @toggle-my-items-marker-visibility="toggleMyItemsMarkersVisibility"  
           @toggle-search-marker-visibility="toggleSearchMarkersVisibility" 
           @toggle-marked-area-visibility="toggleMarkedAreaVisibility"  
           @show-map="showMap"
           @mark-bounds="markArea"
           @unmark-bounds="unmarkArea"
           @mark-undo="markAreaUndo"
           />

          <!-- ALERT -->

          <transition name="fade">
            <Alert v-show="alertMessages.length" />
          </transition>

        </div>
      </div>
    </div>

    <!-- EDIT MARKER MODAL -->

    <VModal
      @button-save="editSaveItem"
      @button-delete="editDeleteItem"
      buttonAcceptLabel="Save Changes"
      buttonCancelLabel="Cancel"
      id="modalEditMyItem"
      >
      <template v-slot:header>
        Edit marker
      </template>
      <form>
        <div class="form-group">
          <textarea
            v-model="editedMyItem.text"
            class="form-control"
            rows="8"
            placeholder="Marker Notes"
            ></textarea>
        </div>
      </form>
      <div class="py-2">
        <img
          :src="icons.all[editedMyItem.color].image"
          alt
          class="px-1"
          />
        <div class="ml-4 pl-4 border-left" style="display: inline-block">
          <img
            v-for="(value, key) in icons.all"
            @click.prevent="editedMyItem.color = key"
            :src="value.image"
            alt
            class="pointer px-1 icon-hover"
            />
        </div>
      </div>
    </VModal>

    <!-- CONTEXT MAP -->

    <ContextMenu ref="contextMap" >
    <template v-slot:default="{ contextData }">
      <ContextMenuItem @click.native="contextMapAddMyItem(contextData)">
        <i class="fas fa-map-marker-alt fa-fw pointer pr-4"></i>
        Add my marker
      </ContextMenuItem>
      <ContextMenuItem @click.native="contextMapPaste(contextData)">
        <span :class="{'context-text-muted': !clipboard}">
          <i class="fas fa-copy fa-fw pointer pr-4"></i>
          Paste here
        </span>
      </ContextMenuItem>
      <div class="border-bottom w-100"></div>
      <ContextMenuItem @click.native="contextZoom(contextData)">
        <i class="fas fa-search-plus fa-fw pointer pr-4"></i>
        Zoom here
      </ContextMenuItem>
      <div class="border-bottom w-100"></div>
      <ContextMenuItem @click.native="contextViewInExternal('google', contextData)">
        <i class="fab fa-google fa-fw pointer pr-4"></i>
        View area in Google Maps
      </ContextMenuItem>
      <ContextMenuItem @click.native="contextViewInExternal('naturalatlas', contextData)">
        <i class="fas fa-atlas fa-fw pointer pr-4"></i>
        View area in Natural Atlas
      </ContextMenuItem>
      <div class="border-bottom w-100"></div>
      <ContextMenuItem @click.native="contextClearSearch">
        <i class="fas fa-times fa-fw pointer pr-4"></i>
        Clear search
      </ContextMenuItem>
      </template>
    </ContextMenu>

    <!-- CONTEXT MYITEMS -->

    <ContextMenu ref="contextMyItems" >
    <template v-slot:default="{ contextData }">
      <ContextMenuItem @click.native="contextMyItemsEditMyItem(contextData)">
        <i class="fas fa-pen fa-fw pointer pr-4"></i>
        Edit
      </ContextMenuItem>
      <ContextMenuItem @click.native="contextMyItemsCut(contextData)">
        <i class="fas fa-copy fa-fw pointer pr-4"></i>
        Cut
      </ContextMenuItem>
      <ContextMenuItem @click.native="contextMyItemsDeleteMyItem(contextData)">
        <i class="fas fa-trash fa-fw pointer pr-4"></i>
        Delete
      </ContextMenuItem>
      <div class="border-bottom w-100"></div>
      <ContextMenuItem @click.native="contextViewInExternal('google', contextData)">
        <i class="fab fa-google fa-fw pointer pr-4"></i>
        View area in Google Maps
      </ContextMenuItem>
      <ContextMenuItem @click.native="contextViewInExternal('naturalatlas', contextData)">
        <i class="fas fa-atlas fa-fw pointer pr-4"></i>
        View area in Natural Atlas
      </ContextMenuItem>
      <div class="border-bottom w-100"></div>
      <ContextMenuItem @click.native="contextClearSearch">
        <i class="fas fa-times fa-fw pointer pr-4"></i>
        Clear search
      </ContextMenuItem>
    </template>
    </ContextMenu>

    <!-- CONTEXT MYITEMS SIDEBAR -->

    <ContextMenu ref="contextMyItemsSidebar" >
    <template v-slot:default="{ contextData }">
      <ContextMenuItem @click.native="contextMyItemsEditMyItem(contextData)">
        <i class="fas fa-pen fa-fw pointer pr-4"></i>
        Edit
      </ContextMenuItem>
      <ContextMenuItem @click.native="contextMyItemsDeleteMyItem(contextData)">
        <i class="fas fa-trash fa-fw pointer pr-4"></i>
        Delete
      </ContextMenuItem>
      <div class="border-bottom w-100"></div>
      <ContextMenuItem @click.native="contextMyItemsMoveToTop(contextData)">
        <i class="fas fa-arrow-up fa-fw pointer pr-4"></i>
        Move to top
      </ContextMenuItem>
      <ContextMenuItem @click.native="contextMyItemsMoveToBottom(contextData)">
        <i class="fas fa-arrow-down fa-fw pointer pr-4"></i>
        Move to bottom
      </ContextMenuItem>
      <div class="border-bottom w-100"></div>
      <ContextMenuItem @click.native="contextViewInExternal('google', contextData)">
        <i class="fab fa-google fa-fw pointer pr-4"></i>
        View area in Google Maps
      </ContextMenuItem>
      <ContextMenuItem @click.native="contextViewInExternal('naturalatlas', contextData)">
        <i class="fas fa-atlas fa-fw pointer pr-4"></i>
        View area in Natural Atlas
      </ContextMenuItem>
      <div class="border-bottom w-100"></div>
      <ContextMenuItem @click.native="contextClearSearch">
        <i class="fas fa-times fa-fw pointer pr-4"></i>
        Clear search
      </ContextMenuItem>
    </template>
    </ContextMenu>

    <!-- CONTEXT SEARCH -->

    <ContextMenu ref="contextSearch" >
    <template v-slot:default="{ contextData }">
      <ContextMenuItem @click.native="contextAddToMyItems(contextData)">
        <i class="fas fa-map-marker-alt fa-fw pointer pr-4"></i>
        Add to My Items
      </ContextMenuItem>
      <div class="border-bottom w-100"></div>
      <ContextMenuItem @click.native="contextViewInExternal('google', contextData)">
        <i class="fab fa-google fa-fw pointer pr-4"></i>
        View area in Google Maps
      </ContextMenuItem>
      <ContextMenuItem @click.native="contextViewInExternal('naturalatlas', contextData)">
        <i class="fas fa-atlas fa-fw pointer pr-4"></i>
        View area in Natural Atlas
      </ContextMenuItem>
      <div class="border-bottom w-100"></div>
      <ContextMenuItem @click.native="contextClearSearch">
        <i class="fas fa-times fa-fw pointer pr-4"></i>
        Clear search
      </ContextMenuItem>
    </template>
    </ContextMenu>

    <!-- CONTEXT HOTSPRINGS -->

    <ContextMenu ref="contextHotsprings" >
    <template v-slot:default="{ contextData }">
      <ContextMenuItem @click.native="contextHotspringsAddToMyItems(contextData)">
        <i class="fas fa-map-marker-alt fa-fw pointer pr-4"></i>
        Add to My Items
      </ContextMenuItem>
      <div class="border-bottom w-100"></div>
      <ContextMenuItem @click.native="contextViewInExternal('google', contextData)">
        <i class="fab fa-google fa-fw pointer pr-4"></i>
        View area in Google Maps
      </ContextMenuItem>
      <ContextMenuItem @click.native="contextViewInExternal('naturalatlas', contextData)">
        <i class="fas fa-atlas fa-fw pointer pr-4"></i>
        View area in Natural Atlas
      </ContextMenuItem>
      <div class="border-bottom w-100"></div>
      <ContextMenuItem @click.native="contextClearSearch">
        <i class="fas fa-times fa-fw pointer pr-4"></i>
        Clear search
      </ContextMenuItem>
    </template>
    </ContextMenu>
  </div>
</template>

<script>
import L from "leaflet"
import * as esri from "esri-leaflet"
import { LeafletIcons } from "../leaflet-color-markers.js"
import { Icons } from "../leaflet-color-markers.js"
import Papa from "papaparse"

import $ from "jquery"

import { config } from "../config.js"
import { tools } from "../tools.js"
import { map } from "../map.js"

import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

import VSidebar from "./VComponents/VSidebar.vue"
import VModal from "./VComponents/VModal.vue"
import ContextMenu from './VComponents/ContextMenu'
import ContextMenuItem from './VComponents/ContextMenuItem'
import Alert from './Alert.vue'
import MapNavbar from './MapNavbar.vue'
import MapBaseSidebarMyItems from "./MapBaseSidebarMarker.vue"
import MapBaseSidebarSearch from "./MapBaseSidebarSearch.vue"
import MapSidebarSettings from './MapSidebarSettings.vue'
import MapSidebarMaps from "./MapSidebarMaps.vue"
import MapBaseControl from "./MapBaseControl.vue"
import Map from "./Map.vue"

let saveTimer = null;

export default {
  name: "MapBase",
  components: {
    VSidebar,
    VModal,
    ContextMenu,
    ContextMenuItem,
    Alert,
    MapBaseControl,
    MapNavbar,
    MapBaseSidebarMyItems,
    MapBaseSidebarSearch,
    MapSidebarSettings,
    MapSidebarMaps,
    Map,
  },
  data() {
    return {
      icons: Icons,
      activeSidebar: 0,
      isMyItemsSidebarVisible: false,
      isSearchSidebarVisible: false,
      isSettingsSidebarVisible: false,
      isMapsSidebarVisible: false,
      activeMyItem: null,
      editedMyItem: {
        name: "",
        text: "",
        color: "green",
        lat: 0,
        lon: 0
      },
      isMyItemsMarkersVisible: true,
      isSearchMarkersVisible: true,
      isMarkedAreaVisible: true,
      filterMyItems: "",
      clipboard: null,
    };
  },
  computed: {
    ...mapState({
      mapMyItems: 'mapMyItems',
      mapSearchItems: 'mapSearchItems',
      alertMessages: 'alertMessages',
    }),
    ...mapGetters({
      filteredMapSearchItems: 'filteredMapSearchItems',
      filteredMapMyItems: 'filteredMapMyItems',
    })
  },
  mounted: function() {
    this.loadMyItems();
    this.loadMarkedArea();

    window.onresize = e => {
      this.handleResizeWindow();
    }
  },
  methods: {
    handleResizeWindow() {
      map.map.invalidateSize()
      this.$refs.map.updateMapContainerHeight();
      for (let c of this.$children) {
        if (c.handleResizeWindow && typeof c.handleResizeWindow == 'function') {
          c.handleResizeWindow();
        }
      }
    },
    findMyItemByMarker(marker) {
      return this.mapMyItems.find(f => f.marker == marker);
    },
    getMyItemIndex(myItem) {
      return this.mapMyItems.indexOf(myItem)
    },
    findSearchItemByMarker(marker) {
      return this.mapSearchItems.find(f => f.marker == marker);
    },

    // MARKED AREA

    markArea() {
      let bounds = map.map.getBounds();

      let envelopeGeoJSON = map.boundsToPolygon(bounds);
      map.unionMarkedWithPolygon(envelopeGeoJSON);      

      if (map.polygonMap) {
        map.polygonMap.remove();
      }

      map.polygonMap = L.geoJSON(map.rect, {
        style: function (feature) {
          return {color: 'red'};
        }
      }).addTo(map.map)

      if (saveTimer) {
        clearTimeout(saveTimer);
      }
      saveTimer = setTimeout(this.saveMarkedArea, config.saveTime);
      this.$store.state.savedMarkedArea = false;
    },
    unmarkArea() {
      if (!map.rect) {
        return
      }

      let bounds = map.map.getBounds();

      let envelopeGeoJSON = map.boundsToPolygon(bounds);
      map.differenceMarkedWithPolygon(envelopeGeoJSON);     

      if (map.polygonMap) {
        map.polygonMap.remove();
      }

      map.polygonMap = L.geoJSON(map.rect, {
        style: function (feature) {
          return {color: 'red'};
        }
      }).addTo(map.map)

      if (saveTimer) {
        clearTimeout(saveTimer);
      }
      saveTimer = setTimeout(this.saveMarkedArea, config.saveTime);
      this.$store.state.savedMarkedArea = false;
    },
    markAreaUndo() {
      map.undo();

      if (map.polygonMap) {
        map.polygonMap.remove();
      }

      map.polygonMap = L.geoJSON(map.rect, {
        style: function (feature) {
          return {color: 'red'};
        }
      }).addTo(map.map)

      if (saveTimer) {
        clearTimeout(saveTimer);
      }
      saveTimer = setTimeout(this.saveMarkedArea, config.saveTime);
      this.$store.state.savedMarkedArea = false;
    },
    saveMarkedArea() {
      localStorage.setItem("markedArea", JSON.stringify(map.rect));
      saveTimer = null;
      this.$store.state.savedMarkedArea = true;
    },
    loadMarkedArea() {
      let m = localStorage.getItem("markedArea");
      if (m) {
        if (map.polygonMap) {
          map.polygonMap.remove();
        }

        map.rect = JSON.parse(m);

        map.polygonMap = L.geoJSON(map.rect, {
          style: function (feature) {
            return {color: 'red'};
          }
        }).addTo(map.map)
      }
    },
    handleImportedMarkedArea() {
      this.loadMarkedArea();
    },

    // MAP

    handleMapCreated() {
      map.map.on("contextmenu", event => {
        this.$refs.contextMap.open(event.originalEvent, event.latlng)
      });
      map.map.on("movestart zoomlevelschange", event => {
        this.$refs.contextMap.close();
      });
      map.map.on("keyup", event => {
        if (event.originalEvent.key == '1') {
          map.map.setZoom(map.map.getMaxZoom())
        }
        if (event.originalEvent.key == '2') {
          map.map.setZoom(map.map.getMaxZoom() - 1)
        }
        if (event.originalEvent.key == '3') {
          map.map.setZoom(map.map.getMaxZoom() - 2)
        }
        if (event.originalEvent.key == ' ') {
          this.markArea();
        }
      })
    },

    // MY MARKERS

    backupMyItems() {
      try {
        let backup = localStorage.getItem("savedFeatures");
        if (backup) {
          localStorage.setItem("savedFeatures-backup", backup); 
          console.log("Backup saved");
        }
      }
      catch (error) {
        console.log(error)
      }
    },
    saveMyItems() {
      this.backupMyItems();

      localStorage.setItem(
        "savedFeatures",
        JSON.stringify(this.mapMyItems, [
          "name",
          "text",
          "color",
          "lat",
          "lon"
        ])
      );
    },
    loadMyItems() {
      if (!localStorage.getItem("savedFeatures")) return;

      try {
        let myItems = JSON.parse(localStorage.getItem("savedFeatures"));
        this.$store.commit("loadMapMyItems", { data: myItems });

        this.updateMyItems();

        this.$store.dispatch('addMessage', { 
          text: `Loaded ${this.mapMyItems.length} My markers.`,
          type: "success"
        });
      }
      catch (error) {
        console.log(error)
      }
    },
    updateMyItems() {
      if (map.layerMyItems) {
        map.layerMyItems.clearLayers();
      }

      let markers = [];

      for (let i of this.filteredMapMyItems(this.filterMyItems)) {
        let m = this.addMyItemMarker(i);
        i.marker = m;
        markers.push(m);
      }

      map.layerMyItems = L.layerGroup(markers);
      if (this.isMyItemsMarkersVisible) {
        map.layerMyItems.addTo(map.map);
      }
    },
    addMyItem(latlng, text) {

      if (!this.isMyItemsMarkersVisible) {
        this.toggleMyItemsMarkersVisibility();
      }

      let myItem = {
        name: "",
        text: text || "",
        color: "green",
        lat: latlng.lat,
        lon: latlng.lng
      };

      this.$store.commit("addMyItem", myItem);
      this.saveMyItems();
      this.updateMyItems();
    },
    addMyItemMarker(i) {
      let text = this.$options.filters.toHtml(i.text);
      let popup = `<b>${text || "New Marker"}</b>
        <br><br>
        <span class="text-muted">
        ${i.lat.toFixed(4)}, ${i.lon.toFixed(4)}
        </span>`;

      let marker = L.marker([i.lat, i.lon], {
        icon: LeafletIcons[i.color]
      }).bindPopup(popup, { autoPan: false });

      marker.on("mouseover", function(e) {
        this.openPopup();
      });
      marker.on("mouseout", function(e) {
        this.closePopup();
      });
      marker.on("contextmenu", e => {
        let myItem = this.findMyItemByMarker(e.target);
        this.$refs.contextMyItems.open(e.originalEvent, myItem);
      });
      marker.on("click", e => {
        let myItem = this.findMyItemByMarker(marker);
        this.editMyItem(myItem);
      });

      return marker;
    },
    deleteMyItem(myItem) {
      // fix commit
      let index = this.getMyItemIndex(myItem);
      this.mapMyItems.splice(index, 1);

      this.saveMyItems();
      this.updateMyItems();

      let message = `Deleted 1 item: ${myItem.text || 'New Marker'}`;
      this.$store.dispatch('addMessage', { text: message, type: 'warning' });
    },
    editMyItem(myItem) {
      this.activeMyItem = myItem;
      Object.assign(this.editedMyItem, this.activeMyItem);
      $("#modalEditMyItem").modal("show");
    },
    handleMyItemsFilterUpdate(filter) {
      this.filterMyItems = filter;
      this.updateMyItems();
    },
    handleImportedMyItems() {
      this.loadMyItems();
    },

    // SEARCH

    updateSearchItems() {
      if (map.layerSearchItems) {
        map.layerSearchItems.clearLayers();
      }

      let markers = [];

      for (let i of this.filteredMapSearchItems) {
        let m = this.addSearchItemMarker(i);
        i.marker = m;
        markers.push(m);
      }
      map.layerSearchItems = L.layerGroup(markers);

      if (!this.isSearchMarkersVisible) {
        this.toggleSearchMarkersVisibility();
      }
      map.layerSearchItems.addTo(map.map);
    },
    addSearchItemMarker(i) {
      let popup = `<b>${i.Name}</b><br>
        ${i.County}<br>
        ${i.Category}<br><br>
        <span class="text-muted">
        ${i.Lat},${i.Lon}
        </span>`;

      let marker = L.marker([i.Lat, i.Lon], {
        icon: LeafletIcons.blue
      }).bindPopup(popup, { autoPan: false });

      marker.on("mouseover", function(e) {
        this.openPopup();
      });
      marker.on("mouseout", function(e) {
        this.closePopup();
      });
      marker.on("contextmenu", e => {
        let searchItem = this.findSearchItemByMarker(e.target);
        this.$refs.contextSearch.open(e.originalEvent, searchItem);
      });

      return marker;
    },
    handleSearchFilterUpdate() {
      // fix remove single items
      this.updateSearchItems();
    },
    handleSearch() {
      this.updateSearchItems();
      map.map.setView(
        config.defaultMapView.center,
        config.defaultMapView.zoom
      );
    },

    // SIDEBAR

    toggleSidebar(index) {
      if (index == 1) {
        this.isSearchSidebarVisible = false;
        this.isSettingsSidebarVisible = false;
        this.isMapsSidebarVisible = false;
        this.isLayerSidebarVisible = false;
        this.isMyItemsSidebarVisible = !this.isMyItemsSidebarVisible;
      } 
      else if (index == 2) {
        this.isSettingsSidebarVisible = false;
        this.isMyItemsSidebarVisible = false;
        this.isMapsSidebarVisible = false;
        this.isLayerSidebarVisible = false;
        this.isSearchSidebarVisible = !this.isSearchSidebarVisible;
      }
      else if (index == 3) {
        this.isSearchSidebarVisible = false;
        this.isMyItemsSidebarVisible = false;
        this.isSettingsSidebarVisible = false;
        this.isMapsSidebarVisible = false;
        this.isLayerSidebarVisible = !this.isLayerSidebarVisible;
      }
      else if (index == 4) {
        this.isSearchSidebarVisible = false;
        this.isMyItemsSidebarVisible = false;
        this.isSettingsSidebarVisible = false;
        this.isLayerSidebarVisible = false;
        this.isMapsSidebarVisible = !this.isMapsSidebarVisible;
      }
      else if (index == 5) {
        this.isSearchSidebarVisible = false;
        this.isMyItemsSidebarVisible = false;
        this.isMapsSidebarVisible = false;
        this.isLayerSidebarVisible = false;
        this.isSettingsSidebarVisible = !this.isSettingsSidebarVisible;
      }
      this.activeSidebar = this.activeSidebar == index ? 0 : index;

      this.$nextTick(
        function() {
          map.map.invalidateSize()
        }
      )
    },
    clickSidebarMyItem(m) {
      map.map.setView([m.lat, m.lon], 14);
    },
    clickSidebarSearchItem(m) {
      map.map.setView([m.Lat, m.Lon], 14);
    },
    clickSidebarEditMyItem(m) {
      this.editMyItem(m);
    },
    handleMouseenterSearchItem(searchItem) {
      let latlng = searchItem.marker.getLatLng();
      if(map.map.getBounds().contains(latlng)) {
        searchItem.marker.openPopup();
      }
    },
    handleMouseleaveSearchItem(searchItem) {
      searchItem.marker.closePopup();
    },
    handleMouseenterMyItem(myItem) {
      let latlng = myItem.marker.getLatLng();
      if(map.map.getBounds().contains(latlng)) {
        myItem.marker.openPopup();
      }
    },
    handleMouseleaveMyItem(myItem) {
      myItem.marker.closePopup();
    },

    // MODAL EDIT

    editSaveItem() {
      Object.assign(this.activeMyItem, this.editedMyItem);

      this.saveMyItems();
      this.updateMyItems();
    },
    editDeleteItem() {
      this.deleteMyItem(this.activeMyItem);
    },

    // MAP CONTROL

    toggleMyItemsMarkersVisibility() {
      this.isMyItemsMarkersVisible = !this.isMyItemsMarkersVisible;

      if (!map.layerMyItems) return;

      if (!this.isMyItemsMarkersVisible) {
        map.layerMyItems.remove();
      }
      else {
        map.layerMyItems.addTo(map.map);
      }
    },
    toggleSearchMarkersVisibility() {
      this.isSearchMarkersVisible = !this.isSearchMarkersVisible;

      if (!map.layerSearchItems) return;

      if (!this.isSearchMarkersVisible) {
        map.layerSearchItems.remove();
      }
      else {
        map.layerSearchItems.addTo(map.map);
      }
    },
    toggleMarkedAreaVisibility() {
      this.isMarkedAreaVisible = !this.isMarkedAreaVisible;

      if (!map.polygonMap) return;

      if (!this.isMarkedAreaVisible) {
        map.polygonMap.remove();
      }
      else {
        map.polygonMap.addTo(map.map);
      }
    },
    showMap() {
      map.map.setView(
        config.defaultMapView.center,
        config.defaultMapView.zoom
      );
    },

    // CONTEXT

    contextClearSearch() {
      if (this.$refs.mapSidebarSearch) {
        this.$refs.mapSidebarSearch.reset();
        this.$refs.mapSidebarSearch.searchString = "";
        this.updateSearchItems();
      }
    },
    contextViewInExternal(map, latlng) {
      let url = null;

      let lat = latlng.lat || latlng.Lat;
      let lon = latlng.lon || latlng.lng || latlng.Lon;

      if (map == "google") {
        let mapGoogleQuery = {
          basemap: "roadmap",
          center: `${lat},${lon}`,
          zoom: config.external.google.zoom,
        };
        url = tools.createUrl(config.external.google.url, mapGoogleQuery);
      }
      else if (map == "naturalatlas") {
        url = `${config.external.NA.url}${lat},${lon},12z`;
      }

      window.open(url);
    },

    // CONTEXT MAP

    contextMapAddMyItem(data) {
      this.addMyItem(data);
    },
    contextMapPaste(latlng) {
      if (!this.clipboard) {
        return
      }

      let myItem = this.clipboard;
      myItem.lat = latlng.lat;
      myItem.lon = latlng.lng;
      this.saveMyItems();
      this.updateMyItems();

      this.clipboard = null;
    },
    contextZoom(latlng) {
      let lat = latlng.lat || latlng.Lat;
      let lon = latlng.lon || latlng.lng || latlng.Lon;
      map.map.setView({lat, lon}, map.map.getMaxZoom());
    },

    // CONTEXT HOTSPRINGS

    openContextHotsprings(context) {
      this.$refs.openContextHotsprings.open(context.event, context.hotspring);
    },
    contextHotspringsAddToMyItems(hotspring) {
      let text = `${hotspring.name}, ${hotspring.state}`
      let latlng = {
        lat: hotspring.lat,
        lng: hotspring.lon,
      }
      this.addMyItem(latlng, text);

      let message = `Added ${hotspring.name} to My Markers.`;
      this.$store.dispatch("addMessage", { text: message, type: "success" });
    },

    // CONTEXT MYITEMS

    openContextMyItems(context) {
      this.$refs.contextMyItemsSidebar.open(context.event, context.myItem);
    },
    contextMyItemsEditMyItem(myItem) {
      this.editMyItem(myItem);
    },
    contextMyItemsDeleteMyItem(myItem) {
      this.deleteMyItem(myItem);
    },
    contextMyItemsCut(myItem) {
      this.clipboard = myItem;
    },
    contextMyItemsMoveToTop(myItem) {
      let i = this.getMyItemIndex(myItem)
      this.mapMyItems.splice(i, 1);
      this.mapMyItems.unshift(myItem);
      this.saveMyItems();
    },
    contextMyItemsMoveToBottom(myItem) {
      let i = this.getMyItemIndex(myItem)
      this.mapMyItems.splice(i, 1);
      this.mapMyItems.push(myItem);
      this.saveMyItems();
    },

    // CONTEXT SEARCH

    openContextSearch(context) {
      this.$refs.contextSearch.open(context.event, context.searchItem);
    },
    contextAddToMyItems(searchItem) {
      let text = `${searchItem.Name}, ${searchItem.State}\n${searchItem.Category}`
      let latlng = {
        lat: searchItem.Lat,
        lng: searchItem.Lon,
      }
      this.addMyItem(latlng, text);

      let message = `Added ${searchItem.Name} to My Markers.`;
      this.$store.dispatch("addMessage", { text: message, type: "success" });
    },
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
