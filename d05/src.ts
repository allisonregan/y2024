import * as fs from 'fs';

const getRulesAndUpdates = (fileName: string): { rules: string[][], updates: string[][] } => {
    const file = fs.readFileSync(fileName,'utf8');
    const [rules, updates] = file.split('\n\n');
    return {
        rules: rules.split('\n').map((rule) => rule.split('|')),
        updates: updates.split('\n').map((update) => update.split(','))
    }
}

const getRulesPerPage = (rules: string[][]): Record<string, string[]> => {
    const ruleMap: Record<string, string[]> = {};
    rules.forEach(([first, second]) => {
        if (ruleMap[second]) {
            ruleMap[second].push(first);
        } else {
            ruleMap[second] = [first];
        }
    })
    return ruleMap;
}

const isUpdateValid = (ruleMap: Record<string, string[]>, update: string[]): boolean => {
    const pagesInUpdate = new Set(update);
    const pagesSeen = new Set();
    return update.every((page) => {
        pagesSeen.add(page);
        if (!ruleMap[page]) {
            return true;
        }
        return !ruleMap[page].some((rule) => pagesInUpdate.has(rule) && !pagesSeen.has(rule));
    })
}

const makeUpdateValid = (ruleMap: Record<string, string[]>, update: string[]): string[] => {
    const pagesInUpdate = new Set(update);
    let valid = false;
    let currUpdate = update;
    while (!isUpdateValid(ruleMap, currUpdate)) {
        const pagesSeen = new Set();
        let unSeenPage = '';
        const invalidPageIndex = currUpdate.findIndex((page) => {
            pagesSeen.add(page);
            if (!ruleMap[page]) {
                return false;
            }
            unSeenPage = ruleMap[page].find((rule) => pagesInUpdate.has(rule) && !pagesSeen.has(rule));
            return unSeenPage !== undefined;
        });
        currUpdate = [ ...currUpdate.slice(0, invalidPageIndex), unSeenPage, ...currUpdate.slice(invalidPageIndex).filter((page) => page !== unSeenPage)]
    }
    return currUpdate;
}

const getValidSum = (rules: string[][], updates: string[][]) => {
    let validSum = 0;
    let invalidSum = 0;
    const ruleMap = getRulesPerPage(rules);
    updates.forEach((update) => {
        const middleIndex = Math.floor(update.length / 2);
        if (isUpdateValid(ruleMap, update)) {
            validSum += Number(update[middleIndex]);
        } else {
            const newUpdate = makeUpdateValid(ruleMap, update);
            invalidSum += Number(newUpdate[middleIndex]);
        }
    })
    return { validSum, invalidSum };
}

const { rules: testRules, updates: testUpdates } = getRulesAndUpdates('test_input.txt');
const { rules, updates } = getRulesAndUpdates('input.txt');

console.log(getValidSum(testRules, testUpdates));
console.log(getValidSum(rules, updates));