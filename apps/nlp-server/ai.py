import cohere
import numpy as np
import pandas as pd
import os
import time
from dotenv import load_dotenv
from datasets import load_dataset
from annoy import AnnoyIndex
from sklearn.cluster import DBSCAN
from sklearn.metrics.pairwise import cosine_similarity
import supabase

load_dotenv()

COHERE_KEY = os.getenv('COHERE_KEY')
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("DATABASE_KEY")

co = cohere.Client(COHERE_KEY)
sentiment_model = cohere.Client(COHERE_KEY)
supabase_db = supabase.create_client(url, key)
global df, embeds, search_index

# dataset = load_dataset("math_qa", split="train")
# df = pd.DataFrame(dataset)[:5000]
# print(df[:10])
# embeds = co.embed(texts=list(df['Rationale']),
#                   model='large').embeddings

# # print(embeds[:10])

# Update dataframe.txt and embeds.txt to establish a pre-compiled data source for fast reboot
# Usage: run train_model() to update current learning model
def train_question_model():
   dataset = load_dataset("math_qa", split="train")
   df = pd.DataFrame(dataset)[:25000]
   df.to_csv('dataframe.txt', sep='\t', index=False)
   groups = [df[i: i+4000] for i in range(0, len(df), 4000)]

   embeds = []
   for group in groups:
       embed_groups = co.embed(texts=list(group['Rationale']),
                  model='large').embeddings
       for arr in embed_groups:
           embeds.append(arr)
       print("training...")
       time.sleep(60)
   # print('---------EMBEDS ---------\n', embeds)
   np.savetxt('embeds.txt', embeds)


# train_question_model()
def classify_message(message):
    class_id = 1
    response = co.classify(model="sentiment", inputs=[{"text": message}])
    result = response.json()
    sentiment = result['result'][0]
    print(f"Sentiment: {sentiment}")

# Return a search_index (establish the primary algorithm allowing NLP to run on the dataset)
def create_search_index():
    # if os.path.exists('test.ann'):
    #     # start_time = time.time()
    #     search_index = AnnoyIndex(np.shape(embeds)[1], 'angular').load('test.ann')
    #     # print(f"search_index has been loaded from previous file, took {time.time() - start_time} ms")
    # else:
    #     # start_time = time.time()
    search_index = AnnoyIndex(np.shape(embeds)[1], 'angular')
    for i in range(len(embeds)):
        search_index.add_item(i, embeds[i])
    search_index.build(10) # number of trees
    search_index.save('test.ann')
    # print(f"search_index has been created from scratch, took {time.time() - start_time} ms")
    return search_index


# Initalize all variables necessary to access other functions in ai.py
# Global variables: 
# embeds = calculated NLP values from a learned-model, 
# df = database the NLP model is based on, 
# search_index = primary algorithm to run NLP
def initialize_model():
    global embeds, df, search_index 
    # start_time = time.time()
    embeds = np.loadtxt('embeds.txt')
    df = pd.read_csv('dataframe.txt', sep='\t')
    search_index = create_search_index()
    # print(f"Time to initialize: {time.time() - start_time}")
    
### Must run initialize model to establish global variables!
initialize_model()
    

### Go through the dataset and determine similar solutions to a given problem.
def find_neighbors(solution):
    # print(f"search_index: {search_index}")
    # start_time = time.time()
    query_embed = co.embed(texts=[solution], model="large").embeddings
    similar_item_ids = search_index.get_nns_by_vector(query_embed[0], 5, include_distances=True)
    results = pd.DataFrame(data={'Rationale': df.iloc[similar_item_ids[0]]['Rationale'], 'distance': similar_item_ids[1]})
    # print(f"Time to find neighbors: {time.time() - start_time}")
    return results

# Create context for a solution to provide better NLP processing
def generate_context(solution):
    overarching_solution_string = solution
    neighboring_solutions = find_neighbors(solution)['Rationale'].tolist()
    for neighbor in neighboring_solutions:
        overarching_solution_string += neighbor + " "
    return overarching_solution_string

# Calculate the similarity between two float values
def calculate_similarity(a,b):
    return np.dot(a,b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Establish a similarity matrix through Cohere's embed function
def create_similarity_matrix(keywords):
    response = co.embed(texts=keywords)
    # print(f"------RESPONSE------ \n{response}")
    keyword_embeddings = np.array([response.embeddings[i] for i, keyword in enumerate(keywords)])
    similarity_matrix = cosine_similarity(keyword_embeddings)
    return similarity_matrix

def create_similarity_scores(class_topics, message):
    texts = class_topics + [message]
    response = co.embed(texts=texts)
    embeddings = np.array([response.embeddings[i] for i, text in enumerate(texts)])

    message_embedding = embeddings[-1]
    class_topic_embeddings = embeddings[:-1]
    similarity_scores = cosine_similarity([message_embedding], class_topic_embeddings)[0]
    return similarity_scores

def update_frequency_tracker(message, class_id):
    # query = """SELECT topic_title, frequency FROM class_topics WHERE class_id = 1"""
    if class_id == 1:
        message = generate_context(message)
    result = supabase_db.table('class_topics').select("*").eq('class_id', class_id).execute()
    rows = result.data
    class_topics = []
    frequency_tracker = {}
    for row in rows:
        class_topics.append(row['topic_title'])
        if not row['frequency']:
            row['frequency'] = 0
        frequency_tracker[row['topic_title']] = row['frequency']
    # print(f"---CLASS_TOPICS--- \n {class_topics} \n ----FREQUENCY_TRACKER--- \n {frequency_tracker} \n")
    similarity_scores = create_similarity_scores(class_topics, message)
    for topic, score in zip(class_topics, similarity_scores):
        frequency_tracker[topic] += score
    for title, frequency in frequency_tracker.items():
        supabase_db.table('class_topics').update({frequency: frequency}).eq('topic_title', title)
        result = supabase_db.table('class_topics').update({'frequency': frequency}).eq('topic_title', title).execute() 
    return True   
    # print(frequency_tracker)

# Given a similarity matrix, determine similar clusters 
def determine_clusters(keywords, threshold, similarity_matrix):
    df_similarity = pd.DataFrame(similarity_matrix, index=keywords, columns=keywords)
    normalized_similarity = (df_similarity.values + 1)/ 2
    normalized_similarity = np.clip(normalized_similarity, 0, 1)
    distance_matrix = 1 - normalized_similarity
    dbscan = DBSCAN(metric='precomputed', eps= 1 - threshold, min_samples = 1)
    clusters = dbscan.fit_predict(distance_matrix)
    keyword_clusters = {}
    for keyword, cluster_label in zip(keywords, clusters):
        if cluster_label not in keyword_clusters:
          keyword_clusters[cluster_label] = []
        keyword_clusters[cluster_label].append(keyword)
    return keyword_clusters

# Given an original array of keywords, find the most relevant clusters 
def order_clusters_by_relevance(original_keywords, generated_clusters, similarity_matrix):
    topic_relevance = []
    for cluster_index, cluster in generated_clusters.items():
        # print(f"---NEW KEYWORDS --- \n {new_keywords}")
        relevance_score = 0
        for keyword in cluster:
            for original_keyword in original_keywords:
                row = original_keywords.index(keyword)
                column = original_keywords.index(original_keyword)
                relevance_score += similarity_matrix[row][column]
        relevance_score /= len(cluster) * len(original_keywords)
        topic_relevance.append((cluster_index, relevance_score))
    return topic_relevance

def generate_topics(question):
    # make question into a solution
    # solution = question
    # overarching_solution_string = solution
    # neighboring_solutions = find_neighbors(solution)['Rationale'].tolist()
    # for neighbor in neighboring_solutions:
    #     overarching_solution_string += neighbor + " "
    # extract keywords from solution
    CONSTANT_KEYWORDS = [  "coordinate plane",  "distance",  "center",  "circle",  "radius",  "integer",  "equation",  "pi",  "cosine",  "sine",  "vector",  "plane"]
    THRESHOLD = 0.7
    similarity_matrix = create_similarity_matrix(CONSTANT_KEYWORDS)
    # print(f"-----SIMILARITY_MATRIX------ \n {similarity_matrix}")
    cluster_map = determine_clusters(CONSTANT_KEYWORDS, THRESHOLD, similarity_matrix)
    topics_with_relevance = order_clusters_by_relevance(CONSTANT_KEYWORDS, cluster_map, similarity_matrix)
    ordered_topics = sorted(topics_with_relevance, key=lambda x: x[1], reverse=True)
    top_3_topics = ordered_topics[:3]
    for index, score in top_3_topics:
        print(f"{cluster_map[index]} with a score of {score}")

        
def get_frequencies(class_id):
    result = supabase_db.table('class_topics').select("*").eq('class_id', class_id).execute()
    rows = result.data
    frequency_tracker = {}
    frequency_sum = 0
    for row in rows:
        if not row['frequency']:
            row['frequency'] = 0
        frequency_tracker[row['topic_title']] = row['frequency']
        frequency_sum += row['frequency']
    for topic_title, frequency in frequency_tracker.items():
        frequency_tracker[topic_title] = (frequency/frequency_sum) * 100
    # print(f"---FREQUENCY_TRACKER--- \n {frequency_tracker}")
    return frequency_tracker

def get_sentiments(class_id):
    result = supabase_db.table('class_sentiments').select("*").eq('class_id', class_id).execute()
    rows = result.data
    return rows[0]
        # frequency_tracker = {}
    # for row in rows:
    #     if not row['frequency']:
    #         row['frequency'] = 0
    #     frequency_tracker[row['topic_title']] = row['frequency']
    # return frequency_tracker
    # print('hi')

def get_data(class_id):
    response = {}
    frequencies = get_frequencies(class_id)
    sentiments = get_sentiments(class_id)
    response['frequencies'] = frequencies
    response['sentiments'] = sentiments
    return response


def extract_keywords(input):
    keywords_response = co.generate(
        prompt=f"Extract the most important topics from the following text, and put it in a parseable list format: {input}",
        max_tokens = 100,
        temperature=0.6
    )
    print(f"keywords_response: {keywords_response}")

# update_frequency_tracker("""Time multiplexing involves sharing a resource by dividing access to it in time. At some time, you allow one process access to it; at a later time, you provide access to some other process. Multiplexing a single-core system is essentially done using time multiplexing.

# Space multiplexing involves sharing a resource by dividing it into smaller pieces which are used concurrently. You give part of it to one process, part of it to another, and both may use it simultaneously. Memory is primarily shared using space multiplexing.

# Both of these resources actually use a mixture of both space and time multiplexing. Multi-core systems divide cores between threads using space multiplexing. And memory systems change allocations of memory between processes over time, achieving a form of time multiplexing.
# """)
    

# extract_keywords("To determine the radius of the circle, we can identify the coefficient of the cosine and sine terms in the equation for r(t), which is 11. The center of the circle is located where the circle intersects the xy-plane, which is at (-3, 0, 0) in this case. To find the plane containing the circle, we can use the center of the circle as a point on the plane and the vector from the center to a point on the circle as a normal vector for the plane, which in this case is (0, 11, 0), so the equation of the plane is y = 0.")
# CONSTANT_KEYWORDS = [  "coordinate plane",  "distance",  "center",  "circle",  "radius",  "integer",  "equation",  "pi",  "cosine",  "sine",  "vector",  "plane"]
# THRESHOLD = 0.7
# update_frequency_tracker(generate_context("To determine the radius of the circle, we can identify the coefficient of the cosine and sine terms in the equation for r(t), which is 11. The center of the circle is located where the circle intersects the xy-plane, which is at (-3, 0, 0) in this case. To find the plane containing the circle, we can use the center of the circle as a point on the plane and the vector from the center to a point on the circle as a normal vector for the plane, which in this case is (0, 11, 0), so the equation of the plane is y = 0"))
# generate_topics("Hello!")
# neighbors = find_neighbors("To determine the radius of the circle, we can identify the coefficient of the cosine and sine terms in the equation for r(t), which is 11. The center of the circle is located where the circle intersects the xy-plane, which is at (-3, 0, 0) in this case. To find the plane containing the circle, we can use the center of the circle as a point on the plane and the vector from the center to a point on the circle as a normal vector for the plane, which in this case is (0, 11, 0), so the equation of the plane is y = 0.")
# for neighbor in neighbors[0]:
#     print(f"neighbor: {neighbor}")
# print(neighbors['Rationale'].tolist())
# print(find_neighbors('How to get to mars'))

# classify_message("Hello there!")