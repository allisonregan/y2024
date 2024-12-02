import _ from 'lodash';
import * as fs from 'fs';

const generateListsFromFile = (fileName: string): [number[], number[]] => {
    const file = fs.readFileSync(`d01/${fileName}`,'utf8');
    const lines = file.split('\n');
    const list1: number[] = [];
    const list2: number[] = [];
    lines.forEach((line) => {
        const [val1, val2] = line.split('   ');
        list1.push(Number(val1));
        list2.push(Number(val2));
    })
    return [list1, list2];
}

const generateMapsFromFile = (fileName: string): [Record<string, number>, Record<string, number>] => {
    const file = fs.readFileSync(`d01/${fileName}`,'utf8');
    const lines = file.split('\n');
    const record1: Record<string, number> = {};
    const record2: Record<string, number> = {};
    lines.forEach((line) => {
        const [val1, val2] = line.split('   ');
        if (record1[val1]) {
            record1[val1]++
        } else {
            record1[val1] = 1;
        }
        if (record2[val2]) {
            record2[val2]++
        } else {
            record2[val2] = 1;
        }
    })
    return [record1, record2];
}

const compareIdListDistance = (firstIds: number[], secondIds: number[]): number => {
    const sortedFirst = _.sortBy(firstIds);
    const sortedSecond = _.sortBy(secondIds);
    let sum = 0;
    for (let i = 0; i < sortedFirst.length; i++) {
        sum += Math.abs(sortedFirst[i] - sortedSecond[i]);
    }
    return sum;
}

const compareIdListSimilarity = (firstIds: Record<string, number>, secondIds: Record<string, number>): number => {
    let similarity = 0;
    Object.keys(firstIds).forEach((key) => {
        similarity += Number(key) * firstIds[key] * (secondIds[key] ?? 0);
    })
    return similarity;
}

const getIdListDistance = (filename: string) => {
    const [list1, list2] = generateListsFromFile(filename);
    return compareIdListDistance(list1, list2);
}

const getIdListSimilarity = (filename: string) => {
    const [record1, record2] = generateMapsFromFile(filename);
    return compareIdListSimilarity(record1, record2);

}

console.log(getIdListDistance('test_input.txt'));
console.log(getIdListDistance('input.txt'));
console.log(getIdListSimilarity('test_input.txt'));
console.log(getIdListSimilarity('input.txt'));