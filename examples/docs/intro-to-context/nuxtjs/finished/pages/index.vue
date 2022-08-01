<script lang="ts" setup>
import HomeLayout from "../components/HomeLayout.vue";
import content from "../content/content.json";

const slug = "/";
const topic = content.find((e) => e.url == slug);
</script>

<template>
  <HomeLayout :fields="topic.fields" :content="content" />
</template>
