import * as fs from 'fs';
import _, { get, size } from 'lodash';

type Node = {
    key: string;
    height: number;
    adj: Record<string, Node>; // key to node
}

type Graph = Node[]; // starting nodes

const getKeyFromCoor = (i: number, j: number) => `${i},${j}`;

const getGraph = (filename: string): Graph => {
    const file = fs.readFileSync(filename,'utf8');
    const arr = file.split('\n').map((line) => line.split(''));
    const graph: Graph = [];
    const seenNodes: Record<string, Node> = {};
    arr.forEach((line, i) => line.map((c, j) => {
        const height = Number(c);
        const key = getKeyFromCoor(i, j);
        if (!seenNodes[key]) {
            seenNodes[key] = {
                key,
                height,
                adj: {}
            };
        }
        const node = seenNodes[key];
        for (let [di, dj] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            const adjKey = getKeyFromCoor(i + di, j + dj);
            if (!seenNodes[adjKey] && !isNaN(Number(arr[i + di]?.[j + dj]))) {
                seenNodes[adjKey] = {
                    key: adjKey,
                    height: Number(arr[i + di]?.[j + dj]),
                    adj: {}
                };
            }
            const adjNode = seenNodes[adjKey];
            if (adjNode) {
                if (adjNode.height === height + 1) {
                    if (!node.adj[adjKey]) {
                        node.adj[adjKey] = adjNode;
                    }
                } else if (adjNode.height === height - 1) {
                    if (!adjNode.adj[key]) {
                        adjNode.adj[key] = node;
                    }
                }
            }
        }
        if (height === 0) {
            graph.push(node);
        }
    }))
    return graph;
}

// track how many unique trailheads (height 9) the node can reach
const getScore = (node: Node) => {
    const stack = [node];
    const seenPeaks = new Set<string>()
    while (stack.length) {
        const currNode = stack.pop();
        if (currNode.height === 9) {
            seenPeaks.add(currNode.key);
        } else {
            stack.push(...Object.values(currNode.adj));
        }
    }
    return seenPeaks.size;
}

// track how many unique trails can be made with this node
const getRating = (node: Node) => {
    const stack = [node];
    let count = 0;
    while (stack.length) {
        const currNode = stack.pop();
        if (currNode.height === 9) {
            count++;
        } else {
            stack.push(...Object.values(currNode.adj));
        }
    }
    return count;
}

const getScoreOfMap = (graph: Graph) => graph.reduce((acc, cur) => acc + getScore(cur), 0);
const getRatingsOfMap = (graph: Graph) => graph.reduce((acc, cur) => acc + getRating(cur), 0);

const testGraph = getGraph('test_input.txt');
const graph = getGraph('input.txt');

console.log(getScoreOfMap(testGraph));
console.log(getScoreOfMap(graph));

console.log(getRatingsOfMap(testGraph));
console.log(getRatingsOfMap(graph));
