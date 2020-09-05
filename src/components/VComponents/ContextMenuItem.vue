<template>
	<li class="list-group-item pointer border-0 px-0 py-1">
		<div class="item py-1 px-3">
			<slot/>
		</div>
	</li>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.item {
	padding-right: 150px !important;
	font-size: .9rem;
}
.item:hover {
	background-color: #ededed;
}
</style>

