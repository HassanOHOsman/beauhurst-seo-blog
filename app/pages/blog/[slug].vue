<script setup lang="ts">
const route = useRoute();
const { data: blog } = await useFetch(`/api/blog/${route.params.slug}`);
</script>

<template>
  <main>
    <h1>{{ blog?.copy.title }}</h1>
  </main>
</template>