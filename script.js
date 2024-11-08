class MemeGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.isPlaying = false;
        this.currentPlayer = 1;
        this.scores = {};
        this.timeLeft = 60;
        this.timer = null;
        
        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.gameBoard = document.getElementById('game-board');
        this.startButton = document.getElementById('start-game');
        this.gridSize = document.getElementById('grid-size');
        this.playerCount = document.getElementById('player-count');
        this.timeDisplay = document.getElementById('time');
        this.scoreDisplay = document.getElementById('score');
        this.currentPlayerDisplay = document.getElementById('current-player');
        this.playerScoresDisplay = document.getElementById('player-scores');
    }

    addEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.gridSize.addEventListener('change', () => this.updateGridLayout());
    }

    startGame() {
        this.resetGame();
        this.isPlaying = true;
        this.initializePlayers();
        this.createCards();
        this.startTimer();
        this.startButton.textContent = 'Restart Game';
    }

    resetGame() {
        clearInterval(this.timer);
        this.gameBoard.innerHTML = '';
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.timeLeft = 60;
        this.updateTimer();
        this.scores = {};
        this.currentPlayer = 1;
        this.updateScoreDisplay();
        this.updateCurrentPlayerDisplay();
    }

    initializePlayers() {
        const playerCount = parseInt(this.playerCount.value);
        for (let i = 1; i <= playerCount; i++) {
            this.scores[i] = 0;
        }
        this.updateScoreboard();
    }

    createCards() {
        const totalCards = parseInt(this.gridSize.value);
        const memes = this.generateMemePairs(totalCards / 2);
        this.cards = this.shuffleArray(memes);
        
        this.gameBoard.className = `game-board grid-${totalCards}`;
        
        this.cards.forEach((meme, index) => {
            const card = this.createCardElement(meme, index);
            this.gameBoard.appendChild(card);
        });
    }

    createCardElement(meme, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<img src="memes/${meme}.jpg" alt="meme">`;
        card.dataset.index = index;
        card.addEventListener('click', () => this.flipCard(card));
        return card;
    }

    flipCard(card) {
        if (!this.isPlaying || this.flippedCards.length >= 2 || card.classList.contains('show')) {
            return;
        }

        card.classList.add('show');
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            setTimeout(() => this.checkMatch(), 1000);
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const match = card1.querySelector('img').src === card2.querySelector('img').src;

        if (match) {
            this.handleMatch();
        } else {
            this.handleMismatch();
        }

        this.flippedCards = [];
        this.checkGameEnd();
    }

    handleMatch() {
        this.matchedPairs++;
        this.scores[this.currentPlayer] += 10;
        this.updateScoreDisplay();
        this.updateScoreboard();
    }

    handleMismatch() {
        this.flippedCards.forEach(card => card.classList.remove('show'));
        this.currentPlayer = this.currentPlayer % Object.keys(this.scores).length + 1;
        this.updateCurrentPlayerDisplay();
    }

    checkGameEnd() {
        if (this.matchedPairs === this.cards.length / 2) {
            clearInterval(this.timer);
            this.isPlaying = false;
            this.announceWinner();
        }
    }

    startTimer() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        clearInterval(this.timer);
        this.isPlaying = false;
        this.announceWinner();
    }

    announceWinner() {
        const winner = Object.entries(this.scores).reduce((a, b) => b[1] > a[1] ? b : a);
        alert(`Game Over! Player ${winner[0]} wins with ${winner[1]} points!`);
    }

    updateTimer() {
        this.timeDisplay.textContent = this.timeLeft;
    }

    updateScoreDisplay() {
        this.scoreDisplay.textContent = this.scores[this.currentPlayer];
    }

    updateCurrentPlayerDisplay() {
        this.currentPlayerDisplay.textContent = `Player ${this.currentPlayer}`;
    }

    updateScoreboard() {
        this.playerScoresDisplay.innerHTML = Object.entries(this.scores)
            .map(([player, score]) => `
                <div class="player-score">
                    Player ${player}: ${score} points
                </div>
            `).join('');
    }

    generateMemePairs(pairCount) {
        const memes = Array.from({length: pairCount}, (_, i) => i + 1);
        return [...memes, ...memes];
    }

    shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    updateGridLayout() {
        const totalCards = parseInt(this.gridSize.value);
        this.gameBoard.className = `game-board grid-${totalCards}`;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemeGame();
});
