<template>
  <div>
    <div class="card">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li v-for="(tab, index) in tabs" class="nav-item" :key="index">
            <a
            	v-if="tab.$attrs.show"
              @click.prevent="activePanel = index"
              class="nav-link"
              :class="{active: tab.active}"
              href="#"
            >
              <div v-if="tab.$attrs.add" class="spinner-border spinner-border-sm" role="status">
                <span class="sr-only">Loading...</span>
              </div>
              {{ tab.$attrs.name }}
            </a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VPanel",
  components: {},
  model: {
    prop: "value",
    event: "input"
  },
  props: {
		value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tabs: [],
      activePanel: 0
    };
  },
  watch: {
    activePanel: function(newValue, oldValue) {
      this.tabs[newValue].active = true;
      this.tabs[oldValue].active = false;
      this.$emit("input", newValue, oldValue);
    },
    value: function(newValue, oldValue) {
    	this.activePanel = newValue;
    }
  },
  mounted: function() {},
  created: function() {
		this.$on("addtab", (tab) => {
      this.tabs.push(tab);
      this.tabs[0].active = true;
    })
		this.$on("deletetab", (tab) => {
			let index = this.tabs.indexOf(tab);
			if (index !== -1) {
				this.tabs.splice(index, 1);
			}
    })
  },
  computed: {},
	methods: {},
};
</script>

<style scoped>
</style>
