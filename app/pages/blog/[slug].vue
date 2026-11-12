<script setup lang="ts">
const route = useRoute();
const { data: blog } = await useFetch(`/api/blog/${route.params.slug}`);

if (!blog.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Blog not found",
    fatal: true,
  });
}

useSeoMeta({
  title: blog.value.copy.title,
  description: blog.value.copy.metaDescription,
});
</script>

<template>
  <main>
    <h1>{{ blog.copy.title }}</h1>
    <p>{{ blog.copy.intro }}</p>
  </main>
</template>