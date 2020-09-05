<template>
	<div class="border-right sidebar">
		<div :style="styleExpand" class="d-flex flex-column align-items-start pt-4 px-3">
			<div class="d-flex justify-content-end border-bottom w-100 mb-3">
				<h6 class="mr-auto">
					{{ label }} 
					<span v-if="badge" class="badge badge-secondary ml-1">
						{{ badge }}
					</span>
				</h6>
				<i 
					v-if="canCompact"
					@click="view = !view" 
					class="fas fa-align-justify pointer pl-2"
				></i>
				<i 
					v-if="!expand" 
					@click="toggleExpand" 
					class="fas fa-angle-double-right pointer pl-2"
				></i>
				<i 
					v-else 
					@click="toggleExpand" 
					class="fas fa-angle-double-left pointer pl-2"
				></i>
			</div>
			<slot :view="view"></slot>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'VSidebar',
		props: {
			label: String,
			badge: Number,
			canCompact: Boolean,
			width: {
				type: Number,
				default: 350,
			},
			expandedWidth: {
				type: Number,
				default: 450,
			},
		},
		data() {
			return {
				colWidth: 2,
				view: 0,
				expand: false,
			}
		},
		mounted: function() {
			this.updateSidebarHeight();
		},
		computed: {
			styleExpand() { 
				let width = this.expand ? this.expandedWidth : this.width;
				return {
					'min-width': width + "px",
					'max-width': width + "px", 
				}
			},
		},
		methods: {
			handleResizeWindow() {
				this.updateSidebarHeight();
			},
			updateSidebarHeight() {
				this.$el.style.height =
					window.innerHeight - this.$var.navbarHeight - this.$var.mapNavbarHeight + "px";
			},
			toggleExpand() {
				this.expand = !this.expand;
			},
		}
}
</script>

<style scoped>
.sidebar {
	overflow-y: scroll;
}
</style>
