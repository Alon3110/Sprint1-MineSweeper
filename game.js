'use strict'


const MINE = '💣'
const FLAG = '🚩'
const HIDE = '⏹️'
const EMPTY = ''


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
    gGame.isOn = true
    gGame.revealedCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0

    gBoard = buildBoard()
    randomMinesLocation()
    setMinesNegsCount(gBoard)

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
    setMinesNegsCount(board)

    return board
}

function renderBoard(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = 'cell cell-' + i + '-' + j
            strHTML += `<td  class="${className}" onclick="onCellClicked(this,${i},${j})">${HIDE}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    document.querySelector(selector).innerHTML = strHTML
}

function randomMinesLocation() {
    var board = gBoard

    for (var i = 0; i < gLevel.MINES; i++) {

        var rowIdx = getRandomIntInclusive(0, gLevel.SIZE - 1)
        var colIdx = getRandomIntInclusive(0, gLevel.SIZE - 1)
        if (!board[rowIdx][colIdx].isMine) {
            board[rowIdx][colIdx].isMine = MINE
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
    if (!gGame.isOn || cell.isRevealed || cell.isMarked || cell.isMine) return

    cell.isRevealed = true
    gGame.revealedCount++

    if (cell.isMine) {
        elCell.innerText = MINE
    } else {
        elCell.innerText = cell.minesAroundCount || EMPTY
        revealNegs(i, j)
    }



}

function revealNegs(rowIdx, colIdx) {
    if (gBoard[rowIdx][colIdx].minesAroundCount > 0) {
        gBoard[rowIdx][colIdx].isRevealed = true
        gGame.revealedCount++
        return
    }else {

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

function onCellMarked(elCell, i, j) {

}

function checkGameOver() {

}