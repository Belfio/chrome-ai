console.log("Hello via Bun!");
import ai from "./lib/aiAPI";
import PlaywrightController from "./lib/playwrightApi";
const readline = require("readline");
//--------------------------------------------------------------------------
//  Chrome AI
//--------------------------------------------------------------------------
//
// The general structure is this:
// 1 - Input a prompt
// 2 - Develop a strategy, describe it, and get feedback to refine it
// 3 - Once confirmed, turn it into a set of steps that can be accomplished using the browser and the browser control ({mouse:{x,y}, keyboard, action})
// 4 - Have a recursive engine that takes the strategy, the step, the previous and future steps, the last screenshots and last control objects and creates a new control object
// 5 - The recursive engine runs with the same strategy, step, , the previous and future steps, and updates the last screenshots and last control objects and creates a new control object until the task is completed
// 6 - At every recursion the engine is aksed if it needs to update the strategy and the steps based on the screenshot
// 7 - Completes step by step until the whole strategy is completed
//
// Example task is find me the cheapest ticket from Barcelona to London for the 6th or April
//
//--------------------------------------------------------------------------

type inputPromptType = string;
async function getInputPrompt(): Promise<inputPromptType> {
  // get input from the terminal

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Enter a prompt: ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

type strategyType = string[];
async function getStrategy(prompt: inputPromptType): Promise<strategyType> {
  const prePrompt = `You are a smart machine that gets an instruction prompt and replies with a strategy split in different steps. 
  This strategy will guide a robot that has a browser open.
  The strategy will achieve the goal of the main prompt by using the internet browser. 
  Don't be vague, be specific.
  You answer with an array of strings. 
  
  Here is an example:
    example Prompt: "Find me the weather in Cagliari for today"
    example Strategy: ["Go to google.com", "Type in the search bar 'weather in Cagliari'", "Click on the search button", "Take a screenshot", "Analyze the screenshot to find the weather", "Answer the user with the weather"]


    Prompt: ${prompt}
    Strategy: 
    `;
  const ans = await ai.chatCompletion(prePrompt);
  console.log(ans);
  return JSON.parse(ans);
}

type stepsType = string[];
async function getSteps(strategyStep: string): Promise<stepsType> {
  const prePrompt = `You are a smart machine that gets an instruction set and creates a set of steps to achieve the instructions.
  This strategy will guide a robot that has a browser open.
  The strategy will achieve the goal of the main prompt by using the internet browser. 
  Your instructions need to be super specific, so that we can translate them in mouse movements and keyboard actions. Never provide multiple choices in one step.
  You answer with an array of strings. Here is an example:
    example Prompt: "Go to google.com"
    example Strategy: ["Move the mouse to the address bar", "type google.com", "Press the enter key in the keyboard"]


    Prompt: ${strategyStep}
    Strategy: 
    `;
  const ans = await ai.chatCompletion(prePrompt);
  console.log(ans);
  return JSON.parse(ans);
}

type commandType = {
  x: number;
  y: number;
  key: string;
  word: string;
  action: "MOVE" | "CLICK" | "KEY" | "WORD";
};
// this needs to read images! or some sort of image input / history!
async function getStepToCommand(step: string): Promise<commandType> {
  const prePrompt = `You are a smart translator from command to JSON object. You will get a command and you will translate it into a JSON object that can be used by the browser controller.
    The format of the JSON object is: {x: number, y: number, key: string, word: string, action: "MOVE" | "CLICK" | "KEY" | "WORD"}
    You will only reply with the JSON object. Here is an example:
      example Prompt: Press Ctrl+T on the keyboard
      example Strategy: {x: 0, y: 0, key: "Ctrl+T", word:"", action: "KEY"}
  
  
      Prompt: ${step}
      Strategy: 
      `;
  const ans = await ai.chatCompletion(prePrompt);
  console.log(ans);
  return JSON.parse(ans) as commandType;

  //   return {
  //     x: 0,
  //     y: 0,
  //     key: "",
  //     word: "",
  //     action: "MOVE",
  //   };
}

function updateStrategy(strategy: strategyType): strategyType {
  return "";
}

function updateSteps(steps: stepsType): stepsType {
  return "";
}
function updateCommand(): commandType {
  return {
    x: 0,
    y: 0,
    key: "",
    word: "",
    action: "MOVE",
  };
}

let name: string;
function openBroswer() {}

function runCommand() {}

let snapShot;
function getSnapshot() {}

const RECURSION_LIMIT = 10;
async function main() {
  // const inputPrompt: inputPromptType = await getInputPrompt();
  const inputPrompt =
    "Get me the cheapest ticket from Barcelona to London for the 6th of April";
  console.log(inputPrompt);
  const strategy: strategyType = await getStrategy(inputPrompt);

  console.log(strategy);
  const steps: stepsType = await getSteps(strategy[0]);
  console.log(steps);

  //   for the step it needs a screenshot

  const command = getStepToCommand(steps[0]);
  console.log(command);
  return;

  const browser = new PlaywrightController("main");
  await browser.init();
  for (const step in steps) {
    let isStepConcluded = true;
    let recursionsCounter = 0;
    while (isStepConcluded) {
      recursionsCounter = recursionsCounter++;
      const screenshot = await browser.getScreenshot();
      const command = await getStepToCommand(step, screenshot);
      switch (command.action) {
        case "CLICK":
          await browser.move({ x: command.x, y: command.y });
          await browser.click();
          break;
        case "MOVE":
          await browser.move({ x: command.x, y: command.y });

          break;
        case "KEY":
          await browser.key(command.key);

          break;
        case "WORD":
          await browser.word(command.word);

          break;
      }
      await browser.takeScreenshot(name + "_try");
      const newScreenshot = await browser.getScreenshot(name + "_try");
      // based on this should I get out of the while? is all correct? TELL MEEEE
      if (recursionsCounter > 10) isStepConcluded = false;
    }
  }
}

main();
