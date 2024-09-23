import { Route, Routes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";



export default function AppHeadTags({ url, req, user }) {
  let sectionName = (url === "/" ? "/home" : url).slice(1).split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
  const pageTitle = import.meta.env.PUBLIC_APP_NAME + " | " + sectionName; // get the page name

  return (
    <>
      <title>{ pageTitle }</title>
      <meta name="description" content="The ultimate application to manage events from and for you and other people" />
      <link rel="icon" href="/favicon.ico" />

      <StaticRouter location={ url } >
        <Routes>
          <Route path="/get-started" element={ <meta name="robots" content="INDEX FOLLOW"/> } />
          <Route path="*" element= { <meta name="robots" content="NOINDEX NOFOLLOW"/> } />
        </Routes>

      </StaticRouter>
    </>
  )
}