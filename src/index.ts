import { Hono } from "hono";
import content from "./routes/content";
import category from "./routes/category";

export type Bindings = {
  XATA_BRANCH: string;
  XATA_API_KEY: string;
  TMDB_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/content", content);
app.route("/category", category);


export default app;
