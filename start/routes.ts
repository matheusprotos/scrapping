import Route from "@ioc:Adonis/Core/Route";
import puppeteer from "puppeteer";

Route.get("/", async () => {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  await page.goto("https://g1.globo.com/");

  const content: any = await page.evaluate(() => {
    let result: any = [];

    const links = document.querySelectorAll(".feed-post-link p");

    links.forEach((link) => {
      result = [...result, link.innerHTML];
    });

    return result;
  });

  await browser.close();

  return { result: content };
});
