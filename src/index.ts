import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { swaggerUI } from "@hono/swagger-ui";
import content from "./routes/content";
import category from "./routes/category";

export type Bindings = {
  XATA_BRANCH: string;
  XATA_API_KEY: string;
  TMDB_API_KEY: string;
  KSPOTLIGHT_API_KEY: string;
};

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.openAPIRegistry.registerComponent(
  "securitySchemes",
  "AuthorizationApiKey",
  {
    type: "apiKey",
    name: "Authorization",
    in: "header",
  }
);

app.get("/ui", swaggerUI({ url: "/doc" }));
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
  security: [
    {
      AuthorizationApiKey: [],
    },
  ],
});

app.use("/v1/*", async (c, next) => {
  const apiKey = c.req.header("Authorization");

  if (!apiKey) {
    throw new HTTPException(401, { message: "Missing API Key" });
  }

  if (apiKey !== c.env.KSPOTLIGHT_API_KEY) {
    throw new HTTPException(403, { message: "Invalid API Key" });
  }

  await next();
});

app.route("/v1/content", content);
app.route("/v1/category", category);

export default app;
