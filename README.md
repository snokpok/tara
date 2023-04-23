# Tara

## What is it?
### 🍎 Tara is an AI-powered teaching assistant that is there to help anywhere, anytime. 
On the student side, Tara is a Discord bot that provides homework help, topic guidance, and exam review. For educators, Tara makes the process of supplemental education effortless, providing valuable insight and manpower to help students learn outside of lecture.
Tara's functionalities:
1. Using large language models, Tara answers questions about course content for students as a Discord bot
2. Teachers can upload class resources and solutions to train Tara to imitate their real teaching assistants
3. Our dashboard provides NLP-based data analytics based on Cohere’s Embed and Classify endpoints 

Tara enriches the college education environment. We believe that every student should have an equal opportunity to discover and understand new things at every point in their educational journey. While we can supplement our education through office hours and teaching assistants in university, a common pain point is that office hours can be inefficient and too crowded for us to access our available resources. Tara aims to fix that, eliminating the logistics and inefficiency of a middle man. 

But we don't want to stop in the classroom. Learning also happens anywhere, anytime. In the future, we want to expand Tara to more platforms (Slack, Microsoft Teams, etc) and learning spaces (Coursera, the workspace, etc). 

### 🍏 How did we build Tara?
For our **overall project architecture**, we have a Discord bot that runs on a Node.js server. It listens to messages within the channels of the Discord server it resides in. We then have a REST API, built on Express.js, that serves most of the core business functions, such as user management authentication and course management. Our admin frontend was built with Next.js and the NextUI beta library. We chose to create several different microservices for the project, due to several programming language incompatibilities. 

In terms of **data analytics**, there are two main parts: topic sentiments by class and overall class sentiment. The majority of the data analysis was configured using Cohere’s API. We specifically used semantic search to find similarly related solutions to provide a more robust explanation. We used Cohere’s embed API to receive floating-point representations of specific question-solution pairs. With these floating-point representations, we could use cosine-similarity measurements to determine how related certain questions were to specific topics. Additionally, Cohere’s classify API was used to tag various messages as “positive” and “negative,” which is then collected to determine overall class sentiment. We used two different models for training. One of our datasets was a set of math word problems and solutions with difficulties ranging from preliminary to college-based math. Our other dataset was Sentiment 140, a collection of 1.6 million Twitter messages and classifies them as positive/negative, was used to generate overall class sentiment. 


## Setup

1. Install `nx` globally via `npm i -g nx`
2. `npm i` to install all deps
3. `nx serve admin` to run the admin; `nx serve backend` to serve the API, `discord-bot` for the bot etc...

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.
