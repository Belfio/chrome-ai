import PlaywrightController from "./lib/playwrightApi";

const controller = new PlaywrightController("test");
await controller.init();
await controller.goto("https://www.google.com");

await controller.takeScreenshot("test");

await controller.move({ x: 700, y: 500 });
await controller.scroll({ x: 0, y: 500 });
await controller.click();

// await controller.close();
