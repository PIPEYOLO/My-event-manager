import fs from "node:fs"
import e from "express"
import { authorizationRequired } from "../../middlewares/auth/index.js"
import { getUserAuthInfo } from "../../../services/cookie/auth/index.js"
import { UNEXPECTED_RENDER_ERROR } from "../../../services/errors/index.js";
import { getHTMLRateLimiter } from "../../middlewares/limiters/vite.js";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const base = "/"
const ABORT_DELAY = 10000

// Cached production assets
const templateHtml = isProduction
  ? fs.readFileSync("./dist/client/index.html", "utf-8")
  : ""
const ssrManifest = isProduction
  ? fs.readFileSync("./dist/client/.vite/ssr-manifest.json", "utf-8")
  : undefined

// Create http server
const viteRouter = e.Router()

// Add Vite or respective production middlewares
let vite
if (!isProduction) {
  const { createServer } = await import("vite")
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base
  })
  viteRouter.use(vite.middlewares)
} else {
  const compression = (await import("compression")).default
  const sirv = (await import("sirv")).default
  viteRouter.use(compression())
  viteRouter.use(base, sirv("./dist/client", { extensions: [] }))
}


// Renderer:
async function getHTMLRenderer(req) {
  const url = req.originalUrl;
  let template
  let render
  if (!isProduction) {
    // Always read fresh template in development
    template = fs.readFileSync("./index.html", "utf-8")
    template = await vite.transformIndexHtml(url, template)
    render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render
  } else {
    template = templateHtml
    render = (await import("../../../../dist/server/entry-server.js")).render
  }

  return async () => {
    let html;
    try {
      html = await render(
        url, 
        ssrManifest, 
        null, // no options
        template,
        {  // info for the global state
          req,
          state: { user: getUserAuthInfo(req).data  }
        }
      )
    }
    catch(err) {
      vite?.ssrFixStacktrace(err)
      console.log(err.stack)
      return { success: false, error: UNEXPECTED_RENDER_ERROR }
    }
    return html;
  };
}



// First Middleware
viteRouter.use("*", getHTMLRateLimiter, authorizationRequired({ type: "notStrict" }), async (req, res, next) => {
  try {
    const renderer = await getHTMLRenderer(req);
    
    const html = await renderer({})

    res.contentType(".html").send(html);

  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
  next();
});


// Applying the router that is gonna prepare each ssr load for each route:
// viteRouter.use("/", appRenderRouter);




export default viteRouter;