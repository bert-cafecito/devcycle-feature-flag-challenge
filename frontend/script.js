// Constants for APIs
const QUESTION_API_URL = 'http://localhost:8000/trivia';
const PROFILE_API_URL = 'http://localhost:8000/whoami';
const ACHIEVEMENT_API_URL = 'http://localhost:8000/checkachievement';
const ANSWER_API_URL = 'http://localhost:8000/trivia/answer';

// Variables to store question data and player profile
let currentQuestion = null;
let currentAnswer = null;

// Fetch question and update UI
async function fetchQuestion() {
    try {
        const response = await fetch(QUESTION_API_URL, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to fetch question.');
        const data = await response.json();
        currentQuestion = data;

        document.getElementById('question-text').textContent = data.question;
        document.getElementById('options-container').innerHTML = data.options
            .map(option => `<button class="btn btn-secondary m-1">${option}</button>`)
            .join('');
        document.getElementById('answer-btn').disabled = false;

        // Attach event listener for options
        const buttons = document.querySelectorAll('#options-container button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                currentAnswer = button.textContent; // Store the selected answer
                handleAnswer(currentAnswer);
            });
        });
    } catch (error) {
        console.error(error);
    }
}

// Handle answering the question
async function handleAnswer(selectedAnswer) {
    // Disable options and answer button to prevent multiple clicks
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.querySelectorAll('button').forEach(button => button.disabled = true);
    document.getElementById('answer-btn').disabled = true;

    // Send answer to check via API
    const isCorrect = await checkAnswer(selectedAnswer);
    
    // Show feedback based on correctness
    displayAnswerFeedback(isCorrect);

    // Check for achievements after the answer
    await checkAchievements();

    // Load next question after delay
    setTimeout(() => fetchQuestion(), 5000);
}

// Send answer for checking
async function checkAnswer(selectedAnswer) {
    try {
        const response = await fetch(ANSWER_API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: currentQuestion.question,
                answer: selectedAnswer
            })
        });

        const data = await response.json();
        return data.is_correct; // Return whether the answer is correct
    } catch (error) {
        console.error(error);
        return false; // Assume incorrect answer in case of failure
    }
}

// Display feedback based on whether the answer was correct or not
function displayAnswerFeedback(isCorrect) {
    const feedbackElement = document.getElementById('feedback');
    
    if (isCorrect) {
        showConfetti();
        feedbackElement.textContent = "Correct! 🎉";
        feedbackElement.classList.add('correct');
        feedbackElement.classList.remove('incorrect');
    } else {
        showSadTrombone();
        feedbackElement.textContent = "Wrong! 😞";
        feedbackElement.classList.add('incorrect');
        feedbackElement.classList.remove('correct');
    }
}

// Confetti animation for correct answer
function showConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.classList.add('confetti');
    
    for (let i = 0; i < 10; i++) {
        const confettiPiece = document.createElement('span');
        confettiContainer.appendChild(confettiPiece);
    }

    document.body.appendChild(confettiContainer);
    setTimeout(() => confettiContainer.remove(), 2000);
}

// Sad trombone animation for wrong answer
function showSadTrombone() {
    const sadTrombone = document.createElement('div');
    sadTrombone.classList.add('sad-trombone');
    sadTrombone.textContent = "Wah wahhh!";
    document.body.appendChild(sadTrombone);
    setTimeout(() => sadTrombone.remove(), 1000);
}

// Check for achievements
async function checkAchievements() {
    try {
        const response = await fetch(ACHIEVEMENT_API_URL, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        const data = await response.json();

        // Check for new achievements
        if (data.new_achievements.length > 0) {
            alert(`New Achievements: ${data.new_achievements.join(', ')}`);
        }
    } catch (error) {
        console.error(error);
    }
}

// Fetch player profile and update UI
async function fetchPlayerProfile() {
    try {
        const response = await fetch(PROFILE_API_URL, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to fetch player profile.');

        const data = await response.json();
        updateProfile(data);
    } catch (error) {
        console.error(error);
    }
}

// Update profile data
function updateProfile(profileData) {
    document.getElementById('player-name').textContent = profileData.player_name;
    document.getElementById('streak-correct').textContent = profileData.streak.correct;
    document.getElementById('streak-wrong').textContent = profileData.streak.wrong;
    document.getElementById('questions-answered').textContent = profileData.question.answered;
    document.getElementById('questions-asked').textContent = profileData.question.asked.length;
    document.getElementById('answered-correctly').textContent = JSON.stringify(profileData.answered_correctly);

    // Update badges and achievements
    document.getElementById('badges').innerHTML = profileData.badges.map(badge => `<div class="badge">${badge}</div>`).join('');
    document.getElementById('achievements').innerHTML = profileData.achievements.map(achievement => `<div class="badge">${achievement}</div>`).join('');

    // Update progress bar (example with streaks)
    updateLevelProgress(profileData.streak.correct);
}

// Update level progress bar
function updateLevelProgress(correctAnswers) {
    const progressBar = document.getElementById('level-progress-bar');
    let level = Math.min(correctAnswers * 10, 100);
    progressBar.style.width = `${level}%`;
}

// Profile slider toggle
document.getElementById('show-profile-btn').addEventListener('click', () => {
    document.getElementById('profile-slider').style.display = 'block';
    fetchPlayerProfile();
});

document.getElementById('close-slider').addEventListener('click', () => {
    document.getElementById('profile-slider').style.display = 'none';
});

// Initialize the app
fetchQuestion();
