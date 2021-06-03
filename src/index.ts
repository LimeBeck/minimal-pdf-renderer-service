import puppeteer from "puppeteer"; // подключаем библиотеку

(async () => {
  // объявляем функцию
  const browser = await puppeteer.launch(); // запускаем браузер
  const promises: Promise<void>[] = [];
  for (let i = 0; i < 100; i++) {
    const prom = (async () => {
      const hrstart = process.hrtime.bigint();
      console.log(`${i} started`);
      const page = await browser.newPage(); // создаем новую вкладку
      try {
        await page.goto(
          "https://sportidapi.stage.sebbia.pro/files/a5a67408-order_items_pdf_1.html"
        ); // переходим на сайт
        //   await page.goto("https://sportidapi.stage.sebbia.pro/files/2328ff57-accreditation_pdf_default_1.html"); // переходим на сайт
        await page.pdf({ path: "out.pdf", preferCSSPageSize: true }); // генерируем pdf текущей страницы
        const hrend = process.hrtime.bigint();
        console.log(
          `Execution time of ${i} is ${(hrend - hrstart) / BigInt(1000000)} ms`
        );
      } finally {
        page.close();
      }
    })();
    promises.push(prom);
  }
  await Promise.all(promises);
  await browser.close(); // закрываем браузер
})();
