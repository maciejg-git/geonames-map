<template>
	<div id="app" >
		<Navbar></Navbar>
		<keep-alive>
			<router-view/>
		</keep-alive>
	</div>
</template>

<script>
import { config } from "./config.js";

import Navbar from "./components/Navbar.vue"

export default {
	name: 'HelloWorld',
	components: {
		Navbar,
	},
	data() {
		return {
		}
	},
	mounted: function() {
		document.body.classList.add("bg-light");
	},
	created: function() {
		this.$store.commit("setFiltersCategory");
		this.$store.commit("setMapSettingsFilters");
	}
}
</script>

<style>
/* body { */
/* 	background-image: url("assets/map.jpg") */
/* } */
</style>
