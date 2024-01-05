import Route from "@ioc:Adonis/Core/Route";
import puppeteerExtra from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import Env from "@ioc:Adonis/Core/Env";

puppeteerExtra.use(Stealth());

Route.post("/", async ({ request }) => {
  const browser = await puppeteerExtra.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );

  await page.goto("https://chat.openai.com/");

  const loginButton = page.locator("[data-testid='login-button']");

  await loginButton.click();

  const googleButton = page.locator("[data-provider='google']");

  await googleButton.click();

  const emailInput = page.locator("#identifierId");

  await emailInput.fill(Env.get("GOOGLE_EMAIL"));

  const nextButton = page.locator(
    "[data-idom-class='nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b']"
  );

  await nextButton.click();

  await new Promise((resolve) => setTimeout(resolve, 5000));

  await page.keyboard.type(Env.get("GOOGLE_PASSWORD"));

  await nextButton.click();

  await page.waitForNavigation();

  const promtInput = page.locator("#prompt-textarea");

  await promtInput.fill(request.qs().question);

  const sendButton = page.locator("[data-testid='send-button']");

  await sendButton.click();

  await page.waitForResponse("https://chat.openai.com/backend-api/lat/r");

  const responseDiv = await page.waitForSelector(
    "[data-message-author-role='assistant']"
  );

  let response = await page.evaluate((el: any) => el.textContent, responseDiv);

  browser.close();

  return {
    response,
  };
});
