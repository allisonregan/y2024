import * as fs from 'fs';
import _ from 'lodash';

type Coordinate = {
    x: number;
    y: number;
}

const coorToString = ({ x, y }: Coordinate) => `${x},${y}`;


const getGrid = (fileName: string) => {
    const file = fs.readFileSync(fileName,'utf8');
    return file.split('\n').map((line) => line.split(''));
}

const getFreqMap = (grid: string[][]) => {
    const freqMap: Record<string, Coordinate[]> = {};
    grid.forEach((line, i) => line.forEach((c, j) => {
        if (c !== '.') {
            if (!freqMap[c]) {
                freqMap[c] = [];
            }
            freqMap[c].push({ x: i, y: j });
        }
    }))
    return freqMap;
}

// Part 1 only did this once for each, rather than the while loop
const getAntinodeLocations = ({ x: x1, y: y1 }: Coordinate, { x: x2, y: y2 }: Coordinate, maxX: number, maxY: number): Coordinate[] => {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const antinodeLocs: Coordinate[] = [];
    let currX = x1;
    let currY = y1;
    while (currX < maxX && currY < maxY && currX >= 0 && currY >= 0) {
        antinodeLocs.push({ x: currX, y: currY });
        currX += dx;
        currY += dy;
    }
    currX = x1;
    currY = y1;
    while (currX < maxX && currY < maxY && currX >= 0 && currY >= 0) {
        antinodeLocs.push({ x: currX, y: currY });
        currX -= dx;
        currY -= dy;
    }
    return antinodeLocs;
}

const getPossibleAntinodes = (freqMap: Record<string, Coordinate[]>, maxX: number, maxY: number): Coordinate[] => {
    const antinodes: Coordinate[] = [];
    Object.values(freqMap).forEach((coors) => {
        let seenCoors = [];
        coors.forEach((coor) => {
            seenCoors.forEach((seenCoor) => {
                antinodes.push(...getAntinodeLocations(coor, seenCoor, maxX, maxY));
            })
            seenCoors.push(coor);
        })
    })
    return antinodes;
}

const getAntinodeCount = (grid: string[][], possibleCoor: Coordinate[]) => {
    let count = 0;
    const seenCoor = new Set<string>();
    possibleCoor.forEach((coor) => {
        if (grid[coor.x]?.[coor.y] && !seenCoor.has(coorToString(coor))) {
            count++;
            seenCoor.add(coorToString(coor));
        }
    })
    return count;
}

const countUniqueAntinodes = (grid: string[][]) => {
    const freqMap = getFreqMap(grid);
    const possibleAntinodes = getPossibleAntinodes(freqMap, grid.length, grid[0].length);
    return getAntinodeCount(grid, possibleAntinodes);
}

const testGrid = getGrid('test_input.txt');
const grid = getGrid('input.txt');

console.log(countUniqueAntinodes(testGrid));
console.log(countUniqueAntinodes(grid));