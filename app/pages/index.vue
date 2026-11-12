<script setup lang="ts">
const loading = ref(false);
const error = ref("");
async function onSubmit(event: Event) {
  const form = event.target as HTMLFormElement;
  error.value = "";
  loading.value = true;
  try {
    const { slug } = await $fetch<{ slug: string }>("/api/generate", {
      method: "POST",
      body: new FormData(form),
    });
    await navigateTo(`/blog/${slug}`);
  } catch (err: any){
    error.value =
        err?.data?.statusMessage || "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <main>
    <h1>Generate an SEO blog from a CSV</h1>
    <p>Upload a company dataset and give it a topic. We'll write the blog.</p>

    <form @submit.prevent="onSubmit">
      <label for="topic">Topic</label>
      <input
        id="topic"
        name="topic"
        type="text"
        placeholder="e.g. UK healthtech companies"
        required
      />

      <label for="file">CSV file</label>
      <input id="file" name="file" type="file" accept=".csv,text/csv" required />

      <button type="submit" :disabled="loading">
        {{ loading ? "Generating… this can take a few seconds" : "Generate blog" }}
      </button>
      <p v-if="error" role="alert">{{ error }}</p>
    </form>
  </main>
</template>