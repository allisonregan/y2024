import * as fs from 'fs';
import _ from 'lodash';
import { Coordinate, CoordinateSet } from './coordinate';

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
    const antinodeLocs: Coordinate[] = [];
    const dx = x1 - x2;
    const dy = y1 - y2;

    let currCoor = { x: x1, y: y1 };
    while (currCoor.x < maxX && currCoor.y < maxY && currCoor.x >= 0 && currCoor.y >= 0) {
        antinodeLocs.push({ ...currCoor });
        currCoor.x += dx;
        currCoor.y += dy;
    }

    currCoor = { x: x1, y: y1 };
    while (currCoor.x < maxX && currCoor.y < maxY && currCoor.x >= 0 && currCoor.y >= 0) {
        antinodeLocs.push({ ...currCoor });
        currCoor.x -= dx;
        currCoor.y -= dy;
    }
    return antinodeLocs;
}

const getPossibleAntinodes = (freqMap: Record<string, Coordinate[]>, maxX: number, maxY: number): CoordinateSet => {
    const antinodes = new CoordinateSet();
    Object.values(freqMap).forEach((coors) => {
        const seenCoors = [];
        coors.forEach((coor) => {
            seenCoors.forEach((seenCoor) => {
                antinodes.addAll(getAntinodeLocations(coor, seenCoor, maxX, maxY));
            })
            seenCoors.push(coor);
        })
    })
    return antinodes;
}

const getAntinodeCount = (grid: string[][], possibleCoor: CoordinateSet) => {
    const validAntinodes = possibleCoor.filter((coor) => Boolean(grid[coor.x]?.[coor.y]))
    return validAntinodes.size();
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