import { parseDataset } from "../utils/parseDataset";
import { computeStats } from "../utils/computeStats";
import { buildSummary } from "../utils/buildSummary";
import { generateCopy } from "../utils/generateCopy";
import { saveBlog, uniqueSlug } from "../utils/blogStore";

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event);
  if (!parts)
    throw createError({ statusCode: 400, statusMessage: "No form data" });

  const filePart = parts.find((p) => p.name === "file");
  const topicPart = parts.find((p) => p.name === "topic");

  if (!filePart)
    throw createError({
      statusCode: 400,
      statusMessage: "No CSV file uploaded",
    });

  const csv = filePart.data.toString("utf-8");
  const topic = topicPart?.data.toString("utf-8").trim() ?? "";

    if (!topic)
      throw createError({
        statusCode: 400,
        statusMessage: "Please enter a topic",
      });

  const ds = parseDataset(csv);
  const stats = computeStats(ds);
  const summary = buildSummary(ds, stats, topic);
  const { geminiApiKey } = useRuntimeConfig();
  const copy = await generateCopy(geminiApiKey, summary);

  const slug = await uniqueSlug(topic);
  await saveBlog({
    slug,
    topic,
    createdAt: new Date().toISOString(),
    labelColumn: ds.labelColumn,
    copy,
    stats,
  });

  return { topic, copy };

  
});
