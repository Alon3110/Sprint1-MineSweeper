'use strict'


const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''



var gCell = {
    minesAroundCount: 0,
    isRevealed: false,
    isMine: false,
    isMarked: false
}
var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInIt() {
    gBoard = buildBoard()
    renderBoard(gBoard, '.board')
    gGame.isOn = true
    gCell.minesAroundCount = setMinesNegsCount(gBoard)
}

function buildBoard() {
    var size = gLevel.SIZE
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = gCell.minesAroundCount
        }
    }

    board[1][1] = MINE
    board[2][2] = MINE

    return board
}

function setMinesNegsCount(board) {
    var minesAroundCount = 0
    var size = gLevel.SIZE
    for (var i = 0; i < size; i++) {
        if (i < 0 || i >= size) continue       
        for (var j = 0; j < size; j++) {

            if (j < 0 || j >= size) continue
            var cell = gBoard[i][j]
            if (cell === EMPTY) continue
            if (cell === gCell.minesAroundCount) continue
            if (cell === MINE) minesAroundCount++
        }
    }

    return minesAroundCount
}

function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    console.log('Cell clicked:', elCell, i, j)
    elCell = document.querySelector('.cell')
    elCell.innerText = setMinesNegsCount(gBoard)

}

function onCellMarked(elCell, i, j) {

}

function checkGameOver() {

}

function expandReveal(board, elCell, i, j) {

}