<template>
  <div class="d-flex flex-row align-items-center mapControls">

    <!-- MARK -->

    <div ref="mapControls" class="d-flex flex-row align-items-center map-control">
      <div 
        @click="markBounds" 
        class="pointer" 
        v-tooltip-delay:top="'Mark visible area'"
        >
        <i
          class="fas fa-square fa-fw fa-2x my-2 mx-2"
          :class="{ 'map-control-active': !markedAreaVisibility }"
        ></i>
      </div>
      <div 
        @click="unmarkBounds" 
        class="pointer" 
        v-tooltip-delay:top="'Mark visible area'"
        >
        <i
          class="far fa-square fa-fw fa-2x my-2 mx-2"
          :class="{ 'map-control-active': !markedAreaVisibility }"
        ></i>
      </div>
      <div 
        @click="markAreaUndo" 
        class="pointer" 
        v-tooltip-delay:top="'Undo mark'"
        >
        <i
          class="fas fa-undo fa-fw fa-2x my-2 mx-2"
          :class="{ 'map-control-active': !markedAreaVisibility }"
        ></i>
      </div>
    </div>

    <!-- SHOW -->

    <div ref="mapControls" class="d-flex flex-row align-items-center mx-2 map-control">
      <div 
        @click="showMap" 
        class="pointer" 
        v-tooltip-delay:top="'Fit to view'"
        >
        <i class="fas fa-expand fa-fw fa-2x my-2 mx-2"></i> 
      </div>
    </div>

    <!-- VISIBLITY -->

    <div ref="mapControls" class="d-flex flex-row align-items-center map-control">
      <div 
        @click="toggleMarkerVisibility" 
        class="pointer" 
        :class="{ 'map-control-active': !myItemsMarkerVisibility }"
        v-tooltip-delay:top="'Toggle My items markers'"
        >
        <i
          class="fas fa-map-marker-alt fa-fw fa-2x my-2 mx-2"
        ></i>
      </div>
      <div 
        class="pointer border-left" 
        :class="{ 'map-control-active': !searchMarkerVisibility }"
        v-tooltip-delay:top="'Toggle Search markers'"
        >
        <i 
           @click="toggleSearchMarkerVisibility"
           class="fas fa-search fa-fw fa-2x my-2 mx-2 "
         ></i>
      </div>  
      <div 
        class="pointer border-left" 
        :class="{ 'map-control-active': !markedAreaVisibility }"
        v-tooltip-delay:top="'Toggle Marked area'"
        >
        <i 
           @click="toggleMarkedAreaVisibility"
           class="fas fa-square fa-fw fa-2x my-2 mx-2 "
         ></i>
      </div>  
    </div>

  </div>
</template>

<script>
export default {
  name: 'MapBaseControl',
  props: {
    myItemsMarkerVisibility: Boolean,
    searchMarkerVisibility: Boolean,
    markedAreaVisibility: Boolean,
  },
  data() {
    return {
    }
  },
  methods: {
    toggleMarkerVisibility() {
      this.$emit("toggle-my-items-marker-visibility");
    },
    toggleSearchMarkerVisibility() {
      this.$emit("toggle-search-marker-visibility");
    },
    toggleMarkedAreaVisibility() {
      this.$emit("toggle-marked-area-visibility");
    },
    showMap() {
      this.$emit("show-map");
    },
    markBounds() {
      if (!this.markedAreaVisibility) {
        return
      }
      this.$emit("mark-bounds");
    },
    unmarkBounds() {
      if (!this.markedAreaVisibility) {
        return
      }
      this.$emit("unmark-bounds");
    },
    markAreaUndo() {
      if (!this.markedAreaVisibility) {
        return
      }
      this.$emit("mark-undo");
    }
  }
}
</script>

<style scoped>
.mapControls {
  position: absolute;
  bottom: 10px;
  transform: translateX(-50%);
  left: 50%;
  z-index: 500;
}
.map-control-active {
  color: #b9b9b9;
}
.map-control {
  background-color: #f3f3f3;
  box-shadow: 0 1px 5px rgba(0,0,0,0.65);
  border-radius: 4px;
  overflow: hidden;
}
</style>
