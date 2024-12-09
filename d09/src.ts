import * as fs from 'fs';
import _, { size } from 'lodash';

enum BlockType {
    File,
    Space
}

type Block = {
    type: BlockType;
    fileId?: number;
    size: number;
}

const getDisk = (filename: string): Block[] => {
    const file = fs.readFileSync(filename,'utf8');
    let readingFile = true;
    const fileSizes: number[] = [];
    const emptySpaceSizes: number[] = [];
    file.split('').forEach((c) => {
        if (readingFile) {
            fileSizes.push(Number(c));
        } else {
            emptySpaceSizes.push(Number(c));
        }
        readingFile = !readingFile;
    })
    return fileSizes.reduce((acc, cur, i) => {
        return [
            ...acc,
            {
                type: BlockType.File,
                fileId: i,
                size: cur ?? 0,
            },
            {
                type: BlockType.Space,
                size: emptySpaceSizes[i] ?? 0,
            },
        ];
    }, [] as Block[])
}

/*
const updateDiskWithFragmentation = (disk: number[]): number[] => {
    const clonedDisk = [...disk];
    let i = 0;
    let j = clonedDisk.length - 1;
    while (i < clonedDisk.length && j >= 0 && i !== j) {
        const iFoundEmpty = clonedDisk[i] === -1;
        const jFoundFull = clonedDisk[j] !== -1;
        if (iFoundEmpty && jFoundFull) {
            clonedDisk[i] = clonedDisk[j];
            clonedDisk[j] = -1;
        }
        if (!iFoundEmpty) {
            i++;
        }
        if (!jFoundFull) {
            j--;
        }
    }
    return clonedDisk;
}
*/

const updateDiskNoFrag = (disk: Block[]): Block[] => {
    let clonedDisk = [ ...disk ];
    const seenFiles = new Set<number>();
    for (let i = clonedDisk.length - 1; i >= 0; i--) {
        if (clonedDisk[i].type === BlockType.File) {
            if (!seenFiles.has(clonedDisk[i].fileId)) {
                seenFiles.add(clonedDisk[i].fileId);
                const spaceIndex = clonedDisk.findIndex((block, j) => 
                    (block.type === BlockType.Space && block.size >= clonedDisk[i].size)
                    && (j < i)
                );
                if (spaceIndex !== -1) {
                    const spaceDifference = clonedDisk[spaceIndex].size - clonedDisk[i].size;
                    const newSpace: Block = {
                        type: BlockType.Space,
                        size: spaceDifference,
                    };
                    const oldSpace = clonedDisk[spaceIndex];
                    oldSpace.size -= newSpace.size;
                    clonedDisk = [ 
                        ...clonedDisk.slice(0, spaceIndex),
                        clonedDisk[i],
                        ...(spaceDifference > 0 ? [newSpace] : []), // is it a problem that we could be reversing?
                        // extra space if needed
                        ...clonedDisk.slice(spaceIndex + 1, i),
                        clonedDisk[spaceIndex],
                        ...clonedDisk.slice(i + 1),
                    ]
                    
                    if (spaceDifference > 0) {
                        i++;   
                    }
                }
            }
        }
    }
    return clonedDisk;
}

const blocksToDisk = (disk: Block[]): number[] => {
    return disk.reduce((acc, cur) => {
        return [
            ...acc,
            ...(new Array(cur.size).fill(cur.fileId ?? -1))
        ]
    }, []);
}
 
const calculateChecksum = (disk: Block[]): number => {
    const numberDisk = blocksToDisk(disk);
    return numberDisk.reduce((acc, cur, i) => {
        if (cur === -1) {
            return acc;
        }
        return acc + (cur * i);
    }, 0);
}

const testDisk = getDisk('test_input.txt');
const disk = getDisk('input.txt');

// console.log(calculateChecksum(updateDiskWithFragmentation(testDisk)));
// console.log(calculateChecksum(updateDiskWithFragmentation(disk)));

console.log(calculateChecksum(updateDiskNoFrag(testDisk)));
console.log(calculateChecksum(updateDiskNoFrag(disk)));
