<template>
			<a class="dropdown-item" href="#" @click.prevent="click">
				<slot></slot>
			</a>
</template>

<script>
export default {
	name: 'VDropdownItem',
	components: {
	},
	data() {
		return {
		}
	},
	mounted: function() {

	},
	computed: {

	},
	methods: {
		click: function() {
			this.$emit('dropdown-item-click')
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
