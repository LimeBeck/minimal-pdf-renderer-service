import puppeteer, { Browser } from "puppeteer";
import { Scope } from "./scope-tools";

export interface PdfRenderer {
  renderPdf: (scope: Scope, url: string) => Promise<Buffer>;
}

export class PuppeteerPdfRenderer implements PdfRenderer {
  private browser: Browser;
  constructor(browser: Browser) {
    this.browser = browser;
  }

  static async build() {
    console.log("<f05eb76d> Starting browser...");
    const browser = await puppeteer.launch({
      args: ['--disable-dev-shm-usage', '--no-sandbox'],
    });
    console.log("<c70b53cf> Browser started");
    return new PuppeteerPdfRenderer(browser);
  }

  async renderPdf(scope: Scope, url: string): Promise<Buffer> {
    console.log(`<4056ad7d> ${scope.toString()} Render url ${url}`);
    const hrstart = process.hrtime.bigint();
    const page = await this.browser.newPage(); // создаем новую вкладку
    try {
      await page.goto(url); // переходим на сайт
      const pdfFile = await page.pdf({ preferCSSPageSize: true }); // генерируем pdf текущей страницы
      const hrend = process.hrtime.bigint();
      console.log(
        `<d6d499c> ${scope.toString()} Execution time of rendering ${url} is ${
          (hrend - hrstart) / BigInt(1000000)
        } ms`
      );

      return pdfFile;
    } finally {
      page.close();
    }
  }

  close() {
    console.log("<bfdc200b> Shutdown browser...");
    this.browser.close();
    console.log("<fcd280b2> Shutdown complete");
  }
}
