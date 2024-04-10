//--------------------------------------------------------------------------
//  AI API
//--------------------------------------------------------------------------
//
// 1 - A way to call different models: Gemini, OpenAI, Claude
// 2 - A set of prompts for strategy and task to playwrightAPI
// 3 - A set of prompts to check the screenshots
// 4 - A set of functions to update the strategy and the tasks based on the screenshots analysis result
//
//
//--------------------------------------------------------------------------

// now use openAi api to receive an anawer from a prompt
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

const ai = {
  chatCompletion: async (prompt: string) => {
    const ans = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    return ans.choices[0].message.content;
  },
};

export default ai;
