<template>
	<div class="w-100">

		<div class="form-check mb-4">
			<div>
				<input v-model="$store.state.isLayerHotspringsVisible" class="form-check-input" type="checkbox" value="" id="layer-hotsprings-checkbox">
				<label class="form-check-label" for="layer-hotsprings-checkbox">
					Hot Springs
				</label>
			</div>
		</div>

		<div v-if="$store.state.isLayerHotspringsVisible">
			<h6>Hot Springs</h6>
			
			<ul class="list-no-padding w-100">
				<transition-group name="list" tag="p">
					<li v-for="(i, index) in items" 
						@contextmenu.prevent="contextMenu($event, i)"
						@mouseenter="$emit('mouseenter', i)"
						@mouseleave="$emit('mouseleave', i)"
						class="border-bottom list-item"
						:key="index"
						>

						<!-- ROW -->

						<div class="row no-gutters pointer pt-2" :class="{ active : activeItem == index }">
							<div class="col-auto">
			
								<img 
									 @click.prevent="clickHotspring(i, index)"
									 :src="icons.waves.image"
									 class="image-scale-down"
									 style="fill: 'red'"
									 alt
									 />
							</div>
							<div @click.prevent="clickHotspring(i, index)" class="col ml-2">
			
								<!-- ITEM -->
			
								<div class="pb-2">
									<!-- <p v&#45;html="$options.filters.toHtmlMark(filter, m.text) || 'New Marker'"> -->
									<!-- </p> -->
									<span class="small">
										{{ i.name }}, <span class="font-weight-bold">{{ i.state }}</span>
									</span>
									<br>
									<span class="small text-muted">
										{{ i.lat }}, {{ i.lon }}
									</span>
								</div>
			
							</div>
						</div>
						<!-- END ROW -->
					</li>
				</transition-group>
			</ul>
		</div>

		<!-- SEARCH -->

	</div>
</template>

<script>
import { Icons } from "../leaflet-color-markers.js"
import { debounce } from "lodash"
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

import { tools } from "../tools.js"
import { config } from "../config.js"

export default {
	name: 'MapBaseSidebarSearch',
	props: {
		items: Array,
	},
	data() {
		return {
			icons: Icons,
			activeItem: null,
		}
	},
	computed: {
		...mapState({
			mapIsLoading: 'mapIsLoading',
		}),
		...mapGetters({
		})
	},
	filters: {
		toHtmlMark: function(filter, value) {
			if (filter.length < 2) return value;

			let regexp = new RegExp(filter, "i")
			return value.replace(regexp, match => { 
				if (!match) {
					return ""
				} 
				else {
					return "<span class='mark-no-padding'>" + match + "</span>";
				}
			})
		}
	},
	watch: {
		'$store.state.isLayerHotspringsVisible': function (value) {
			this.$emit('layer-hotsprings-clicked');
		}
	},
	methods: {
		contextMenu(event, hotspring) {
			this.$emit("open-context", { event, hotspring })
		},
		clickHotspring(hotspring, index) {
			this.$emit("click-hotspring", hotspring);
			this.activeItem = index;
		},
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
.mark-no-padding {
	background-color: #fcf8e3;
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
