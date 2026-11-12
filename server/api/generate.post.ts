import { parseDataset } from "../utils/parseDataset";
import { computeStats } from "../utils/computeStats";

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

  const ds = parseDataset(csv);
  const stats = computeStats(ds);

  return { topic, rowCount: stats.rowCount, metric: stats.metric };
});
