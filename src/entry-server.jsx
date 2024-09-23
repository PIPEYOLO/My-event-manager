import "./index.css"
import React from "react"
import { StaticRouter } from "react-router-dom/server"
import { renderToString } from "react-dom/server"
import App from "./App"
import { Provider } from "react-redux"
import initializeStore from "./assets/store/initialize"
import AppHeadTags from "./AppHeadTags"


/**
 * @param {string} url
 * @param {string} [ssrManifest]
 */
export async function render(url, ssrManifest, renderOptions, htmlTemplate, otherOptions) {
  const { user, req } = otherOptions;

  // inititalize the store
  const store = await initializeStore(url, otherOptions);

  // Render the app html based on the store state
  const appHtml = renderToString(
    <React.StrictMode>
      <Provider store={store} >
        <StaticRouter location={url} >
          <App />
        </StaticRouter>
      </Provider>
    </React.StrictMode>,
    renderOptions
  );

  const htmlDynamicHeadTags = renderToString(
    <React.StrictMode>
      <AppHeadTags 
        url= { url }
        req={ req } 
        user={ user } 
      />
    </React.StrictMode>
  );

  const preloadedState = store.getState();

  return htmlTemplate
    .replace("<!--app-head-tags-->", htmlDynamicHeadTags) // add the specific head tags to the html
    .replace("<!--app-html-->", appHtml) // add the app html to the templace
    // then add the global-state script to the template
    .replace("<!--global-state-script-->", `
      <script>
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
          /</g,
          '\\u003c'
        )}
      </script>
    `);
}
