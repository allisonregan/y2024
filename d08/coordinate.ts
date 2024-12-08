export type Coordinate = {
    x: number;
    y: number;
}

export class CoordinateSet {
    private set: Set<string>;

    constructor() {
        this.set = new Set();
    }

    private coorToString = ({ x, y }: Coordinate) => `${x},${y}`;
    private stringToCoor = (str: String): Coordinate => {
        const [x, y] = str.split(',');
        return { x: Number(x), y: Number(y) }
    };

    add(coor: Coordinate) {
        this.set.add(this.coorToString(coor));
    }

    addAll(coors: Coordinate[]) {
        coors.forEach((coor) => {
            this.set.add(this.coorToString(coor));
        })
    }
    
    has(coor: Coordinate): boolean {
        return this.set.has(this.coorToString(coor));
    }

    size() {
        return this.set.size;
    }

    forEach(func: (c: Coordinate) => void) {
        this.set.forEach((coorStr) => {
            const coor = this.stringToCoor(coorStr);
            func(coor);
        });
    }

    filter(func: (c: Coordinate) => boolean): CoordinateSet {
        const newSet = new CoordinateSet();
        this.set.forEach((coorStr) => {
            const coor = this.stringToCoor(coorStr);
            if (func(coor)) {
                newSet.add(coor);
            }
        });
        return newSet;
    }
}