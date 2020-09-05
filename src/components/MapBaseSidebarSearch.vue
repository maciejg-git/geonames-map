<template>
	<div class="w-100">

	<!-- SEARCH -->

		<form class="w-100">
			<div class="form-group">
				<input 
					ref="searchInput"
					v-model="searchString" 
					type="search" 
					class="form-control shadow-none" 
					placeholder="Search features"
				>
			</div>
		
			<!-- STATES -->
		
			<div class="row">
				<div class="col-auto">
					<div class="form-check">
						<input 
							v-model="states[0].value" 
							class="form-check-input" 
							type="checkbox" 
							value="" 
							id="mapSearchMT"
							>
						<label class="form-check-label" for="mapSearchMT">
							Montana
						</label>
					</div>	
					<div class="form-check">
						<input 
							 v-model="states[1].value" 
							 class="form-check-input" 
							 type="checkbox" 
							 value="" 
							 id="mapSearchWY"
						>
						<label class="form-check-label" for="mapSearchWY">
							Wyoming
						</label>
					</div>	
				</div>
				<div class="col-auto">
					<div class="form-check">
						<input 
							 v-model="states[2].value" 
							 class="form-check-input" 
							 type="checkbox" 
							 value="" 
							 id="mapSearchCO"
						>
						<label class="form-check-label" for="mapSearchCO">
							Colorado
						</label>
					</div>	
					<div class="form-check form-group">
						<input 
							 v-model="states[3].value" 
							 class="form-check-input" 
							 type="checkbox" 
							 value="" 
							 id="mapSearchNW"
						>
						<label class="form-check-label" for="mapSearchNW">
							New Mexico
						</label>
					</div>	
				</div>
			</div>
		
			<div class="form-inline pb-4">
				<button @click.prevent="search" type="submit" class="btn btn-primary">
					Search
				</button>
				<div v-if="mapIsLoading" class="spinner-border ml-2" role="status">
					<span class="sr-only">Loading...</span>
				</div>
			</div>
		
		</form>
		
		<!-- FILTER -->
		
		<form 
			v-if="mapSearchItems.length" 
			v-on:keydown.enter.prevent 
			class="w-100">
			<div class="form-group">
				<input 
					:value="$store.state.filterSearch" 
					@input="setFilter" 
					type="search" 
					class="form-control" 
					placeholder="Filter"
					>
			</div>
		</form>

		<!-- SEARCH ITEMS -->
		
		<ul class="list-no-padding w-100 pr-2">
			<transition-group name="list" tag="p">
				<li v-for="(s, index) in filteredMapSearchItems" 
					@contextmenu.prevent="contextMenu($event, s)"
					@mouseenter="$emit('mouseenter', s)"
					@mouseleave="$emit('mouseleave', s)"
					class="border-bottom list-item"
					:key="s.Id"
				>
		
					<div 
						class="row no-gutters pointer pt-2" 
						:class="{ active : activeItem == index, 'pb-2': !$parent.view }"
					>
						<div class="col-auto">
							<img 
								 @click.prevent="clickSearchItem(s, index)"
								 :src="icons.blue.image"
								 class="image-scale-down"
								 alt
								 />
						</div>
		
						<div 
							@click.prevent="clickSearchItem(s, index)" 
							class="col ml-2"
						>
		
						<!-- ITEM -->
		
							<div v-if="!$parent.view">
								<p>
									<span v-html="$options.filters.toHtmlMark($store.state.filterSearch, s.Name)"></span>
									<br>
									<span class="small">
										{{s.County}}, 
										<b>
											<span v-html="$options.filters.toHtmlMark($store.state.filterSearch, s.State)"></span>
										</b>
									</span>
								</p>
								<span class="small text-muted">
									<span v-html="$options.filters.toHtmlMark($store.state.filterSearch, s.Category)"></span>
									<br>
								</span>
							</div>
		
						<!-- ITEM COMPACT VIEW -->
		
						<div v-if="$parent.view">
							<span class="small">
								<span v-html="$options.filters.toHtmlMark($store.state.filterSearch, s.Name)"></span>, 
							</span>
							<span class="small">
								<b>
									<span v-html="$options.filters.toHtmlMark($store.state.filterSearch, s.State)"></span>
								</b>
							</span>
							<br>
							<span class="small text-muted">
								<span v-html="$options.filters.toHtmlMark($store.state.filterSearch, s.Category)"></span>
								<br>
							</span>
						</div>
						
						</div>
		
						<!-- END ROW -->
		
					</div>
		
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

import { tools } from "../tools.js"
import { config } from "../config.js"

export default {
	name: 'MapBaseSidebarSearch',
	props: {
		isVisible: Boolean,
	},
	data() {
		return {
			icons: Icons,
			states: [
				{
					name: "MT",
					value: true
				},
				{
					name: "WY",
					value: true
				},
				{
					name: "CO",
					value: true
				},
				{
					name: "NM",
					value: true
				},
			],
			searchString: "cascade creek",
			filter: "",
			activeItem: null,
		}
	},
	computed: {
		...mapState({
			mapSearchItems: 'mapSearchItems',
			mapIsLoading: 'mapIsLoading',
		}),
		...mapGetters({
			filteredMapSearchItems: 'filteredMapSearchItems',
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
		isVisible: function(value) {
			if (value) {
				this.$refs.searchInput.focus();
			}
		}
	},
	methods: {
		clickSearchItem(m, index) {
			this.$emit("click-search-item", m);
			this.activeItem = index;
		},
		reset() {
			this.$store.commit('setFilterSearch', "")
			this.$emit("update-filter", "");

			this.$store.commit("resetMapSearchItems");
		},
		search() {
			// fix set filter method
			if (!this.searchString) return;

			this.reset();

			let states = this.states
				.filter(s => s.value)
				.map(s => s.name)
				.join(",");

			let query = {
				term: this.searchString,
				search_states: states,
				top_n: 200
			};

			let url = tools.createUrl(config.url, query);

			this.$store.dispatch("getMapSearchItems", url).then(
				() => {
					this.$emit("search-complete");
				});
		},
		setFilter: debounce(
			function(event) {
				this.$store.commit('setFilterSearch', event.target.value);
				this.$emit("update-filter");
			}, 
			config.debounceInputTime
		),
		contextMenu(event, searchItem) {
			this.$emit("open-context", { event, searchItem })
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
