import _ from 'lodash';
import * as fs from 'fs';

const getMemory = (fileName: string): string => {
    return fs.readFileSync(fileName,'utf8');
}

// return all mul commands
const stepThrough = (memory: string, enableDo: boolean): [number, number][] => {
    let currCommand = '';
    let shouldMul = true;
    let buildingMul = false;
    const muls: [number, number][] = [];
    memory.split('').forEach((c) => {
        if (c === 'm' || c === 'd') {
            currCommand = c;
        } else {
            currCommand = currCommand.concat(c);
        }
        // check if currCommand is a valid command
        if (currCommand === 'do()' && enableDo) {
            shouldMul = true;
        } else if (currCommand === 'don\'t()' && enableDo) {
            shouldMul = false;
        } else if (currCommand === 'mul(' && shouldMul) {
            buildingMul = true;
        } else if (buildingMul) {
            if (c === ')') {
                const mul = currCommand.slice(4, currCommand.length - 1).split(',');
                if (mul.length === 2 && !mul[0].match(/[^\d]/) && !mul[1].match(/[^\d]/)) {
                    muls.push([Number(mul[0]), Number(mul[1])]);
                }
                buildingMul = false;
            }
        }
    })
    return muls;
}

const getMultiplications = (filename: string, enableDo = false): number => {
    const memory = getMemory(filename);
    let sum = 0;
    const muls = stepThrough(memory, enableDo);
    muls.forEach((mul) => {
        sum += mul[0] * mul[1];
    })
    return sum;
}

console.log(getMultiplications('test_input.txt'));
console.log(getMultiplications('input.txt'));
console.log(getMultiplications('test_input.txt', true));
console.log(getMultiplications('input.txt', true));
