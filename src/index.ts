import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import content from "./routes/content";
import category from "./routes/category";

export type Bindings = {
  XATA_BRANCH: string;
  XATA_API_KEY: string;
  TMDB_API_KEY: string;
  KSPOTLIGHT_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", async (c, next) => {
  const apiKey = c.req.header("Authorization");

  if (!apiKey) {
    throw new HTTPException(401, { message: "Missing API Key" });
  }

  const validApiKey = c.env.KSPOTLIGHT_API_KEY;
  if (apiKey !== validApiKey) {
    throw new HTTPException(403, { message: "Invalid API Key" });
  }

  await next();
});

app.route("/content", content);
app.route("/category", category);

export default app;
