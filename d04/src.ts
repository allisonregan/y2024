import * as fs from 'fs';

const XMAS = 'XMAS';

const getGrid = (fileName: string): string[][] => {
    const file = fs.readFileSync(fileName,'utf8');
    return file.split('\n').map((line) => line.split(''));
}

const getNumXmas = (grid: string[][]) => {
    let count = 0;
    grid.forEach((line, i) => line.forEach((c, j) => {
        if (c === XMAS[0]) {
            const possibleXmases = [
                `${c}${grid[i - 1]?.[j]}${grid[i - 2]?.[j]}${grid[i - 3]?.[j]}`,
                `${c}${grid[i + 1]?.[j]}${grid[i + 2]?.[j]}${grid[i + 3]?.[j]}`,
                `${c}${grid[i][j - 1]}${grid[i][j - 2]}${grid[i][j - 3]}`,
                `${c}${grid[i][j + 1]}${grid[i][j + 2]}${grid[i][j + 3]}`,
                `${c}${grid[i - 1]?.[j - 1]}${grid[i - 2]?.[j - 2]}${grid[i - 3]?.[j - 3]}`,
                `${c}${grid[i - 1]?.[j + 1]}${grid[i - 2]?.[j + 2]}${grid[i - 3]?.[j + 3]}`,
                `${c}${grid[i + 1]?.[j - 1]}${grid[i + 2]?.[j - 2]}${grid[i + 3]?.[j - 3]}`,
                `${c}${grid[i + 1]?.[j + 1]}${grid[i + 2]?.[j + 2]}${grid[i + 3]?.[j + 3]}`,
            ];
            const xmases = possibleXmases.filter((val) => val === XMAS);
            count += xmases.length;
        }
    }));
    return count;
}

const getNumCrosses = (grid: string[][]) => {
    let count = 0;
    grid.forEach((line, i) => line.forEach((c, j) => {
        if (c === 'A') {
            const hashSurroundings = `${grid[i - 1]?.[j - 1]}${grid[i - 1]?.[j + 1]}${grid[i + 1]?.[j - 1]}${grid[i + 1]?.[j + 1]}`;
            if (['MMSS', 'MSMS', 'SMSM', 'SSMM'].includes(hashSurroundings)) {
                count++;
            }
        }
    }));
    return count;
}

const testGrid = getGrid('test_input.txt');
const grid = getGrid('input.txt');

console.log(getNumXmas(testGrid));
console.log(getNumXmas(grid));
console.log(getNumCrosses(testGrid));
console.log(getNumCrosses(grid));