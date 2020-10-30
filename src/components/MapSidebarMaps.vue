<template>
  <div class="w-100">
    <ul class="list-unstyled">
      <li
        v-for="(m, key, index) in maps" 
        @click="setMap(key)"
        :class="{'menu-active-grey': $store.state.map == key}"
        class="pointer menu-hover py-2 pl-1"
        >
        {{ m.name }}
      </li>
    </ul>
    <hr class="my-4">
    <div class="form-check pl-0 pb-3">
      <h6 class="font-weight-bold">
        Overlay map
      </h6>
    </div>
    <div class="form-group">
      <label class="small" for="formControlRange">Opacity</label>
      <input 
         v-model="mapOverlayOpacity" 
         type="range" 
         class="form-control-range" 
         id="formControlRange"
         >
    </div>
    <ul class="list-unstyled">
      <li
        @click="setMapOverlay(null)"
        :class="{'menu-active-grey': $store.state.mapOverlay == null}"
        class="pointer menu-hover py-2 pl-1"
        >
        None
      </li>
      <li
        v-for="(m, key, index) in maps" 
        @click="setMapOverlay(key)"
        :class="{'menu-active-grey': $store.state.mapOverlay == key}"
        class="pointer menu-hover py-2 pl-1"
        >
        {{ m.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { Icons } from "../leaflet-color-markers.js"

import { tools } from "../tools.js"
import { config } from "../config.js"

export default {
  name: 'MapSidebarSettings',
  data() {
    return {
      maps: config.maps,
    }
  },
  computed: {
    mapOverlayOpacity: {
      get () {
        return this.$store.state.mapOverlayOpacity;
      },
      set (value) {
        this.$store.commit('setMapOverlayOpacity', value);
      }
    },
  },
  methods: {
    setMap(map) {
      this.$store.commit("setMap", map);
    },
    setMapOverlay(map) {
      this.$store.commit("setMapOverlay", map);
    },
  }
}
</script>

<style scoped>
.menu-hover:hover {
  background-color: #efefef;
  color: #000000 !important;
}
</style>
