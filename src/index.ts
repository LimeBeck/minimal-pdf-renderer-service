import promMid from "express-prometheus-middleware";
import express from "express";

import { PuppeteerPdfRenderer } from "./render";
import { ScopeIdGenerator, ScopeService } from "./scope-tools";
import { inspect } from "./debug";

const app = express();
const port = process.env.PORT || 4000;

const scopeService = new ScopeService(new ScopeIdGenerator());

(async () => {
  const renderer = await PuppeteerPdfRenderer.build();
  app.get("/api/render", async (req, res) => {
    const scope = scopeService.createScope("Render page to PDF");
    console.log(
      `<dc2d96c3> ${scope} Get request with url params ${inspect(req.query, 10)}`
    );
    try {
      if (req.query.url && typeof req.query.url == "string") {
        const pdfFile = await renderer.renderPdf(scope, req.query.url);

        res.type("pdf");
        res.send(pdfFile);
      } else {
        throw Error("Url does not recognized");
      }
    } catch (e) {
      console.log(`<018097d9> ${scope.toString()} Server error: ${e}`);

      if (e instanceof Error) {
        res.json({
          error: {
            message: e.message,
          },
        });
      } else {
        res.json({
          error: {
            message: `${e}`,
          },
        });
      }
    }
  });

  app.use(
    promMid({
      metricsPath: "/metrics",
      collectDefaultMetrics: true,
      requestDurationBuckets: [0.1, 0.5, 1, 1.5],
      requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
      responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    })
  );

  const server = app.listen(port, () => {
    console.log(`<121b8fef> App listening at http://localhost:${port}`);
  });

  process.on("SIGTERM", () => {
    console.log("<9d864daa> Terminating server...");
    renderer.close();
    server.close();
    console.log("<43a15ba> Server terminated. Good Bye");
    process.exit(0);
  });
})();
