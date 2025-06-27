'use strict'


const MINE = '💣'
const FLAG = '🚩'
const HIDE = '🔳'
const EMPTY = ''
const NORMAL = '😊'
const LOSE = '🤯'
const WIN = '😎'
const SAFE = '🛟'


var gGameStartTime = 0
var gInterval
var gBoard


var gLevel = {
    SIZE: 4,
    MINES: 2,
}

var gBoardSize = gLevel.SIZE ** 2



var gGame = {
    isOn: false,
    // isHint: false,
    revealedCount: 0,
    markedCount: 0,
    isFirstClick: true,
    safeAmount: 3,
    secsPassed: 0,
    isWin: false,
    livesLeft: 3,
    // hintLeft: 3
}

function onInIt() {
    gGame.isOn = true
    gGame.livesLeft = 3
    gGame.safeAmount = 3
    gGame.hintLeft = 3
    gGame.revealedCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.isFirstClick = true
    clearInterval(gInterval)

    document.querySelector('.emoji button').innerText = NORMAL;
    document.querySelector('.modal').style.display = 'none'
    document.querySelector('.win').style.display = 'none'

    document.querySelector('.timer .min').innerText = '00';
    document.querySelector('.timer .sec').innerText = '00';
    document.querySelector('h2 span').innerText = gGame.livesLeft

    gBoard = buildBoard()
    renderBoard(gBoard, '.board')
}

function createCell() {
    return {
        minesAroundCount: 0,
        isRevealed: false,
        isMine: false,
        isMarked: false
    }
}

function buildBoard() {
    var size = gLevel.SIZE
    const board = []
    for (var i = 0; i < size; i++) {
        board[i] = []

        for (var j = 0; j < size; j++) {
            board[i][j] = createCell()
        }
    }
    // board[2][2].isMine = true
    // board[2][1].isMine = true
    // setMinesNegsCount(board)

    return board
}

function renderBoard(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = 'cell cell-' + i + '-' + j
            strHTML += `<td  class="${className}" onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(event, this,${i},${j})">${HIDE}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    document.querySelector(selector).innerHTML = strHTML
}

function randomMinesLocation(firstI, firstJ) {
    var board = gBoard

    for (var i = 0; i < gLevel.MINES;) {

        var rowIdx = getRandomIntInclusive(0, gLevel.SIZE - 1)
        var colIdx = getRandomIntInclusive(0, gLevel.SIZE - 1)
        if (rowIdx === firstI && colIdx === firstJ) continue
        if (!board[rowIdx][colIdx].isMine) {
            board[rowIdx][colIdx].isMine = true
            i++
        }
    }
}

function setMinesNegsCount(board) {
    var minesAroundCount = 0

    var size = gLevel.SIZE
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            board[i][j].minesAroundCount = countMinesAround(board, i, j)
        }
    }
    return minesAroundCount
}

function countMinesAround(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (board[i][j].isMine) count++
        }
    }
    return count
}

function onCellClicked(elCell, i, j) {

    const cell = gBoard[i][j]
    if (!gGame.isOn || cell.isRevealed || cell.isMarked) return
    cell.isRevealed = true

    gGame.revealedCount++
    console.log('revealed ', gGame.revealedCount);


    if (gGame.isFirstClick) {
        gGameStartTime = Date.now()
        startTimer()
        randomMinesLocation(i, j)
        setMinesNegsCount(gBoard)
        gGame.isFirstClick = false

    }
    if (gGame.isHint) {
        hintMode(i, j)
        return
    }

    if (cell.isMine) {
        elCell.innerText = MINE
        checkGameOver({ i, j })
    } else {
        elCell.innerText = cell.minesAroundCount || EMPTY
        elCell.classList.add('revealed');
        revealNegs(i, j)
        checkGameOver({ i, j })
    }
}

function revealNegs(rowIdx, colIdx) {
    if (gBoard[rowIdx][colIdx].minesAroundCount > 0) {
        gBoard[rowIdx][colIdx].isRevealed = true

        return
    } else {

        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue

            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (j < 0 || j >= gBoard[i].length) continue
                if (i === rowIdx && j === colIdx) continue
                var cell = gBoard[i][j]
                if (cell.isMine || cell.isRevealed || cell.isMarked) continue

                cell.isRevealed = true

                gGame.revealedCount++

                const elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.add('revealed')
                elCell.innerText = cell.minesAroundCount ? cell.minesAroundCount : ''
                if (cell.minesAroundCount >= 0) {

                    revealNegs(i, j)
                }

            }
        }
    }

}

function onCellMarked(ev, elCell, i, j) {
    ev.preventDefault()

    if (!gGame.isOn) return

    const cell = gBoard[i][j]
    if (cell.isRevealed) return

    if (!cell.isMarked) {
        cell.isMarked = true
        elCell.innerText = FLAG
        gGame.revealedCount++
        console.log('revealed flag', gGame.revealedCount)
        gGame.markedCount++
        console.log('count flags', gGame.markedCount)
        checkGameOver({ i, j })
    } else {
        cell.isMarked = false
        elCell.innerText = HIDE
        gGame.revealedCount--
        console.log('is revealed', gGame.revealedCount);
        gGame.markedCount--
        console.log(gGame.markedCount)
    }

}


function checkGameOver(pos) {
    if (!gGame.isOn) return

    var cell = gBoard[pos.i][pos.j]
    if (cell.isMine && cell.isRevealed) {
        gGame.livesLeft--
        renderCell(pos, MINE)
        document.querySelector('h2 span').innerText = gGame.livesLeft

        if (gGame.livesLeft === 0) {
            document.querySelector('.emoji button').innerText = LOSE
            document.querySelector('.modal').style.display = 'block'
            gGame.isOn = false
            clearInterval(gInterval)
            console.log('Game Over')

            for (var i = 0; i < gBoard.length; i++) {
                for (var j = 0; j < gBoard[i].length; j++) {
                    var currCell = gBoard[i][j]
                    if (currCell.isMine && !currCell.isRevealed) {
                        renderCell({ i, j }, MINE)
                    }
                }
            }
            return
        }
        setTimeout(() => {
            cell.isRevealed = false;
            gGame.revealedCount--;
            renderCell(pos, HIDE);
        }, 500);
        return
    }

    console.log('check win', gGame.revealedCount, gGame.markedCount, gGame.livesLeft);

    if (gGame.revealedCount === gBoardSize && gGame.markedCount >= 0 &&
        gGame.livesLeft > 0) {
        gGame.isWin = true
        document.querySelector('.emoji button').innerText = WIN
        console.log('Win')
        document.querySelector('.win').style.display = 'block'
        clearInterval(gInterval)
        gGame.isOn = false
        updateBestTime()
    }
}

function startTimer() {

    var startTime = Date.now()
    clearInterval(gInterval)

    gInterval = setInterval(function () {
        var now = Date.now()
        var diff = now - startTime

        var secs = Math.floor(diff / 1000)
        var min = Math.floor(secs / 60)
        var secsForDisplay = secs % 60

        if (secsForDisplay < 10) secsForDisplay = '0' + secsForDisplay
        if (min < 10) min = '0' + min

        document.querySelector('.timer .min').innerText = min
        document.querySelector('.timer .sec').innerText = secsForDisplay
    }, 50)

}

function setBoardSize(elNum, elMine) {
    gLevel.SIZE = elNum
    gBoardSize = elNum ** 2
    gLevel.MINES = elMine
    onInIt()
}

function safeClick() {
    if (gGame.safeAmount === 0) return

    var safeCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]
            if (!cell.isMine && !cell.isRevealed) {
                
                safeCells.push({ i, j })
            }
        }
    }

    if (safeCells.length === 0) {
        return
    }

    var randomIdx = getRandomIntInclusive(0, safeCells.length - 1)
    var safeCell = safeCells[randomIdx]
    console.log('Safe Click:', safeCell)

    var elCell = document.querySelector(`.cell-${safeCell.i}-${safeCell.j}`)
    elCell.innerText = SAFE

    setTimeout(() => {
        elCell.innerText = HIDE
    }, 300)
    gGame.safeAmount--
}

function toggleLightMode() {
    var btn = document.querySelector('.dark-mode-btn')

    if (document.body.className === 'light-mode') {
        document.body.className = ''
        btn.innerText = 'Light Mode'
    } else {
        document.body.className = 'light-mode'
        btn.innerText = 'Dark Mode'
    }
}

function updateBestTime() {
    var levelKey = `bestTime-${gLevel.SIZE}x${gLevel.SIZE}`
    var now = Date.now()
    var timeTaken = Math.floor((now - gGameStartTime) / 1000)

    var bestTime = localStorage.getItem(levelKey)
    if (!bestTime || timeTaken < bestTime) {
        localStorage.setItem(levelKey, timeTaken)
        renderBestTime()
    }
}

function renderBestTime() {
    var levelKey = `bestTime-${gLevel.SIZE}x${gLevel.SIZE}`
    var bestTime = localStorage.getItem(levelKey)

    var display = '--:--'
    if (bestTime) {
        var min = Math.floor(bestTime / 60)
        var sec = bestTime % 60
        if (min < 10) min = '0' + min
        if (sec < 10) sec = '0' + sec
        display = `${min}:${sec}`
    }

    document.querySelector('.best-time').innerText = display
}