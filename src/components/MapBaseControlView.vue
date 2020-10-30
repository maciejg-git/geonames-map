<template>
  <div ref="mapControls" class="d-flex flex-column align-items-center mapControls">
    <div @click="toggleMarkerVisibility" class="pointer" :class="{ 'map-control-active': !markerVisibility }">
      <i class="far fa-square fa-fw fa-4x my-1 mx-1"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapBaseControl',
  props: {
    markerVisibility: Boolean,
    searchMarkerVisibility: Boolean,
  },
  data() {
    return {}
  },
  mounted: function() {},
  computed: {},
  methods: {
    toggleMarkerVisibility() {
      this.$emit("toggle-marker-visibility");
    },
    toggleSearchMarkerVisibility() {
      this.$emit("toggle-search-marker-visibility");
    },
  }
}
</script>

<style scoped>
.mapControls {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #f3f3f3;
  z-index: 8000;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.65);
  overflow: hidden;
}
.map-control-active {
  /* background-color: blue; */
  color: #b9b9b9;
}
.map-control {
  width: 30px;
}
</style>
