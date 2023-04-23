# API docs

If unauthorized: 
  - 401 {message: "UNAUTHORIZED"}

#### Auth

(for admins/professors to create their accounts)

**POST /auth/login**
{email: string, password: string}
{token: string}

**POST /auth/register**
{email: string, password: string}
{id: number, token: string}


#### Chat


**POST /chat**

- Should be able to classify if this question relates to a certain assignment or
  if it's a lecture/content-based question (TODO: extract assignment from the
  text question)
- Maybe confirm with the user if this is the topic that the person is asking
  about? If not then reverse

Body:
{question: string}

Response:
{data: string}



#### Assignment / admin side

- Must have functionality to upload files (pset file + the real solution)
Types of pieces:
- Assignment (quiz, lab, PAs, projects)
- Exams

Ideas:
1. Extract the assignments from reading the syllabus
2. Have the admin manually enter it and maybe upload the assignment file

**POST /classes**
- Create a class

{name: string, description: string}

Response: {id: number}

**GET /classes**
- Get classes created

Response: {id, name, description}[]


**POST /classes/:id/artifacts?extract=BOOLEAN**
- Upload an artifact for extraction if extract is `true` (e.g can upload a syllabus to extract the individual ones)

  ```
  ClassArtifact {type: ArtifactType, name: string, description?: string, relatedAttachments?: File[]}
  ArtifactType: PROJECT | LAB | HOMEWORK | QUIZ | EXAM | OTHER
  ```

- If extract=false then takes in manual data `ClassArtifact`

Response: {data: ClassArtifact[]}

**GET /classes/:id**
- Get a class details (e.g assignments)
- Also returns the class artifacts

Response: 
{id, name, description, artifacts: ClassArtifact[]}

(the relatedAttachments is if we pursue 1) where there are rels between an
extracted artifacts and the attachments that it got detected from)

#### Analytics

**GET /analytics**

- **General flow**: *question -> determine artifact (+ solution) related to question -> extract topics -> update stats -> reference solution to form hints -> response*

- Some stats: 
  - Overall sentiment on the course
  - Most frustrated topics (i.e the one most asked about)
- NOTE: stats should be recalculated every time there's a chat message per the
  general flow


## Storing things like questions in an exam

- Since artifacts could be nested in other artifacts (e.g exam/quiz -> questions), we could represent an entire thing as a tree of artifacts; we would store this in the relational database
- Our AI model would be fed this tree (which at the leaf should contain solution
  text) so that it can form hints to respond to the user


## Identified techs

- MySQL: stores users + auth stuff, chat logs, analytics (freq count etc),
  classes, class artifacts (assignments etc...), 
  - Rough ERD being done here: https://dbdiagram.io/d/6443a4386b31947051037fc9
- AWS S3: to store attachments for later reference and for parsing
- read the uploaded attachments? maybe use 3rd-party PDF parsers (https://www.npmjs.com/package/pdf-parse)
- file types accepted? just PDF for now
- Cohere: sentiments (for analytics), topic extraction, question classification into
  assignments

## Some risks and privacy considerations

- Prompt injection
- Keeping hold of user chat data? 
   - but analytics will be very high level and
  lowest level it gets to is the frequency of the individual questions being asked

### Steps

(points from 1-8; 8 being potentially really hard)

<!-- - [ ] (DISMISSIBLE IF WE PURSUE MANUAL ADDING) PDF extraction works (can go from user -> plain text) {3}
- [ ] (DISMISSIBLE IF WE PURSUE MANUAL ADDING) Extracting artifacts from syllabus plaintext {6}
- [ ] (DISMISSIBLE IF WE PURSUE MANUAL ADDING) Can extract relevant topics from syllabus plaintext {4} -->
- [ ] Classifying user chat question into an artifact {4}
- [ ] Can extract relevant topics from user chat question (would use the
      extracted class topics from syllabus) {5}
<!-- - [ ] (DISMISSIBLE IF WE PURSUE MANUAL ADDING) Can extract nested questions and solutions (an artifact tree) -->
- [ ] Can reference existing artifacts and their solutions to form tangible hints {8}

- [ ] Sentiment analysis on the chat logs {5}
- [ ] Analytics works (can collect question-artifact mappings and display like 3
      basic stats) {}
- [ ] Implement analytics UI

- [x] Implement and test auth API
- [ ] Implement and test auth UI
- [ ] CRUD on classes API {2}
- [ ] classes UI {2}

- [ ] artifacts API {3}
- [ ] prod DB setup {2}

NOTE: we could pursue 2) instead of 1) first to test out that it can reference
existing solutions
