let score = 0;
let streak = 0;
let xp = 0;
let level = 1;
let currentQuestion = {};
let correctAnswer = "";
let timerInterval;

function loadNextQuestion(gameMechanics) {
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const xpElement = document.getElementById('xp');

    // Select a random question from the question bank
    const randomIndex = Math.floor(Math.random() * questionBank.length);
    currentQuestion = questionBank[randomIndex];

    questionElement.textContent = currentQuestion.question;
    answersElement.innerHTML = '';
    timerElement.textContent = `Time left: ${gameMechanics.time_based_mechanics.timer_duration} seconds`;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.setAttribute('aria-label', `Answer: ${answer}`);
        button.addEventListener('click', () => {
            clearInterval(timerInterval);
            handleAnswer(answer, gameMechanics);
        });
        answersElement.appendChild(button);
    });

    if (gameMechanics.time_based_mechanics.timer_enabled) {
        startTimer(gameMechanics.time_based_mechanics.timer_duration, timerElement, gameMechanics);
    } else {
        timerElement.style.display = 'none';
    }

    // Enable power-ups
    enablePowerUps(gameMechanics);
}

function handleAnswer(answer, gameMechanics) {
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const xpElement = document.getElementById('xp');

    if (answer === currentQuestion.correctAnswer) {
        streak++;
        let points = gameMechanics.scoring_system.base_points;
        if (gameMechanics.scoring_system.streak_bonus) {
            points += streak * gameMechanics.scoring_system.streak_multiplier;
        }
        points += gameMechanics.scoring_system.difficulty_bonus;
        score += points;

        // Update XP and level
        xp += gameMechanics.progression_system.xp_per_correct;
        if (xp >= gameMechanics.progression_system.level_threshold) {
            level++;
            xp = 0; // Reset XP after leveling up
        }
    } else {
        streak = 0;
    }
    scoreElement.textContent = `Score: ${score}`;
    levelElement.textContent = `Level: ${level}`;
    xpElement.textContent = `XP: ${xp}`;
    loadNextQuestion(gameMechanics);
}

function enablePowerUps(gameMechanics) {
    const fiftyFiftyButton = document.getElementById('fiftyFifty');
    const hintButton = document.getElementById('hint');
    const skipButton = document.getElementById('skip');

    if (gameMechanics.power_ups.fifty_fifty_enabled) {
        fiftyFiftyButton.style.display = 'inline-block';
        fiftyFiftyButton.addEventListener('click', useFiftyFifty);
    } else {
        fiftyFiftyButton.style.display = 'none';
    }

    if (gameMechanics.power_ups.hint_enabled) {
        hintButton.style.display = 'inline-block';
        hintButton.addEventListener('click', useHint);
    } else {
        hintButton.style.display = 'none';
    }

    if (gameMechanics.power_ups.skip_question) {
        skipButton.style.display = 'inline-block';
        skipButton.addEventListener('click', () => skipQuestion(gameMechanics));
    } else {
        skipButton.style.display = 'none';
    }
}

function useFiftyFifty() {
    const answersElement = document.getElementById('answers');
    const buttons = Array.from(answersElement.getElementsByTagName('button'));
    const incorrectAnswers = buttons.filter(button => button.textContent !== currentQuestion.correctAnswer);

    // Remove two incorrect answers
    for (let i = 0; i < 2 && incorrectAnswers.length > 0; i++) {
        const index = Math.floor(Math.random() * incorrectAnswers.length);
        incorrectAnswers[index].remove();
        incorrectAnswers.splice(index, 1);
    }
}

function useHint() {
    alert(`Hint: The correct answer is ${currentQuestion.correctAnswer}`);
}

function skipQuestion(gameMechanics) {
    clearInterval(timerInterval);
    loadNextQuestion(gameMechanics);
}