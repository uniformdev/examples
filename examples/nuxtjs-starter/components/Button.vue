<script lang="ts" setup>
defineProps<{ active?: boolean }>();
</script>

<template>
  <button
    type="button"
    :class="{
      button: true,
      'button--active': active,
    }"
  >
    <slot />
  </button>
</template>

<style scoped>
.button {
  background-image: linear-gradient(
    to right,
    #83c6e1 0%,
    #438fd5 51%,
    #83c6e1 100%
  );
  margin: 10px;
  padding: 15px 30px;
  text-align: center;
  text-transform: uppercase;
  transition: background-position 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: block;
}

.button:hover {
  background-position: right center;
}

.button--active {
  background-image: linear-gradient(
    to right,
    #d31027 0%,
    #ea384d 51%,
    #d31027 100%
  );
}
</style>
