const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function columnAsNumber (column) {
    if (!/^[A-Z]+$/.test(column)) {
        return -1;
    }
    let val = 0;
    for (let i = 0; i < column.length; i++) {
        val = val * 26;
        val += LETTERS.indexOf(column[i])+1;
    }
    return val;
}

function columnAsLetter (column) {
    let dividend = column;
    let val = "";
    do {
        val = LETTERS[((dividend-1) % 26)] + val;
        dividend = Math.floor((dividend-1)/26);
    } while (dividend !== 0);
    return val;
}

function distance(cell1, cell2) {
    const dimensions1 = splitName(cell1);
    const dimensions2 = splitName(cell2);
    if (!dimensions1 || !dimensions2) {
        return null;
    }
    const offsetX = columnAsNumber(dimensions2[0]) - columnAsNumber(dimensions1[0]);
    const offsetY = dimensions2[1] - dimensions1[1];
    return [offsetX, offsetY];
}

function offset(cellName, offsetX, offsetY) {
    const dimensions = splitName(cellName);
    if (!dimensions || offsetX < -columnAsNumber(dimensions[0]) || offsetY < -dimensions[1]) {
        return null;
    }
    return columnAsLetter(columnAsNumber(dimensions[0]) + offsetX)+(dimensions[1]+offsetY);
}

function splitName(cellName) {
    let bits = /([A-Z]+)([\d]+)/.exec(cellName);
    if (!bits || bits.length < 3) return null;
    return [bits[1], parseInt(bits[2])];
}

function * cellNamesInRange(range) {
    const bits = /([A-Z]+)([\d]+):([A-Z]+)([\d]+)/.exec(range);
    if (!bits || bits.length !== 5) {
        return null;
    }
    const startColumn = columnAsNumber(bits[1]);
    const startRow = parseInt(bits[2]);
    const endColumn = columnAsNumber(bits[3]);
    const endRow = parseInt(bits[4]);

    for (let row = startRow; row <= endRow; row++) {
        for (let column = startColumn; column != endColumn+1; column++) {
            yield columnAsLetter(column)+row;
        }
    }
    return null;
}

function findCellNameByContent(sheet, content) {
    for (const cellname of cellNamesInRange(sheet["!ref"])) {
        if (sheet[cellname] && sheet[cellname].v === content) {
            return cellname;
        }
    }
    return null;
}

module.exports = {
    columnAsLetter,
    columnAsNumber,
    distance,
    offset,
    splitName,
    cellNamesInRange,
    findCellNameByContent,
};
