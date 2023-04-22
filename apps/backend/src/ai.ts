import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

// Creating an instance of OpenAIApi with API key from the environment variables
const openai = new OpenAIApi(
	new Configuration({ apiKey: process.env.OPENAI_KEY })
);

// Setting values for the prompt and message to be used in the GPT-3 and GPT-3.5-Turbo
export const answerQuestion = async (question: string) => {
	// const response = await openai.createChatCompletion({
	// 	model: 'gpt-3.5-turbo',
	// 	messages: [
	// 		{ role: 'user', content: question },
	// 	],
	// });
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: question,
        max_tokens: 500,
      });

	// return response.data.choices[0].essage.content;
    return response.data.choices[0].text;
};
