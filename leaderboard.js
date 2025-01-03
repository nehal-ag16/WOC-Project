document.addEventListener("DOMContentLoaded", () => {
    const finalScore = localStorage.getItem('finalScore') || 0;
    const finalTime = localStorage.getItem('finalTime') || "00:00";

    document.getElementById('finalScore').textContent = finalScore;
    document.getElementById('finalTime').textContent = finalTime;

    document.getElementById('restartButton').addEventListener('click', () => {
        window.location.href = 'login.html'; // Redirect to your game start page
    });

    document.getElementById('quitButton').addEventListener('click', () => {
        window.close(); // This will close the current window
    });
});
