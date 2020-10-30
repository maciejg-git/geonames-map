<template>
  <div 
    ref="map" 
    id="mapbase" 
    class="bg-light"
    >
  </div>
</template>

<script>
import { map } from "../map.js"

import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'Map',
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      mapName: 'map',
      mapOverlay: 'mapOverlay',
      mapOverlayOpacity: 'mapOverlayOpacity',
    }),
  },
  mounted: function() {
    this.updateMapContainerHeight();
    map.init();
    this.$emit("map-created");
  },
  watch: {
    mapName: function(value) {
      map.setMap(value, this.mapOverlay);
    },
    mapOverlay: function(value) {
      map.setMapOverlay(value);
    },
    mapOverlayOpacity: function(value) {
      map.setMapOverlayOpacity(value);
    },
  },
  methods: {
    updateMapContainerHeight() {
      this.$refs.map.style.height =
        window.innerHeight - this.$var.navbarHeight - this.$var.mapNavbarHeight + "px";
    },
  }
}
</script>

<style scoped>
</style>
