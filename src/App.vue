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
  :root {
    --water: #e3f1f7;
    --river: #5e97ad;
    --outside-usa: #d2dde0;
    --border: white;
  }

  body {
    margin: 0;
    overflow: hidden;
  }

  /* [id="app"] {
  height: 100vh;
} */
</style>
