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

    const data = await contentServices.getCategories(pageSize, after);
    return c.json(data);
  } catch (error: any) {
    throw new HTTPException(500, {
      message: "Failed to fetch categories",
      cause: error.message || "Internal Server Error",
    });
  }
});

app.get("/:categoryId", async (c) => {
  try {
    const contentServices = new ContentServices(c.env.XATA_API_KEY, "main");

    const pageSize = c.req.param("pageSize")
      ? parseInt(c.req.param("pageSize") as string, 10)
      : 20;

    if (isNaN(pageSize) || pageSize <= 0 || pageSize > 100) {
      throw new HTTPException(400, {
        message: "Invalid pageSize parameter",
      });
    }

    const after = c.req.param("after");

    const categoryId = c.req.param("categoryId");
    if (!categoryId) {
      throw new HTTPException(400, {
        message: "categoryId parameter is required",
      });
    }

    const data = await contentServices.getCategoryContents(
      categoryId,
      pageSize,
      after
    );

    return c.json(data);
  } catch (error: any) {
    throw new HTTPException(500, {
      message: "Failed to fetch category content",
      cause: error.message || "Internal Server Error",
    });
  }
});

export default app;
