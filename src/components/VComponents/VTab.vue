<template>
  <div>
      <div v-show="active">
        <slot></slot>
      </div>
  </div>
</template>

<script>
export default {
  name: "VTab",
  data() {
    return {
      active: false
    };
  },
  mounted: function() {
    this.$parent.$emit("addtab", this);
  },
  destroyed: function() {
    this.$parent.$emit("deletetab", this);
  },
  methods: {}
};
</script>

<style scoped>
</style>
