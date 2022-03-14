import App from "./App";
import React from "react";
import { StaticRouter } from "react-router-dom";
import express from "express";
import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import compression from "compression";
import expressStaticGzip from "express-static-gzip";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint]
    ? assets[entrypoint].css
      ? assets[entrypoint].css
          .map((asset) => `<link rel="stylesheet" href="${asset}">`)
          .join("")
      : ""
    : "";
};

const jsScriptTagsFromAssets = (assets, entrypoint, ...extra) => {
  return assets[entrypoint]
    ? assets[entrypoint].js
      ? assets[entrypoint].js
          .map((asset) => `<script src="${asset}" ${extra.join(" ")}></script>`)
          .join("")
      : ""
    : "";
};

export const renderApp = (req, res) => {
  const helmet = Helmet.renderStatic();

  const context = {};
  const markup = renderToString(
    <StaticRouter context={context} location={req.url}>
      <App />
    </StaticRouter>
  );
  const html = `<!doctype html>
  <html lang="en" ${helmet.htmlAttributes.toString()}>
  <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charset="utf-8" />
                      ${helmet.title.toString()}
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${helmet.meta.toString()} 
                ${helmet.link.toString()} 
                ${
                  assets.client.css
                    ? `<link rel="stylesheet" href="${assets.client.css}">`
                    : ""
                }
  </head>
  <body ${helmet.bodyAttributes.toString()}>
      <div id="root">${markup}</div>
      ${jsScriptTagsFromAssets(assets, "client", "defer", "crossorigin")}
  </body>
</html>`;
  return { context, html };
};

const server = express();
// .use(express.static(process.env.RAZZLE_PUBLIC_DIR));
server
  .disable("x-powered-by")
  .use(compression())
  .use(
    expressStaticGzip(process.env.RAZZLE_PUBLIC_DIR, {
      enableBrotli: true,
      orderPreference: ["br", "gz"],
    })
  )
  .get("/*", (req, res) => {
    const { context, html } = renderApp(req, res);
    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(html);
    }
  });

export default server;
