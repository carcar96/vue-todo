<template>
  <Content />
</template>

<script>
import Content from "./components/Content.vue";

export default {
  name: "App",
  components: {
    Content,
  },
};
</script>

<style>
body::after {
  content: "";
  background-image: url("./assets/images/bg.jpg");
  opacity: 0.5;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
