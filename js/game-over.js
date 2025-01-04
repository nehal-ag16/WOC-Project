

document.addEventListener("DOMContentLoaded", () => {
    const finalScore = localStorage.getItem('finalScore') || 0;
    const finalTime = localStorage.getItem('finalTime') || "00:00";

    document.getElementById('finalScore').textContent = finalScore;
    document.getElementById('finalTime').textContent = finalTime;

    // Fetch leaderboard
    fetchLeaderboard();

    document.getElementById('restartButton').addEventListener('click', () => {
        localStorage.removeItem('finalScore');
        localStorage.removeItem('finalTime');
        window.location.href = 'game.html';
    });

    document.getElementById('quitButton').addEventListener('click', () => {
        window.close();
    });
});

async function fetchLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard');
    leaderboardList.innerHTML = ''; // Clear existing list

    try {
        const snapshot = await db.collection('scores')
            .orderBy('score', 'desc')
            .limit(5)
            .get();

        snapshot.forEach(doc => {
            const data = doc.data();
            const listItem = document.createElement('li');
            listItem.textContent = `${data.name} - ${data.score}`;
            leaderboardList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching leaderboard: ", error);
    }
}
