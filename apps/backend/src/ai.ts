import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

// Creating an instance of OpenAIApi with API key from the environment variables
const openai = new OpenAIApi(
	new Configuration({ apiKey: process.env.OPENAI_KEY })
);

// Setting values for the prompt and message to be used in the GPT-3 and GPT-3.5-Turbo
export const answerQuestion = async (question: string): Promise<string> => {
	// const response = await openai.createChatCompletion({
	// 	model: 'gpt-3.5-turbo',
	// 	messages: [
	// 		{ role: 'user', content: question },
	// 	],
	// });
	const response = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: question,
		max_tokens: 500,
	});

	// return response.data.choices[0].essage.content;
	return response.data.choices[0].text;
};

export const getClassTopics = async (question: string): Promise<string[]> => {
	const topics = [
		'Vector calculus',
		'Cylindrical coordinates',
		'Dot products',
		'Vector projections',
		'3D planes',
		'Cartesian geometry',
		'Functions and several variables',
		'Arc length',
		'Curvature',
		'Triple integrals',
	];

	const response = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: `
			Here is a question: 
			${question}

			Take on the role of a professor. 
			Disregard past inputs, and give me the topics (as a list of bullet points) that pertains to the given question. 
			Think about how you would solve the question. What topics would help you understand more about achieving the solution? 
			Choose 3 relevant topics from the following list:
			${topics.join(', ')}
			`,
		max_tokens: 1000,
	});

	return [response.data.choices[0].text];
};

//			Note: you may only choose 3 from the following topics that are most related to the question:
			// 