/**
 * NEXUS_XO - Van AI Predictive Decision Matrix Engine
 * Architectural Focus: Strict client-side matrix processing without overhead.
 */

let boardState = ["", "", "", "", "", "", "", "", ""];
let activeGame = true;

const playerVal = "X";
const computerVal = "O";

const winningVectors = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal arrays
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical arrays
    [0, 4, 8], [2, 4, 6]             // Diagonal arrays
];

const statusDisplay = document.getElementById("status-display");
const cells = document.querySelectorAll(".cell");

// Initialize listeners across the matrix vector array
cells.forEach(cell => cell.addEventListener("click", handleCellAllocation));

function handleCellAllocation(event) {
    const clickedCell = event.target;
    const cellIdx = parseInt(clickedCell.getAttribute("data-index"));

    if (boardState[cellIdx] !== "" || !activeGame) return;

    // Process user assignment
    executeMove(clickedCell, cellIdx, playerVal);
    
    if (evaluateMatrixState(playerVal)) {
        statusDisplay.innerText = "TERMINAL_STATUS // USER_VICTORY (X)";
        activeGame = false;
        return;
    }

    if (!boardState.includes("")) {
        statusDisplay.innerText = "TERMINAL_STATUS // MATRIX_TIE_STALEMATE";
        activeGame = false;
        return;
    }

    // Hand over processing control thread to system AI
    statusDisplay.innerText = "VAN_AI // PROCESSING_DECISION...";
    setTimeout(executeStrategicAiMove, 400);
}

function executeMove(cellElement, index, signature) {
    boardState[index] = signature;
    cellElement.innerText = signature;
    cellElement.classList.add(signature.toLowerCase());
}

/**
 * AI Decision Matrix Router
 * Strategy order: 1. Win if possible | 2. Block user if threat detected | 3. Control Center/Corners
 */
function executeStrategicAiMove() {
    if (!activeGame) return;

    // Routine A: Evaluate instant win opportunities
    let targetMove = locateStrategicVector(computerVal);
    
    // Routine B: Evaluate critical defensive blocks
    if (targetMove === null) {
        targetMove = locateStrategicVector(playerVal);
    }

    // Routine C: Positional fallback hierarchy
    if (targetMove === null) {
        if (boardState[4] === "") targetMove = 4; // Prioritize center point
        else {
            const strategicFallbacks = [0, 2, 6, 8, 1, 3, 5, 7];
            for (let idx of strategicFallbacks) {
                if (boardState[idx] === "") {
                    targetMove = idx;
                    break;
                }
            }
        }
    }

    if (targetMove !== null) {
        const targetCell = document.querySelector(`.cell[data-index='${targetMove}']`);
        executeMove(targetCell, targetMove, computerVal);

        if (evaluateMatrixState(computerVal)) {
            statusDisplay.innerText = "TERMINAL_STATUS // VAN_AI_VICTORY (O)";
            activeGame = false;
            return;
        }

        if (!boardState.includes("")) {
            statusDisplay.innerText = "TERMINAL_STATUS // MATRIX_TIE_STALEMATE";
            activeGame = false;
            return;
        }

        statusDisplay.innerText = "VAN_AI_READY // YOUR TURN (X)";
    }
}

function locateStrategicVector(signature) {
    for (let vector of winningVectors) {
        const [a, b, c] = vector;
        const matches = [boardState[a], boardState[b], boardState[c]];
        
        // Find lines where two points match and the third is empty
        const matchingCount = matches.filter(val => val === signature).length;
        const emptyCount = matches.filter(val => val === "").length;

        if (matchingCount === 2 && emptyCount === 1) {
            if (boardState[a] === "") return a;
            if (boardState[b] === "") return b;
            if (boardState[c] === "") return c;
        }
    }
    return null;
}

function evaluateMatrixState(signature) {
    return winningVectors.some(vector => {
        return vector.every(index => boardState[index] === signature);
    });
}

function resetMatrix() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    activeGame = true;
    statusDisplay.innerText = "VAN_AI_READY // YOUR TURN (X)";
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove("x", "o");
    });
}
