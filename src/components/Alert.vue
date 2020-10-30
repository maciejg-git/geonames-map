<template>
  <div class="alert-container">
    <div 
      v-for="m in $store.state.alertMessages" 
      class="alert alert-dismissible fade show" 
      :class="'alert-'+m.type" 
      role="alert"
      >
      {{ m.text }}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Alert',
    data() {
      return {}
    },
  }
</script>

<style scoped>
.alert-container {
  position: absolute;
  top: 10px;
  left: 50px;
  z-index: 1100;
  width: 90%;
}
</style>
