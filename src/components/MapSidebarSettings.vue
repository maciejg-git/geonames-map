<template>
	<div class="w-100">
		<form class="w-100">
		
			<!-- <div class="mb&#45;4"> -->
			<!-- 	<h6 class="font&#45;weight&#45;bold"> -->
			<!-- 		<i class="fas fa&#45;caret&#45;right pr&#45;1"></i> -->
			<!-- 		Map controls -->
			<!-- 	</h6> -->
			<!-- </div> -->
		  <!--  -->
			<!-- <div class="form&#45;group row"> -->
			<!-- 	<div class="col"> -->
			<!-- 		View zoom -->
			<!-- 	</div> -->
			<!-- 	<div class="col&#45;auto"> -->
			<!-- 		<div class="form&#45;check"> -->
			<!-- 			<input type="checkbox" class="form&#45;check&#45;input"> -->
			<!-- 		</div> -->
			<!-- 	</div> -->
			<!-- </div> -->
		  <!--  -->
			<!-- <div class="border&#45;bottom w&#45;100 my&#45;4"></div> -->
		  <!--  -->
			<!-- <div class="mb&#45;4"> -->
			<!-- 	<h6 class="font&#45;weight&#45;bold"> -->
			<!-- 		<i class="fas fa&#45;caret&#45;right pr&#45;1"></i> -->
			<!-- 		Search -->
			<!-- 	</h6> -->
			<!-- </div> -->
			<!-- <div class="mb&#45;2"> -->
			<!-- 	Show only those categories -->
			<!-- </div> -->
		  <!--  -->
			<!-- <ul class="list&#45;unstyled"> -->
			<!-- 	<li v&#45;for="(c, index) in $store.state.mapSettings.filters" :key="index"> -->
			<!-- 		<div class="form&#45;check"> -->
			<!-- 			<input -->
			<!-- 				class="form&#45;check&#45;input" -->
			<!-- 				@change="" -->
			<!-- 				type="checkbox" -->
			<!-- 				value -->
			<!-- 				:id="'filtercheckbox' + index" -->
			<!-- 				:checked="c.value" -->
			<!-- 				/> -->
			<!-- 			<label class="form&#45;check&#45;label" :for="'filtercheckbox' + index"> -->
			<!-- 				{{ c.category }} -->
			<!-- 			</label> -->
			<!-- 		</div> -->
			<!-- 	</li> -->
			<!-- </ul> -->
		  <!--  -->
			<!-- <div class="border&#45;bottom w&#45;100 my&#45;4"></div> -->
		
			<div class="mb-4">
				<h6 class="font-weight-bold">
					User data
				</h6>
			</div>

			<div class="row mb-4">
				<div class="col">
					<div class="mb-2">
						My markers
					</div>
				</div>
				<div class="col-auto">
					<div>
						<label  for="myItems" class="custom-file-upload p-0 m-0">
							Import
						</label>
						<input type="file" id="myItems" @change="importMyItems">
					</div>
					<div>
						<a href="" @click.prevent="exportMyItems">Export </a>
					</div>
				</div>
			</div>

			<!-- MARKED AREA -->

			<div class="row">
				<div class="col">
					<div class="mb-2">
						Marked area
					</div>
				</div>
				<div class="col-auto">
					<div>
						<label  for="markedArea" class="custom-file-upload p-0 m-0">
							Import
						</label>
						<input type="file" id="markedArea" @change="importMarkedArea">
					</div>
					<div>
						<a href="" @click.prevent="exportMarkedArea">Export </a>
					</div>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import { tools } from "../tools.js"
import { map } from "../map.js"

export default {
	name: 'MapSidebarSettings',
	data() {
		return {}
	},
	methods: {
		exportMyItems() {
			let myItems = JSON.stringify(
				this.$store.state.mapMyItems, [
					"name",
					"text",
					"color",
					"lat",
					"lon"
			], 1)

			tools.download("MyItems.json", myItems);
		},
		importMyItems(event) {
			if(event.target.files.length) {
				let file = event.target.files[0];
				let ext = file.name.split('.').pop();
				try {
					if (ext !== "json") {
						throw 'Invalid file extension.'
					}
				}
				catch (error) {
					console.log(error)
					return
				}
				var reader = new FileReader();

				reader.onload = event => {
					let fileText = reader.result;

					try {
						let myItems = JSON.parse(fileText);

						for(let i of myItems) {
							let keys = [
								{key: "name", type: 'string'}, 
								{key: "text", type: 'string'}, 
								{key: "color", type: 'string'}, 
								{key: "lat", type: 'number'}, 
								{key: "lon", type: 'number'}, 
							];
							for (let k of keys) {
								let valid = i.hasOwnProperty(k.key) 
									&& typeof i[k.key] == k.type;
								if (!valid) {
									throw 'Error in file.'
								}
							}
						}
						let backup = localStorage.getItem('savedFeatures')
						localStorage.setItem('savedFeatures', fileText)

						this.$emit("imported-my-items");
					} 
					catch (error) {
						console.log(error);
						return
					}
				}

				reader.readAsText(file);
			}
		},

		// MARKED AREA

		exportMarkedArea() {
			let markedArea = JSON.stringify(map.rect, null, 1);

			tools.download("MarkedArea.json", markedArea);
		},
		importMarkedArea(event) {
			if(event.target.files.length) {
				let file = event.target.files[0];
				let ext = file.name.split('.').pop();
				try {
					if (ext !== "json") {
						throw 'Invalid file extension.'
					}
				}
				catch (error) {
					console.log(error)
					return
				}
				var reader = new FileReader();

				reader.onload = event => {
					let fileText = reader.result;

					try {
						let markedArea = JSON.parse(fileText);

						let backup = localStorage.getItem('markedArea')
						localStorage.setItem('markedArea', fileText)

						this.$emit("imported-marked-area");
					} 
					catch (error) {
						console.log(error);
						return
					}
				}

				reader.readAsText(file);
			}
		},
	}
}
</script>

<style scoped>
input[type="file"] {
	display: none;
}
.custom-file-upload {
    display: inline-block;
    cursor: pointer;
    color: #007bff;
}
.custom-file-upload:hover {
    text-decoration: underline;
}
</style>
