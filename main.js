// Onload makes sure the DOM is loaded before running functions()
window.onload = function() {

    const state = {
        // Boards rest state
        board: [],
        symbols: ["🙈", "💩"],
        currentPlayer: 0,
        status: "playing",
        winningSector: null

    }

    // ClickEvent 
    function handleClick(e) {
        const square = +e.target.id

        if (isEmpty(square)) {

            fillSquare(square)
            evaluateBoard(square)

            if (state.status === "playing")
                nextPlayer()

            render()
        }
    }


    function isEmpty(index) {
        return !state.board[index];
    }

    // Draws current player to the DOM
    function fillSquare(index) {
        state.board[index] = currentPlayer();
    }

    // Returns the symbol of the currentPlayer
    function currentPlayer() {
        return state.symbols[state.currentPlayer]
    }

    // Toggles current player
    function nextPlayer() {
        if (state.currentPlayer === 0) {
            state.currentPlayer = 1;
        } else {
            state.currentPlayer = 0;
        }
    }

    // All possible winning combos
    const winningSectors = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    // Update winning/tie sectors
    function evaluateBoard(lastClicked) {
        state.winningSector = isGameWon(lastClicked)

        if (state.winningSector) {
            state.status = "won"
        } else if (isGameTied()) {
            state.status = "tied"
        }
    }

    // Takes the index of the last clicked square
    function isGameWon(lastClicked) {
        for (let i = 0; i <= 7; i++) {
            let sector = winningSectors[i]

            if (isSectorAWinner(sector)) {
                return sector
            }
        }
    }


    // Evals who won
    function isSectorAWinner(sector) {
        let symbol = currentPlayer()

        for (let i = 0; i <= 2; i++) {
            if (state.board[sector[i]] !== symbol) {
                return false
            }


        }
        return true
    }

    // Checks board to see if there is a winner
    function isGameTied() {
        for (let i = 0; i <= 8; i++) {
            if (!state.board[i]) {
                return false
            }
        }
        return true
    }

    // Re-renders the game board if there is a tie or winner
    function newGame() {
        state.board = [];
        state.winningSector = null;
        state.currentPlayer = 0;
        state.status = 'playing';
        render();
    }

    // Draws the board
    function render() {
        const BOARD = document.getElementById('board')
        BOARD.innerHTML = ''
        const boardRows = winningSectors.slice(0, 3)

        // Loop through state.board and display the
        // current state of the board
        boardRows.forEach(row => {
            const ROW = document.createElement('div')
            ROW.className = 'row'

            row.forEach(index => {
                const square = document.createElement('div')

                square.id = index
                square.className = 'square'
                square.innerHTML = state.board[index] || ''
                square.addEventListener('click', handleClick)


                // If the game is won, highlight the winner
                if (state.winningSector && state.winningSector.includes(index)) {
                    square.classList.add('win')
                } else if (state.status === 'tied') {
                    // If the game is tied, darken every square on the board
                    square.classList.add('tie')
                }

                ROW.appendChild(square)
            })

            BOARD.appendChild(ROW)
        })

        // Updates players-turn message
        updateBanners()
    }

    // Displays the appropriate messages
    // based on the state of the game
    function updateBanners() {
        // Use state.status to display relevant messages
        const playersTurnMessage = document.getElementById('players-turn')

        if (state.status === 'playing') {
            // If the game status is "playing"
            // Hide Win/Tie Banners and show Player's Turn Message
            document.querySelectorAll('.banner')
                .forEach(banner =>
                    banner.classList.add('hidden')
                )

            playersTurnMessage.classList.remove('invisible')
            playersTurnMessage.innerHTML = `Player ${currentPlayer()}'s Turn`

        } else {
            // If game status is "tied" or "won"
            // hide/show relevant banners/messages
            playersTurnMessage.classList.add('invisible')

            if (state.status === 'won') {
                const winMessage = document.getElementById('win-message')
                winMessage.classList.remove('hidden')
                winMessage.innerHTML = `"${currentPlayer()}" WINS!`
            } else if (state.status === 'tied') {
                document.getElementById('tie-message').classList.remove('hidden')
            }
        }
    }

    // Initialize the game
    document.getElementById('new-game').addEventListener('click', newGame)
    render()
}