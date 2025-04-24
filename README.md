# 🕷️ Lightshot Screenshot Crawler

This project is an **automated web crawler** that navigates through **public screenshots on [prnt.sc](https://prnt.sc)**, verifies their validity, and saves them locally. Each image is identified by a 6-character alphanumeric code (e.g., `abc123`, `4bv53p`, `1s298h`, etc.).

The crawler is designed to be **slow but stealthy**, mimicking human behavior to avoid bans and rate-limiting.

---

## 🚀 Features

- Uses [Puppeteer](https://pptr.dev/) in headless mode
- Randomly generates 6-character codes to access public Lightshot screenshots
- Downloads only **valid images** (skips removed, placeholder, or invalid ones)
- Avoids detection by:
  - Adding randomized scrolls and clicks
  - Using real User-Agent and HTTP headers
  - Applying randomized delays between requests
  - Setting session cookies per bot instance
- Supports multiple crawling instances (bots)
- Ready for proxy/VPN or stealth plugin integration

Install:

git clone https://github.com/your-username/lightshot-crawler.git
cd lightshot-crawler
npm install

🧰 Future Improvements

[ ] Proxy/Tor support
[ ] Live dashboard to preview images in real-time
[ ] Image filters (OCR, text content detection, NSFW filters)
[ ] Stats and logs tracking success/failure per bot

⚠️ Legal & Ethical Disclaimer
This script is for educational and research purposes only.
It is not intended for unauthorized scraping or privacy invasion.
Please do not store or share private/sensitive content. Use responsibly.

p.s do not run too many bots at one or Cloudflare will spank ya
. . .
