import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import App from "../shared/App";

const app = express();

let serveIndex = (req, res, next) => {
  if (req.path.indexOf('index.html') > -1 || req.path === '/') {
    res.send(`
      <!DOCTYPE html>
      <head>
        <title>Universal Reacl</title>
        <link rel="stylesheet" href="/css/main.css">
        <script src="/bundle.js" defer></script>
      </head>
      <body>
        <div id="root">${renderToString(<App />)}</div>
      </body>
    </html>
  `);
  }
  else {
    next();
  }
}

app.use(serveIndex);

app.use(express.static("public_ssr"));

app.get("*", serveIndex);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is listening");
});