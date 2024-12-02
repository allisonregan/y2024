import _ from 'lodash';
import * as fs from 'fs';

const getReports = (fileName: string): string[][] => {
    const file = fs.readFileSync(fileName,'utf8');
    const reports = file.split('\n');
    return reports.map((report) => report.split(' '));
}

const isReportSafe = (report: string[]): boolean => {
    if (report.length < 2) {
        return true;
    }
    let prevVal: number = Number(report[0]);
    let increasing: boolean = Number(report[1]) > prevVal;
    let dampened = false;

    for (let i = 1; i < report.length; i++) {
        const level = Number(report[i]);
        const difference = Math.abs(level - prevVal);
        if ((increasing && level < prevVal) || (!increasing && level > prevVal) || difference > 3 || difference < 1) {
            return false;
        }
        prevVal = level;
    }
    return true;
}

const getNumSafeReports = (filename: string, useDampener: boolean) => {
    const reports = getReports(filename);
    let sum = 0;
    reports.forEach((report) => {
        if (isReportSafe(report)) {
            sum++;
        } else if (useDampener) {
            // for each level, see if removing works
            if (report.some((_, i) => isReportSafe([
                ...report.slice(0, i),
                ...report.slice(i + 1)
            ]))) {
                sum++;
            }
        }
    })
    return sum;
}

console.log(getNumSafeReports('test_input.txt', false));
console.log(getNumSafeReports('input.txt', false));
console.log(getNumSafeReports('test_input.txt', true));
console.log(getNumSafeReports('input.txt', true));
