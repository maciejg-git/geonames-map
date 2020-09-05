<template>
	<div
		@click="close"
		class="context-menu shadow"
		ref="popper"
		v-show="isVisible"
		tabindex="-1"
		v-click-outside="close"
		@contextmenu.capture.prevent>
		<ul class="list-group" >
			<slot :contextData="contextData" />
		</ul>
	</div>
</template>

<script>
import { createPopper } from '@popperjs/core'
import ClickOutside from 'vue-click-outside'

let openedMenu = null;

export default {
	props: {
		boundariesElement: {
			type: String,
			default: 'body',
		},
		// context: Object,
	},
	data() {
		return {
			opened: false,
			contextData: {},
		};
	},
	directives:{
		ClickOutside,
	},
	computed: {
		isVisible() {
			return this.opened;
		},
	},
	methods: {
		open(evt, contextData) {
			// close any open menu
			if (openedMenu && openedMenu != this) {
				openedMenu.close();
			}
			openedMenu = this;

			this.opened = true;
			this.contextData = contextData;

			if (this.popper) {
				this.popper.destroy();
			}

			this.popper = createPopper(this.referenceObject(evt), this.$refs.popper, {
				placement: 'right-start',
				modifiers: [
					{
						name: "preventOverflow",
						options: {
							boundary: document.querySelector(this.boundariesElement),
						}
					},
				],
			});

			 // Recalculate position
			this.$nextTick(() => {
				this.popper.update();
			});
			
		},
		close() {
			this.opened = false;
			this.contextData = null;
		},
		referenceObject(evt) {
			const left = evt.clientX;
			const top = evt.clientY;
			const right = left + 1;
			const bottom = top + 1;

			function getBoundingClientRect() {
				return {
					width: 0,
					height: 0,
					left,
					top,
					right,
					bottom,
				};
			}

			return {
				getBoundingClientRect,
			};
		},
	},
	beforeDestroy() {
		if (this.popper !== undefined) {
			this.popper.destroy();
		}
	},
};

</script>

<style lang="scss" scoped>
.context-menu {
		position: fixed;
		z-index: 999;
		overflow: hidden;
		outline: none;
}
</style>
