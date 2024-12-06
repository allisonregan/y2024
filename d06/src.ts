import * as fs from 'fs';

enum Direction {
    LEFT = '<',
    RIGHT = '>',
    UP = '^',
    DOWN = 'v',
}

const DIRECTION_VALUES = Object.values(Direction) as string[];

type Position = {
    x: number;
    y: number;
    dir: Direction;
}

type GuardPath = Record<string, Direction[]>

const getKeyForPos = (pos: Position) => `${pos.x},${pos.y}`;

const getCoorFromKey = (key: string) => {
    const [x, y] = key.split(',');
    return {
        x: Number(x),
        y: Number(y)
    }
}

const goStraight = (pos: Position): Position => {
    switch (pos.dir) {
        case Direction.LEFT:
            return { x: pos.x, y: pos.y - 1, dir: Direction.LEFT }
        case Direction.RIGHT:
            return { x: pos.x, y: pos.y + 1, dir: Direction.RIGHT }
        case Direction.UP:
            return { x: pos.x - 1, y: pos.y, dir: Direction.UP }
        case Direction.DOWN:
            return { x: pos.x + 1, y: pos.y, dir: Direction.DOWN }
        default:
            throw new Error(`Invalid direction value: ${pos}`);
    }
}

const turnRight = (pos: Position): Position => {
    switch (pos.dir) {
        case Direction.LEFT:
            return { x: pos.x - 1, y: pos.y + 1, dir: Direction.UP }
        case Direction.RIGHT:
            return { x: pos.x + 1, y: pos.y - 1, dir: Direction.DOWN }
        case Direction.UP:
            return { x: pos.x + 1, y: pos.y + 1, dir: Direction.RIGHT }
        case Direction.DOWN:
            return { x: pos.x - 1, y: pos.y - 1, dir: Direction.LEFT }
        default:
            throw new Error(`Invalid direction value: ${pos}`);
    }
}

const getGuardPosition = (grid: string[][]): Position => {
    let y = 0;
    const x = grid.findIndex((line) => {
        let i = line.findIndex((c) => DIRECTION_VALUES.includes(c));
        if (i !== -1) {
            y = i;
        }
        return i !== -1;
    })
    return {
        x,
        y,
        dir: grid[x][y] as Direction
    }
}

const getGridAndPos = (fileName: string) => {
    const file = fs.readFileSync(fileName,'utf8');
    const grid = file.split('\n').map((line) => line.split(''));
    const guardPos = getGuardPosition(grid);
    grid[guardPos.x][guardPos.y] = '.';
    return { grid, guardPos };
}


const getGuardPath = (grid: string[][], guardPos: Position) => {
    let guardWalking = true;
    let guardPath: GuardPath = {};
    let count = 0;
    let currPos = guardPos;
    while (guardWalking) {
        const currC = grid[currPos.x]?.[currPos.y];
        const currKey = getKeyForPos(currPos);
        switch (currC) {
            case '.':
                if (!guardPath[currKey]) {
                    guardPath[currKey] = []; 
                }
                if (guardPath[currKey].some((dir) => dir === currPos.dir)) { // we hit an infinite loop
                    guardWalking = false;
                    break;
                }
                guardPath[currKey].push(currPos.dir);
                currPos = goStraight(currPos);
                count++;
                break;
            case undefined:
                guardWalking = false;
                break;
            case '#':
                currPos = turnRight(currPos);
                break;
            default:
                throw new Error(`Encountered char: ${currC} at pos ${currPos}`)
        }
    }
    return guardPath;
}

const getGuardPathCount = (guardPath: GuardPath) => Object.keys(guardPath).length;

const getPossibleObstructions = (guardPath: GuardPath, grid: string[][]) => {
    let count = 0;
    Object.entries(guardPath).map(([key, dirList]) => {
        const { x, y } = getCoorFromKey(key);
        grid[x][y] = '#';
        const dir = dirList[0]; // we only want the dir with the first time, because otherwise we will end up with an invalid path
        const currGuardPath: GuardPath = {};
        let currPos = turnRight({ x, y, dir });
        let guardWalking = true;
        while (guardWalking) {
            const currC = grid[currPos.x]?.[currPos.y];
            const currKey = getKeyForPos(currPos);
            switch (currC) {
                case undefined: // out of bounds - not an infinite loop
                    guardWalking = false;
                    break;
                case '#':
                    currPos = turnRight(currPos);
                    break;
                case '.':
                    if (!currGuardPath[currKey]) {
                        currGuardPath[currKey] = []; 
                    }
                    if (currGuardPath[currKey].some((dir) => dir === currPos.dir)) { // infinite loop
                        guardWalking = false;
                        count++;
                        break;
                    }
                    currGuardPath[currKey].push(currPos.dir);
                    currPos = goStraight(currPos);
                    break;
                default:
                    throw new Error(`Encountered char: ${currC} at pos ${currPos}`)
            }
        }
        grid[x][y] = '.';
    });
    return count;
}

const { grid: testGrid, guardPos: testGuardPos } = getGridAndPos('test_input.txt');
const { grid, guardPos } = getGridAndPos('input.txt');

const testGuardPath = getGuardPath(testGrid, testGuardPos);
const guardPath = getGuardPath(grid, guardPos);

console.log(getGuardPathCount(testGuardPath));
console.log(getGuardPathCount(guardPath));
console.log(getPossibleObstructions(testGuardPath, testGrid));
console.log(getPossibleObstructions(guardPath, grid));
