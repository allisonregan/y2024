import * as fs from 'fs';
import _ from 'lodash';

enum Operator {
    ADD = '+',
    MULTIPLY = '*',
    CONCATENATE = '||'
}

const OPERATORS = Object.values(Operator);

type Equation = [number, number[]]

const getEquations = (fileName: string): Equation[] => {
    const file = fs.readFileSync(fileName,'utf8');
    return file.split('\n').map((line) => {
        const [result, nums] = line.split(': ');
        const operands = nums.split(' ').map((val) => Number(val));
        return [Number(result), operands];
    });
}

const performOperation = (operand1: number, operand2: number, operator: Operator) => {
    switch (operator) {
        case Operator.ADD:
            return operand1 + operand2;
        case Operator.MULTIPLY:
            return operand1 * operand2;
        case Operator.CONCATENATE:
            return Number(operand1.toString() + operand2.toString())
    }
}

const isEquationValid = ([result, operands]: Equation): boolean=> {
    const stack = [{
        currResult: 0,
        remainingOperands: operands,
    }];

    while (stack.length) {
        const { currResult, remainingOperands } = stack.pop();
        if (remainingOperands.length === 0) {
            if (currResult === result) {
                return true;
            }
        } else if (currResult <= result) {
            const operand = remainingOperands.shift();
            OPERATORS.forEach((operator) => {
                stack.push({
                    currResult: performOperation(currResult, operand, operator),
                    remainingOperands: [...remainingOperands],
                })
            })
        }
    }

    return false;
}

const getValidEquationSums = (equations: Equation[]) => {
    let sum = 0;
    equations.forEach((eq) => {
        if (isEquationValid(eq)) {
            sum += eq[0];
        }
    });
    return sum;
}

const testOperations = getEquations('test_input.txt');
const operations = getEquations('input.txt');

console.log(getValidEquationSums(testOperations));
console.log(getValidEquationSums(operations));