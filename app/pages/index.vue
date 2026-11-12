<template>
  <main>
    <h1>Generate an SEO blog from a CSV</h1>
    <p>Upload a company dataset and give it a topic. We'll write the blog.</p>

    <form>
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

      <button type="submit">Generate blog</button>
    </form>
  </main>
</template>