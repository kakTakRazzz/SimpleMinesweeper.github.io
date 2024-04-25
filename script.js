var width, height, mines, cells, timerInterval, secondsElapsed, firstClick;

function startGame(difficulty) {
    clearInterval(timerInterval);
    secondsElapsed = 0;
    document.getElementById('time').textContent = secondsElapsed;
    var timer = document.getElementById('timer');
    timer.style.display = 'none';
    var message = document.getElementById('message');
    message.textContent = '';
    message.style.display = 'none';
    firstClick = true;
    if (difficulty === 'easy') {
        width = 9;
        height = 9;
        mines = 10;
    } else if (difficulty === 'medium') {
        width = 16;
        height = 16;
        mines = 40;
    } else if (difficulty === 'hard') {
        width = 30;
        height = 16;
        mines = 99;
    }
    var board = document.getElementById('board');
    board.style.gridTemplateColumns = `repeat(${width}, 30px)`;
    board.innerHTML = '';
    cells = [];
    for (var i = 0; i < height; i++) {
        var row = [];
        for (var j = 0; j < width; j++) {
            var cell = document.createElement('div');
            cell.classList.add('cell', 'hidden');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', revealCell);
            cell.addEventListener('contextmenu', toggleFlag);
            board.appendChild(cell);
            row.push({
                element: cell,
                isMine: false,
                isRevealed: false,
                count: 0
            });
        }
        cells.push(row);
    }
    placeMines();
}

function updateTimer() {
    secondsElapsed++;
    document.getElementById('time').textContent = secondsElapsed;
}

function placeMines() {
    for (var k = 0; k < mines; k++) {
        var x, y;
        do {
            x = Math.floor(Math.random() * width);
            y = Math.floor(Math.random() * height);
        } while (cells[y][x].isMine);
        cells[y][x].isMine = true;
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                var nx = x + dx;
                var ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height && !cells[ny][nx].isMine) {
                    cells[ny][nx].count++;
                }
            }
        }
    }
}

function revealCell(event) {
    var cell = event.target;
    if (firstClick) {
        firstClick = false;
        var timer = document.getElementById('timer');
        timer.style.display = 'block';
        timerInterval = setInterval(updateTimer, 1000);
    }
    if (cell.classList.contains('hidden')) {
        cell.classList.remove('hidden');
        var row = parseInt(cell.dataset.row);
        var col = parseInt(cell.dataset.col);
        if (cells[row][col].isMine) {
            cell.classList.add('mine');
            gameOver();
        } else {
            cell.classList.add('number');
            cell.textContent = cells[row][col].count || '';
            if (cells[row][col].count === 0) {
                for (var dx = -1; dx <= 1; dx++) {
                    for (var dy = -1; dy <= 1; dy++) {
                        var nx = col + dx;
                        var ny = row + dy;
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            revealCell({ target: cells[ny][nx].element });
                        }
                    }
                }
            }
            checkWin();
        }
    }
}

function toggleFlag(event) {
    event.preventDefault();
    var cell = event.target;
    if (cell.classList.contains('hidden')) {
        cell.classList.toggle('flag');
    }
}

function gameOver() {
    clearInterval(timerInterval);
    alert('Поражение!');
}

function checkWin() {
    var remainingCells = width * height - mines;
    var revealedCount = 0;
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (cells[i][j].element.classList.contains('number') || cells[i][j].element.classList.contains('flag')) {
                revealedCount++;
            }
        }
    }
    if (revealedCount === remainingCells) {
        clearInterval(timerInterval);
        var message = document.getElementById('message');
        message.textContent = 'Победа!';
        message.style.display = 'block';
    }
}