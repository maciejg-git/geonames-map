<template>
	<div class="row no-gutters shadow-sm">
		<div class="col">
			<ul class="nav my-0 mt-0">
				<li 
					@click="clickIcon(1)" 
					class="nav-item pointer border-right mt-2"
					>
					<div 
						:class="{ 'menu-active' : active == 1, 'text-primary' : active == 1 }" 
						class="p-1 pr-4 mx-2 menu-hover pb-2"
						>
						<i class="fas fa-map-marker-alt pointer px-1"></i>
						My Markers
					</div>
				</li>
				<li 
					@click="clickIcon(2)" 
					class="nav-item pointer border-right mt-2"
					>
					<div 
						:class="{ 'menu-active' : active == 2, 'text-primary' : active == 2 }" 
						class="p-1 pr-4 mx-2 menu-hover pb-2"
						>
					<i class="fas fa-search pointer px-1"></i>
					Search
					</div>
				</li>
				<li 
					@click="clickIcon(3)" 
					class="nav-item pointer border-right mt-2"
					>
					<div 
						:class="{ 'menu-active' : active == 3, 'text-primary' : active == 3 }" 
						class="p-1 pr-4 mx-2 menu-hover pb-2"
						>
						<i class="fas fa-globe-americas pointer px-1"></i>
						Layers
					</div>
				</li>
				<li 
					@click="clickIcon(4)" 
					class="nav-item pointer border-right mt-2"
					>
					<div 
						:class="{ 'menu-active' : active == 4, 'text-primary' : active == 4 }" 
						class="p-1 pr-4 mx-2 menu-hover pb-2"
						>
						<i class="fas fa-globe-americas pointer px-1"></i>
						Maps
					</div>
				</li>
				<li 
					@click="clickIcon(5)" 
					class="nav-item pointer border-right mt-2"
					>
					<div 
						:class="{ 'menu-active' : active == 5, 'text-primary' : active == 5 }" 
						class="p-1 pr-4 mx-2 menu-hover pb-2"
						>
					<i class="fas fa-cog pointer px-1"></i>
					Settings
					</div>
				</li>
			</ul>
		</div>
		<div class="col-auto ml-auto d-flex align-items-center pr-2">
			<div v-show="$store.state.savedMarkedArea">
				<i class="fas fa-check pr-1"></i>Saved
			</div>
			<div 
				v-show="!$store.state.savedMarkedArea" 
				class="spinner-border spinner-border-sm ml-2" 
				role="status"
				>
				<span class="sr-only">Loading...</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'MapNavbar',
	props: {
		active: Number,
	},
	data() {
		return {}
	},
	mounted: function() {
		this.updateComponentHeight();
	},
	methods: {
		updateComponentHeight() {
			this.$var.mapNavbarHeight = this.$el.clientHeight;
		},
		clickIcon(i) {
			this.$emit("clickSidebarIcon", i);
		},
	}
}
</script>

<style scoped>
.menu-hover:hover {
	background-color: #efefef;
	color: #000000 !important;
	box-shadow:	0 .125rem .25rem rgba(0,0,0,.075)!important
}
</style>
