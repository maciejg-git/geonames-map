<template>
    <span class="dropdown">
      <a href="" class="dropdown-toggle" type="button" id="dropdownMenuButton2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {{ name }}
      </a>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <slot></slot>
      </div>
    </span>
</template>

<script>
export default {
  name: 'HelloWorld',
  components: {
  },
  props: {
    name: String,
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

  }
}
</script>

<style scoped>

</style>
