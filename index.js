// Stealth Setup
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const randomUseragent = require("random-useragent");
const fs = require("fs");
const https = require("https");
const path = require("path");

puppeteer.use(StealthPlugin());

const codiciVisitati = new Set();
let totaliVisitati = 0;
let immaginiSalvate = 0;

const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
const downloadDir = path.join(__dirname, "downloaded img");
if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

function generaCodiceCasuale() {
  return Array.from(
    { length: 6 },
    () => charset[Math.floor(Math.random() * charset.length)]
  ).join("");
}

function sleepRandom(min = 1500, max = 4000) {
  return new Promise((r) => setTimeout(r, Math.random() * (max - min) + min));
}

async function scavaImmagini(botId, page) {
  const userAgent = randomUseragent.getRandom();
  await page.setUserAgent(
    userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
  );

  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-GB,en;q=0.9,it;q=0.8",
  });

  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const type = req.resourceType();
    if (
      ["stylesheet", "font", "script", "xhr", "fetch", "media"].includes(type)
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  // Cookie casuale
  await page.setCookie({
    name: "session_id",
    value: Math.random().toString(36).substring(2),
    domain: ".prnt.sc",
    path: "/",
    httpOnly: false,
    secure: true,
  });

  while (true) {
    const codice = generaCodiceCasuale();
    if (codiciVisitati.has(codice)) continue;
    codiciVisitati.add(codice);
    totaliVisitati++;
    const url = `https://prnt.sc/${codice}`;
    console.log(`🔍 [BOT ${botId}] Cerco immagine per: ${codice}`);

    try {
      await page.goto(url, { timeout: 15000, waitUntil: "domcontentloaded" });

      await page.evaluate(() =>
        window.scrollBy(0, Math.floor(Math.random() * 500))
      );

      await page.mouse.click(
        Math.floor(Math.random() * 300),
        Math.floor(Math.random() * 400)
      );

      await page.waitForSelector("img#screenshot-image", { timeout: 5000 });

      const imgUrl = await page.$eval("img#screenshot-image", (img) => img.src);

      if (
        imgUrl &&
        imgUrl.startsWith("http") &&
        !imgUrl.includes("st.prntscr.com/2023") &&
        !imgUrl.includes("Removed") &&
        !imgUrl.includes("0_")
      ) {
        const fileName = `${codice}.jpg`;
        const filePath = path.join(downloadDir, fileName);
        const file = fs.createWriteStream(filePath);

        https.get(imgUrl, (response) => {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            fs.stat(filePath, (err, stats) => {
              if (err || stats.size === 564 || stats.size === 0) {
                fs.unlink(filePath, () => {
                  console.log(
                    `🗑️ [BOT ${botId}] Rimosso placeholder: ${fileName}`
                  );
                });
              } else {
                immaginiSalvate++;
                console.log(`✅ [BOT ${botId}] Salvata: ${fileName}`);
              }
            });
          });
        });
      } else {
        console.log(`❌ [BOT ${botId}] Nessuna immagine valida trovata`);
      }
    } catch (err) {
      console.log(`⚠️ [BOT ${botId}] Errore per: ${codice} - ${err.message}`);
    }

    process.stdout.write(
      `📊 Visitati: ${totaliVisitati} | ✅ Salvati: ${immaginiSalvate}\r`
    );
    await sleepRandom();
  }
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--disable-features=AudioServiceOutOfProcess",
    ],
    defaultViewport: { width: 1366, height: 768 },
  });

  const numBot = 1;
  for (let i = 1; i <= numBot; i++) {
    const page = await browser.newPage();
    scavaImmagini(i, page);
  }
})();
