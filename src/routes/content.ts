import { Hono } from "hono";
import { Bindings } from "..";
import { ContentServices } from "../services/content";
import { HTTPException } from "hono/http-exception";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  try {
    const contentServices = new ContentServices(c.env.XATA_API_KEY, "main");

    const pageSize = c.req.param("pageSize")
      ? parseInt(c.req.param("pageSize") as string, 10)
      : 20;

    if (isNaN(pageSize) || pageSize <= 0 || pageSize > 100) {
      throw new HTTPException(400, { message: "Invalid pageSize parameter" });
    }

    const after = c.req.param("after");

    const data = await contentServices.getAllContents(pageSize, after);
    return c.json(data);
  } catch (error: any) {
    throw new HTTPException(500, {
      message: "Failed to fetch contents",
      cause: error.message,
    });
  }
});

app.get("/:tmdbId", async (c) => {
  try {
    const contentServices = new ContentServices(c.env.XATA_API_KEY, "main");
    const tmdbId = c.req.param("tmdbId");

    if (!tmdbId) {
      throw new HTTPException(400, { message: "tmdbId parameter is required" });
    }

    const data = await contentServices.getContentById(tmdbId);

    if (!data) {
      throw new HTTPException(404, { message: "Content not found" });
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
    throw new HTTPException(500, {
      message: "Failed to fetch content by ID",
      cause: error.message,
    });
  }
});

app.get("/recommended", async (c) => {
  try {
    const contentServices = new ContentServices(c.env.XATA_API_KEY, "main");

    const pageSize = c.req.param("pageSize")
      ? parseInt(c.req.param("pageSize") as string, 10)
      : 20;

    if (isNaN(pageSize) || pageSize <= 0 || pageSize > 100) {
      throw new HTTPException(400, { message: "Invalid pageSize parameter" });
    }

    const after = c.req.param("after");

    const data = await contentServices.getRecommendedContents(pageSize, after);
    return c.json(data);
  } catch (error: any) {
    throw new HTTPException(500, {
      message: "Failed to fetch recommended contents",
      cause: error.message,
    });
  }
});

export default app;
