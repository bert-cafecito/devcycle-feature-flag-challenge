Trivia App
What I Built
I built a Trivia App that allows users to answer multiple-choice trivia questions. The app features a backend built with FastAPI and a frontend using HTML, CSS, and JavaScript. The backend serves trivia questions and handles user answers, while the frontend provides an interactive interface for users to engage with the trivia questions.

Key Features
Multiple-Choice Trivia Questions: Users can answer multiple-choice trivia questions fetched from the backend.
Answer Validation: The app checks if the user's answer is correct and provides immediate feedback.
Session Management: The app tracks the user's session data, including the number of questions answered and streaks of correct and incorrect answers.
Achievements and Badges: Users can earn achievements and badges based on their performance.
Profile View: Users can view their profile, including their streaks, answered questions, achievements, and badges.
Responsive Design: The frontend is designed to be responsive and user-friendly.
How I Used DevCycle
I integrated DevCycle into the Trivia App to manage feature flags and remote configuration. This allowed me to:

Roll Out Features Gradually: I used feature flags to roll out new features to a subset of users, ensuring stability and gathering feedback before a full release.
A/B Testing: I conducted A/B testing to compare different versions of features and determine which version provided a better user experience.
Remote Configuration: I used DevCycle's remote configuration to change app behavior and content without deploying new code, making it easier to manage and update the app.
How to Run
Backend:

Navigate to the backend directory.
Build and run the Docker container:
Frontend:

Open index.html in a web browser.
API Endpoints
Fetch Trivia Question: GET /trivia
Check Answer: POST /trivia/answer
Get Player Profile: GET /whoami
Check Achievements: GET /checkachievement
Technologies Used
Backend: FastAPI, Python, Docker
Frontend: HTML, CSS, JavaScript, Bootstrap
Feature Management: DevCycle
Enjoy playing and testing your trivia knowledge!