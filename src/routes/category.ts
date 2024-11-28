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

    const data = await contentServices.getCategories(pageSize, after);
    return c.json(data);
  } catch (error: any) {
    return c.json(
      { error: "Failed to fetch categories", details: error.message },
      500
    );
  }
});

app.get("/:categoryId", async (c) => {
  try {
    const contentServices = new ContentServices(c.env.XATA_API_KEY, "main");

    const pageSize = c.req.param("pageSize")
      ? parseInt(c.req.param("pageSize") as string, 10)
      : 20;

    if (isNaN(pageSize) || pageSize <= 0 || pageSize > 100) {
      return c.json({ error: "Invalid pageSize parameter" }, 400);
    }

    const after = c.req.param("after");

    const categoryId = c.req.param("categoryId");
    if (!categoryId) {
      return c.json({ error: "categoryId parameter is required" }, 400);
    }

    const data = await contentServices.getCategoryContents(
      categoryId,
      pageSize,
      after
    );

    return c.json(data);
  } catch (error: any) {
    return c.json(
      { error: "Failed to fetch category contents", details: error.message },
      500
    );
  }
});

export default app;
