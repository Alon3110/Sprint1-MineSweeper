'use strict'


const MINE = '💣'
const FLAG = '🚩'
const HIDE = '⏹️'
const EMPTY = ''
const NORMAL = '😊'
const LOSE = '🤯'
const WIN = '😎'



var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    isFirstClick: true,
    secsPassed: 0,
    isWin: false,
    livesLeft: 3
}

function onInIt() {
    gGame.isOn = true
    gGame.livesLeft = 3
    gGame.revealedCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.isFirstClick = true

    // randomMinesLocation()
    // setMinesNegsCount(gBoard)
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
        randomMinesLocation(i, j)
        setMinesNegsCount(gBoard)
        gGame.isFirstClick = false

    }

    if (cell.isMine) {
        elCell.innerText = MINE
        checkGameOver()
    } else {
        elCell.innerText = cell.minesAroundCount || EMPTY
        revealNegs(i, j)
    }
    checkGameOver()
}

function revealNegs(rowIdx, colIdx) {
    if (gBoard[rowIdx][colIdx].minesAroundCount > 0) {
        gBoard[rowIdx][colIdx].isRevealed = true
        // gGame.revealedCount++
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
        gGame.markedCount++
    } else {
        cell.isMarked = false
        elCell.innerText = HIDE
        gGame.markedCount--
    }
    checkGameOver()
}

// function checkGameOver() {
//     if (!gGame.isOn) return
//     // var livesLeft = 3
//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard.length; j++) {
//             var cell = gBoard[i][j]
//             if (cell.isMine && cell.isRevealed) {
//                 gGame.isOn = false
//                 console.log('Game Over')
//                 return
//             }
//         }
//         if (gGame.revealedCount === gLevel.SIZE ** 2 - gLevel.MINES &&
//             gGame.markedCount === gLevel.MINES
//         ) {
//             gGame.isWin = true
//             gGame.isOn = false
//             console.log('Win')
//         }
//     }
// }

// function checkGameOver() {
//     if (!gGame.isOn) return

//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard[i].length; j++) {
            
//             var cell = gBoard[i][j]
//             if (cell.isMine && cell.isRevealed) {
//                 gGame.livesLeft--
//                 renderCell({ i, j }, MINE)
//                 console.log('you died, you have: ' ,gGame.livesLeft, ' lives left' )
//                 continue
//             }
//         }
//         if(gGame.livesLeft === 0) {
//             gGame.isOn = false
//             console.log('Game Over')
//             return
//         }
//         if (gGame.revealedCount === gLevel.SIZE ** 2 - gLevel.MINES &&
//             gGame.markedCount === gLevel.MINES
//         ) {
//             gGame.isWin = true
//             gGame.isOn = false
//             console.log('Win')
//         }
//     }
// }

function checkGameOver() {
    if (!gGame.isOn) return

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            
            var cell = gBoard[i][j]
            if (cell.isMine && cell.isRevealed) {
                gGame.livesLeft--
                renderCell({ i, j }, MINE)
                console.log('you died, you have: ' ,gGame.livesLeft, ' lives left' )
                continue
            }
        }
        if(gGame.livesLeft === 0) {
            gGame.isOn = false
            console.log('Game Over')
            return
        }
        if (gGame.revealedCount === gLevel.SIZE ** 2 - gLevel.MINES &&
            gGame.markedCount === gLevel.MINES
        ) {
            gGame.isWin = true
            gGame.isOn = false
            console.log('Win')
        }
    }
}

