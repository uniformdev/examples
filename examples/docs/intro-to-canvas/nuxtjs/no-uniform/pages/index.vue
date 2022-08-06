<script lang="ts" setup>
import content from "../content/content.json";

const slug = "/";
const topic = content.find((e) => e.url == slug);
</script>

<template>
  <Layout :content="content" :fields="topic.fields" />
</template>
