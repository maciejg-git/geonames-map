<template>
	<nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm p-1 pl-3">
		<a class="navbar-brand" href="">Map</a>
		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>

		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item">
					<router-link to="/geonames" class="nav-link">Geonames</router-link>
				</li>
				<li class="nav-item">
					<router-link to="/map" class="nav-link">Map</router-link>
				</li>
				<li class="nav-item">
					<router-link to="/about" class="nav-link">About</router-link>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script>
	export default {
		name: 'HelloWorld',
		props: {

		},
		data() {
			return {
				msg: ""
			}
		},
		mounted: function() {
			this.updateNavbarHeight();
		},
		methods: {
			updateNavbarHeight() {
				this.$var.navbarHeight = this.$el.clientHeight;
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
	margin: 40px 0 0;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
.router-link-exact-active {
	font-weight: bold;
}

</style>
