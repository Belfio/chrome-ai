//--------------------------------------------------------------------------
//  PLAYWRIGHT API
//--------------------------------------------------------------------------
//
// A way to control playwright
// 1 - Open a browser page
// 2 - Control mouse movements
// 3 - Control mouse clicks
// 4 - Control keyboard inputs
// 5 - Create page snapshots
//
//--------------------------------------------------------------------------

import { Browser, Page, launch, BrowserContext } from "playwright";

class PlaywrightController {
  private browserPromise: Promise<Browser>;
  private page: Page | null;
  private mouseXY = { x: 0, y: 0 };
  private browser: Browser | null;
  private name: string;
  constructor(name: string) {
    this.browserPromise = launch({ headless: false });
    this.page = null;
    this.browser = null;
    this.name = name;
  }
  public async init() {
    await this.openPage();
  }
  public async openPage() {
    this.browser = await this.browserPromise;
    const context = await this.browser.newContext();
    this.page = await context.newPage();
  }

  public async closePage() {
    if (!this.page) return;
    await this.page.close();
  }

  public async goto(url: string) {
    if (!this.page) return;
    // 1 - Open a browser page
    await this.page.goto(url);
  }
  public async move({ x, y }: { x: number; y: number }) {
    if (!this.page) return;
    // 2 - Control mouse movements
    this.mouseXY = { x, y };
    await this.page.mouse.move(x, y);
  }

  public async click() {
    if (!this.page) return;
    const { x, y } = this.mouseXY;
    await this.page.mouse.click(x, y);
  }

  public async key(key: string) {
    if (!this.page) return;
    await this.page.keyboard.press(key);
  }

  public async screenshot(path: string = this.name) {
    if (!this.page) return;
    await this.page.screenshot({ path });
  }
  public async close() {
    if (!this.browser) return;
    await this.browser.close();
  }
}
