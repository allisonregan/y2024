import * as fs from 'fs';
import _ from 'lodash';

const getStones = (filename: string) => {
    const file = fs.readFileSync(filename,'utf8');
    return file.split(' ').map((str) => Number(str));
}

const getCacheStr = (stone, depth) => `${stone},${depth}`;

const blinkNumTimesRecursive = (stone: number, depth: number, numBlinks: number, cache: Record<string, number>) => {
    if (depth === numBlinks) {
        return 1;
    }
    const cacheStr = getCacheStr(stone, depth)
    if (cache[cacheStr] !== undefined) {
        return cache[cacheStr];
    }
    const numDigits = Math.floor(Math.log10(stone)) + 1;
    if (stone === 0) {
        const ret = blinkNumTimesRecursive(1, depth + 1, numBlinks, cache);
        cache[cacheStr] = ret;
        return ret;
    } else if (numDigits % 2 === 0) {
        const divisor = Math.pow(10, numDigits / 2);
        const quotient = Math.floor(stone / divisor);
        const remainder = stone % divisor;
        const ret1 = blinkNumTimesRecursive(quotient, depth + 1, numBlinks, cache);
        const ret2 = blinkNumTimesRecursive(remainder, depth + 1, numBlinks, cache);
        cache[cacheStr] = ret1 + ret2;
        return ret1 + ret2;
    } else {
        const ret = blinkNumTimesRecursive(stone * 2024, depth + 1, numBlinks, cache);
        cache[cacheStr] = ret;
        return ret;
    }
}

const setupBlinking = (stones: number[], numBlinks: number) => {
    const cache: Record<string, number> = {};
    stones.forEach((stone) => {
        blinkNumTimesRecursive(stone, 0, numBlinks, cache);
    })
    return stones.reduce((acc, cur) => acc + cache[getCacheStr(cur, 0)], 0)
}

const testStones = getStones('test_input.txt');
const stones = getStones('input.txt');

// console.log(setupBlinking(testStones, 25));
// console.log(setupBlinking(stones, 25));

// console.log(setupBlinking(testStones, 75));
console.log(setupBlinking(stones, 75));