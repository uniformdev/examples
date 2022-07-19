<script lang="ts" setup>
import Layout from "../components/Layout.vue";
import content from "../lib/content.json";

const route = useRoute();
const topic = content.find((entry) => entry.id == route.params.topic);
</script>

<template>
  <Layout :content="content" :fields="topic.fields" />
</template>
