// Initialize DevCycle SDK
const { initializeDevCycle } = DevCycle;

const sdkKey = "{{ SDK_KEY }}"; // Placeholder for the secret

let devcycleClient;
let gameMechanics = {}; // Store game mechanics
let gameAccessibility = {}; // Store game accessibility settings

// The user object needs either a user_id, or isAnonymous set to true
const user = { isAnonymous: true };

async function init() {
    try {
        // Call initialize with the client key and a user object
        devcycleClient = await initializeDevCycle(sdkKey, user).onClientInitialized();
        useDevCycleVariable();
    } catch (ex) {
        console.log(`Error initializing DevCycle: ${ex}`);
    }
}

function useDevCycleVariable() {
    if (!devcycleClient) return;

    gameMechanics = {
        "time_based_mechanics": {
            "timer_enabled": devcycleClient.variableValue("timer_enabled", false),
            "timer_duration": devcycleClient.variableValue('timer_duration', 10),
            "speed_bonus_active": devcycleClient.variableValue('speed_bonus_active', false)
        },
        "scoring_system": {
            "base_points": devcycleClient.variableValue('base_points', 10),
            "streak_bonus": devcycleClient.variableValue('streak_bonus', false),
            "difficulty_bonus": devcycleClient.variableValue('difficulty_bonus', 10),
            "max_score_per_round": devcycleClient.variableValue('max_score_per_round', 10),
            "streak_multiplier": devcycleClient.variableValue('streak_multiplier', 1.0)
        },
        "power_ups": {
            "fifty_fifty_enabled": devcycleClient.variableValue('fifty_fifty_enabled', true),
            "hint_enabled": devcycleClient.variableValue('hint_enabled', true),
            "skip_question": devcycleClient.variableValue('skip_question', false),
            "power_up_cost": devcycleClient.variableValue('power_up_cost', 50)
        },
        "progression_system": {
            "xp_per_correct": devcycleClient.variableValue('xp_per_correct', 10),
            "level_threshold": devcycleClient.variableValue('level_threshold', 100),
            "streak_achievements": devcycleClient.variableValue('streak_achievements', false),
            "unlock_new_categories": devcycleClient.variableValue('unlock_new_categories', true),
            "max_level": devcycleClient.variableValue('max_level', 50)
        }
    };
    console.log('Game Mechanics Loaded:', gameMechanics);
    document.getElementById('output').textContent = JSON.stringify(gameMechanics, null, 2);

    // Hide the "Load Mechanics" button
    document.getElementById('fetchMechanics').style.display = 'none';

    // Set timer duration based on game mechanics
    if (gameMechanics.time_based_mechanics.timer_enabled) {
        timerDuration = gameMechanics.time_based_mechanics.timer_duration;
    }

    gameAccessibility = {
        "high_contrast_mode_enabled": devcycleClient.variableValue('high_contrast_mode_enabled', false),
    };
    console.log('Game Accessibility Loaded:', gameAccessibility);
    document.getElementById('accessibilityOutput').textContent = JSON.stringify(gameAccessibility, null, 2)

}

document.getElementById('fetchMechanics').addEventListener('click', () => {
    useDevCycleVariable();
});

document.getElementById('startGame').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    loadNextQuestion(gameMechanics);
});

document.getElementById('homeLink').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'block';
    document.getElementById('game').style.display = 'none';
    document.getElementById('mechanics').style.display = 'none';
    document.getElementById('accessibility').style.display = 'none';
});

document.getElementById('mechanicsLink').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('game').style.display = 'none';
    document.getElementById('mechanics').style.display = 'block';
    document.getElementById('accessibility').style.display = 'none';
});

document.getElementById('accessibilityLink').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('game').style.display = 'none';
    document.getElementById('mechanics').style.display = 'none';
    document.getElementById('accessibility').style.display = 'block';
});

init();