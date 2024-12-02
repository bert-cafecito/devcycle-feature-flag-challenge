import json
import random
import uuid
import time

from fastapi import HTTPException, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from devcycle_python_sdk import DevCycleLocalClient, DevCycleLocalOptions
from devcycle_python_sdk.models.user import DevCycleUser
from openfeature import api
from openfeature.evaluation_context import EvaluationContext

# Initialize the FastAPI app
app = FastAPI()

# Configure CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. Change "*" to a list of allowed origins, e.g., ["http://localhost:5500"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all HTTP headers
)

# Load the player's session data from the JSON file
with open('data/session_data.json', 'r') as file:
    session_data = json.load(file)

    # Add a UUID to player's session data if it doesn't exist
    if "uuid" not in session_data:
        session_data["uuid"] = uuid.uuid4().hex

# Sample trivia data
# Load the trivia data from the JSON file
with open('data/trivia_data.json', 'r') as file:
    trivia_data = json.load(file)

# configure your options 
options = DevCycleLocalOptions()

# Create an instance of the client with options and your server SDK key
devcycle_client = DevCycleLocalClient(os.getenv('DEV_CYCLE_SDK_KEY'), options)

# Set OpenFeature Provider and get client
api.set_provider(devcycle_client.get_openfeature_provider())
open_feature_client = api.get_client()

# wait for devcycle_client to initialize
for i in range(0, 10):
  if devcycle_client.is_initialized():
    break
  time.sleep(0.5)

# Create user context
context = EvaluationContext(
    targeting_key=session_data["uuid"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/whoami")
async def whoami():
    """Get the player's session data."""

    # Logic for Achievement - First Question
    key = 'achievement-first-question'

    try:
        # Fetch variable values using the identifier key, with a default value and user object
        # The default value can be of type string, boolean, number, or JSON
        variable_value = open_feature_client.get_float_value(key, 10, context)
        question_answered = session_data["question"]["answered"]

        # Check if the question_ansewered is equal to or greater than variable_value
        if int(question_answered) >= int(variable_value):
            session_data["achievement"]["first_question"] = True # Set the first question

    except Exception as e:
        print(f"Exception when calling DevCycleLocalClient->variable_value: {e}")


    return session_data

@app.get("/checkachievement")
async def check_achievement():
    """Check if the player has earned any achievements."""
    # Get a list of all achievements the player has earned
    earned_achievements = session_data["achievements"]
    new_achievements = list()

    if 'achievement-first-question' not in earned_achievements:
        # Logic for Achievement - First Question
        key = 'achievement-first-question'

        try:
            # Fetch variable values using the identifier key, with a default value and user object
            # The default value can be of type string, boolean, number, or JSON
            variable_value = open_feature_client.get_float_value(key, 10, context)
            question_answered = session_data["question"]["answered"]

            # Check if the question_ansewered is equal to or greater than variable_value
            if int(question_answered) >= int(variable_value):
                # Add the achievement to the list of new achievements
                new_achievements.append('achievement-first-question')

        except Exception as e:
            print(f"Exception when calling DevCycleLocalClient->variable_value: {e}")

    if 'achievement-world-traveler' not in earned_achievements:
        # Logic for Achievement - Work Traveler
        key = 'achievement-world-traveler'

        try:
            # Fetch variable values using the identifier key, with a default value and user object
            # The default value can be of type string, boolean, number, or JSON
            variable_value = open_feature_client.get_float_value(key, 10, context)
            question_answered = session_data["answered_correctly"]["regions"]

            # Check if the question_ansewered is equal to or greater than variable_value
            if int(question_answered) >= int(variable_value):
                # Add the achievement to the list of new achievements
                new_achievements.append('achievement-first-question')

        except Exception as e:
            print(f"Exception when calling DevCycleLocalClient->variable_value: {e}")


    # Add the new achievements to the list of earned achievements
    session_data["achievements"] += new_achievements

    return {"new_achievements": new_achievements}

@app.get("/checkbadge")
async def check_badge():
    """Check if the player has earned any badges."""
    # Get a list of all achievements the player has earned
    earned_badges = session_data["badges"]
    new_badges = list()

    if 'gym-badge-boulder-badge' not in earned_badges:
        # Logic for Achievement - First Question
        key = 'gym-badge-boulder-badge'

        try:
            # Fetch variable values using the identifier key, with a default value and user object
            # The default value can be of type string, boolean, number, or JSON
            variable_value = open_feature_client.get_float_value(key, 10, context)
            question_answered = session_data["answered_correctly"]["beginner"]

            # Check if the question_ansewered is equal to or greater than variable_value
            if int(question_answered) >= int(variable_value):
                # Add the achievement to the list of new achievements
                earned_badges.append('gym-badge-boulder-badge')

        except Exception as e:
            print(f"Exception when calling DevCycleLocalClient->variable_value: {e}")

    # Add the new achievements to the list of earned achievements
    session_data["badges"] += earned_badges

    return {"badges": earned_badges}

@app.get("/trivia")
def get_random_trivia():
    """Get a random multiple-choice trivia question."""
    trivia = random.choice(trivia_data)
    question_with_choices = {
        "question": trivia["question"],
        "options": random.sample(trivia["options"], len(trivia["options"])),
    }
    return question_with_choices

class Answer(BaseModel):
    question: str
    answer: str

@app.post("/trivia/answer")
async def check_answer(answer: Answer):
    data = answer.dict()
    """Check if the answer to a trivia question is correct."""
    question_text = data.get("question")
    user_answer = data.get("answer")

    # Find the trivia question
    trivia = next((q for q in trivia_data if q["question"] == question_text), None)
    if not trivia:
        raise HTTPException(status_code=404, detail="Question not found")

    # Find the trivia choice
    if user_answer not in trivia["options"]:
        raise HTTPException(status_code=400, detail="Invalid answer")

    # Check if the question has already been answered
    if trivia["question"] in session_data["question"]["asked"]:
        raise HTTPException(status_code=400, detail="Question already answered")

    # Add the difficulty to the answered_correctly
    difficulty = trivia["difficulty"].lower().replace(" ", "_")
    if difficulty not in session_data["answered_correctly"]:
        session_data["answered_correctly"][difficulty] = 0

    # Find the trivia categories
    categories = trivia["category"]

    # Add the categories to the answered_correctly
    for category in categories:
        category_key = category.lower().replace(" ", "_")
        if category_key not in session_data["answered_correctly"]:
            session_data["answered_correctly"][category_key] = 0

    # Increment the number of questions answered
    session_data["question"]["answered"] += 1

    # Add question to the list of qyestuons asked
    # session_data["question"]["asked"].append(trivia["question"])
    
    # Check if the answer is correct
    is_correct = user_answer == trivia["correct_answer"]

    if is_correct:
        session_data["streak"]["correct"] += 1 # Increment correct streak
        session_data["streak"]["wrong"] = 0 # Reset wrong streak
        session_data["answered_correctly"][difficulty] += 1 # Increment answered correctly for the difficulty
        for category in categories:
            category_key = category.lower().replace(" ", "_")
            session_data["answered_correctly"][category_key] += 1 # Increment answered correctly for the category
    else:
        session_data["streak"]["wrong"] += 1 # Increment wrong streak
        session_data["streak"]["correct"] = 0 # Reset correct streak

    return {
        "is_correct": is_correct, 
        "correct_answer": trivia["correct_answer"]
    }

@app.get("/trivia/all")
async def get_all_trivia():
    """Get all trivia questions."""
    # Remove questions that have already been asked from the list of trivia questions
    return {"trivia": trivia_data, "trivia_count": len(trivia_data)}

@app.post("/trivia/reset")
async def reset_session():
    """Reset the session data."""
    session_data["streak"]["correct"] = 0
    session_data["streak"]["wrong"] = 0
    session_data["question"]["asked"] = []
    return {"message": "Session has been reset"}