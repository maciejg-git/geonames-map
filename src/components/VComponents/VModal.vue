<template>
  <div class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <!-- slot -->
            <slot name="header"></slot>
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <!-- slot -->
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button
            @click="remove"
            type="button"
            class="btn btn-secondary mr-auto"
            data-dismiss="modal"
						>
          	Delete <i class="fas fa-trash"></i>
					</button>
          <button
            @click="cancel"
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
						>
          	{{ buttonCancelLabel }}
					</button>
          <button 
						@click="save" 
						type="button" 
						class="btn btn-primary"
            data-dismiss="modal"
						>
						{{ buttonAcceptLabel }}
					</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VModal",
  components: {},
	props: {
		buttonAcceptLabel: String,
		buttonCancelLabel: String,
	},
  data() {
    return {};
  },
  mounted: function() {},
  computed: {},
	methods: {
		save() {
			this.$emit("button-save");
		},
		cancel() {
			this.$emit("button-cancel");
		},
		remove() {
			this.$emit("button-delete");
		},
	}
};
</script>

<style scoped>
</style>
