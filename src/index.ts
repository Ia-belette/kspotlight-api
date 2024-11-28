import { Hono } from "hono";

type Bindings = {
  XATA_BRANCH: string;
  XATA_API_KEY: string;
  TMDB_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
