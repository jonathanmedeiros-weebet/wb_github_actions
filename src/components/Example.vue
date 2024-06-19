<template>
  <div class="example">
    <h1>{{ title }}</h1>
  </div>
</template>

<script lang="ts">
export default {
  name: 'example',
  components: {},
  props: {},
  data() {
    return{
      title: 'component example'
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.example {
  color: red;
}
</style>