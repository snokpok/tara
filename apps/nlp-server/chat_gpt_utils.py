import openai
import os 
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_KEY")

GENERATE_SOLUTION = "Using concepts, properties, and theorems in your answer, generate a really brief explanation of how you would achieve a solution to this problem: "
GENERATE_KEYWORDS = "Extract the most important keywords from the following text, don't include duplicate keywords, and put it in a parseable list format: "

def generate_solution(input):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"{GENERATE_SOLUTION}{input}",
        temperature=0,
        max_tokens=500
    )
    return response.choices[0].text

print(generate_solution("The function r(t) traces a circle. Determine the radius, center, and plane containing the circle r(t) = -3i + (11cos(t))j + (11sin(t))k"))
