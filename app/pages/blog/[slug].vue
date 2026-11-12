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

const metricKey = blog.value.stats.metric?.key ?? null;

const tableColumns = [
  blog.value.labelColumn,
  ...(metricKey ? [metricKey] : []),
  ...blog.value.stats.categories.slice(0, 2).map((c) => c.column),
];
</script>

<template>
  <main>
    <h1>{{ blog.copy.title }}</h1>
    <p>{{ blog.copy.intro }}</p>
    <section v-if="blog.stats.metric" aria-label="Key statistics">
      <h2>{{ blog.stats.metric.key }} at a glance</h2>
      <dl>
        <div>
          <dt>Total</dt>
          <dd>{{ formatNumber(blog.stats.metric.total) }}</dd>
        </div>
        <div>
          <dt>Average</dt>
          <dd>{{ formatNumber(blog.stats.metric.average) }}</dd>
        </div>
        <div>
          <dt>Median</dt>
          <dd>{{ formatNumber(blog.stats.metric.median) }}</dd>
        </div>
        <div>
          <dt>Top 10 share</dt>
          <dd>{{ formatPercent(blog.stats.metric.top10SharePct) }}</dd>
        </div>
      </dl>
    </section>
    <section v-for="insight in blog.copy.insights" :key="insight.heading">
      <h2>{{ insight.heading }}</h2>
      <p>{{ insight.body }}</p>
    </section>
  </main>
</template>