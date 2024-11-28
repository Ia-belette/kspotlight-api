import { Hono } from "hono";
import { Bindings } from "..";
import { ContentServices } from "../services/content";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  try {
    const contentServices = new ContentServices(c.env.XATA_API_KEY, "main");

    const pageSize = c.req.param("pageSize")
      ? parseInt(c.req.param("pageSize") as string, 10)
      : 20;

    if (isNaN(pageSize) || pageSize <= 0 || pageSize > 100) {
      return c.json({ error: "Invalid pageSize parameter" }, 400);
    }

    const after = c.req.param("after");

    const data = await contentServices.getAllContents(pageSize, after);
    return c.json(data);
  } catch (error: any) {
    return c.json(
      { error: "Failed to fetch contents", details: error.message },
      500
    );
  }
});

app.get("/:tmdbId", async (c) => {
  try {
    const contentServices = new ContentServices(c.env.XATA_API_KEY, "main");
    const tmdbId = c.req.param("tmdbId");

    if (!tmdbId) {
      return c.json({ error: "tmdbId parameter is required" }, 400);
    }

    const data = await contentServices.getContentById(tmdbId);

    if (!data) {
      return c.json({ error: "Content not found" }, 404);
    }

    const similarContents = await contentServices.getSimilarContents(
      data?.category?.category_id || null,
      tmdbId
    );

    const response = {
      ...data,
      similarContents: similarContents,
    };

    return c.json(response);
  } catch (error: any) {
    return c.json(
      { error: "Failed to fetch content by ID", details: error.message },
      500
    );
  }
});

app.get("/recommended", async (c) => {
  try {
    const contentServices = new ContentServices(c.env.XATA_API_KEY, "main");

    const pageSize = c.req.param("pageSize")
      ? parseInt(c.req.param("pageSize") as string, 10)
      : 20;

    if (isNaN(pageSize) || pageSize <= 0 || pageSize > 100) {
      return c.json({ error: "Invalid pageSize parameter" }, 400);
    }

    const after = c.req.param("after");

    const data = await contentServices.getRecommendedContents(pageSize, after);
    return c.json(data);
  } catch (error: any) {
    return c.json(
      { error: "Failed to fetch recommended contents", details: error.message },
      500
    );
  }
});

export default app;
