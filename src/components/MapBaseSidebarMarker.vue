<template>
    <div class="w-100">
        
    <!-- FILTER -->
    
      <form v-on:keydown.enter.prevent class="w-100">
        <div class="form-group">
          <input 
            ref="filterInput"
            :value="filter" 
            @input="setFilter" 
            type="search" 
            class="form-control shadow-none" 
            placeholder="Filter features"
            >
        </div>
      </form>
      <div v-if="!mapMyItems.length">
        No saved markers found. Add marker by clicking right button on the map.
      </div>
      
      <!-- MARKER LIST -->
      
      <ul v-else class="list-no-padding w-100">
        <transition-group name="list" tag="p">
        <li v-for="(m, index) in filteredMapMyItems(filter)" 
            @contextmenu.prevent="contextMenu($event, m)"
            @mouseenter="$emit('mouseenter', m)"
            @mouseleave="$emit('mouseleave', m)"
            class="border-bottom list-item"
            :key="index"
            >
          <!-- ROW -->
          <div class="row no-gutters pointer pt-2" :class="{ active : activeMyItem == index }">
            <div class="col-auto">

              <img 
                 @click.prevent="clickMyItem(m, index)"
                 :src="icons.all[m.color].image"
                 class="image-scale-down"
                 alt
                 />
            </div>
            <div @click.prevent="clickMyItem(m, index)" class="col ml-2">

              <!-- ITEM -->

              <div v-if="!$parent.view">
                <div class="pb-2">
                  <p style="" v-html="$options.filters.toHtmlMark(filter, m.text) || 'New Marker'">
                  </p>
                  <span class="small text-muted">
                    {{ m.lat.toFixed(4) }}, {{ m.lon.toFixed(4) }}
                  </span>
                </div>
              </div>

              <!-- ITEM COMPACT -->

              <div v-if="$parent.view">
                <p class="small" v-html="$options.filters.toHtmlMark(filter, m.text) || 'New Marker'">
                </p>
              </div>

            </div>
          </div>
          <!-- END ROW -->
        </li>
        </transition-group>
      </ul>
    </div>
</template>

<script>
import { Icons } from "../leaflet-color-markers.js"
import { debounce } from "lodash"
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

import { config } from "../config.js"

export default {
  name: 'MapBaseSidebarMarker',
  props: {
    isVisible: Boolean,
  },
  data() {
    return {
      icons: Icons,
      filter: "",
      activeMyItem: null,
    }
  },
  computed: {
    ...mapState({
      mapMyItems: 'mapMyItems',
    }),
    ...mapGetters({
      filteredMapMyItems: 'filteredMapMyItems',
    })
  },
  filters: {
    toHtmlMark: function(filter, value) {
      let html = value.replace(/(?:\r\n|\r|\n)/g, '<br>');

      if (filter.length < 2) return html;

      let regexp = new RegExp(filter, "i")
      return html.replace(regexp, match => { 
        if (!match) {
          return ""
        } 
        else {
          return "<span class='mark-no-padding'>" + match + "</span>"; 
        }
      })
    },
  },
  watch: {
    filter: function() {
      this.$emit("update-filter", this.filter);
    },
    isVisible: function(value) {
      if (value) {
        this.$refs.filterInput.focus();
      }
    }
  },
  methods: {
    clickMyItem(m, index) {
      this.$emit("click-my-item", m);
      this.activeMyItem = index;
    },
    contextMenu(event, myItem) {
      this.$emit("open-context", { event, myItem })
    },
    setFilter: debounce(function(event) {
      this.filter = event.target.value;
    }, config.debounceInputTime)
  }
}
</script>

<style scoped>
li:hover {
  text-decoration: underline;
}
.active {
  background-color: #ededed;
}
.list-enter-active {
  transition: all .3s ease;
}
.list-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.list-enter {
  transform: translateX(-10px);
  opacity: 0;
}
.list-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
