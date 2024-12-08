function startTimer(duration, display, gameMechanics) {
    let timer = duration;
    display.textContent = `Time left: ${timer} seconds`;

    timerInterval = setInterval(() => {
        timer--;
        display.textContent = `Time left: ${timer} seconds`;

        if (timer <= 0) {
            clearInterval(timerInterval);
            handleAnswer(null, gameMechanics); // Move to the next question when time is up
        }
    }, 1000);
}