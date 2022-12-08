<script lang="ts" setup>
import content from "../content/content.json";
import HomeLayout from "../components/HomeLayout.vue";

const slug = "/";
const topic = content.find((e) => e.url == slug)!;
</script>

<template>
  <HomeLayout :fields="topic.fields" :content="content" />
</template>
