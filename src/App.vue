<template>
  <rt-usa msg="Welcome to Your Vue.js App"/>
</template>

<script>
import RtUsa from './components/Usa.vue'

export default {
  name: 'App',
  components: {
    RtUsa
  }
}
</script>

<style>
  body {
    margin: 0;
  }

  [id="app"] {
  height: 100vh;
}
</style>
