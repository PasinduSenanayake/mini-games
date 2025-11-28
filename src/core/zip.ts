import type { Node, Arc } from "../models/zip";
import { v4 as uuidV4 } from "uuid";

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateNode(): Node {
    return {
        id: uuidV4(),
        arcs: [],
        inPath: false,
        pathOut: null,
        isSource: true,
        label: 0,
        addEdge: function (head: Node) {
            const forwardArc: Arc = {
                head: this,
                reverse: null,
            };
            const backwardsArc: Arc = {
                head: head,
                reverse: forwardArc,
            };
            // link reverse reference
            forwardArc.reverse = backwardsArc;
            this.arcs.push(backwardsArc);
            head.arcs.push(forwardArc);
        },
    };
}

function buildGrid(gridSize: number): [Node[][],Node[]]{
  const nodeGrid: Node[][] = [];
    const nodes: Node[] = [];

    // Create nodes
    for (let i = 0; i < gridSize; i++) {
        nodeGrid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            const node = generateNode();
            nodes.push(node);
            nodeGrid[i][j] = node;
        }
    }

    // Connect nodes (right and down edges)
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (i > 0) {
                nodeGrid[i - 1][j].addEdge(nodeGrid[i][j]);
            }
            if (j > 0) {
                nodeGrid[i][j - 1].addEdge(nodeGrid[i][j]);
            }
        }
    }

    return [nodeGrid,nodes]
}

/**
 * Generates a grid of `Node` objects and notifies the observer after each mutation.
 * The function is async so we can pause between observer calls for visual debugging.
 */
export async function generateNumberGrid(
    gridSize: number,
    observer: (grid: Node[][]) => Promise<void>
): Promise<Node[][]> {

    var [nodeGrid,nodes] = buildGrid(gridSize);
    var failedAttempts = 0;
    // Choose a random sink node and start path construction
    let sink = nodes[Math.floor(Math.random() * nodes.length)];
    sink.inPath = true;
    let notInPathCount = nodes.length - 1;
    const maxFailedAttempts = 10*gridSize*gridSize
    while (notInPathCount > 0) {
        console.log(failedAttempts);
        if (failedAttempts > maxFailedAttempts) {
            [nodeGrid,nodes] = buildGrid(gridSize);
            sink = nodes[Math.floor(Math.random() * nodes.length)];
            sink.inPath = true;
            notInPathCount = nodes.length - 1;
            failedAttempts = 0;

        }
        // Randomly pick an outgoing arc for the current sink
        sink.pathOut = sink.arcs[Math.floor(Math.random() * sink.arcs.length)]
        sink = sink.pathOut.head;
        if (sink.inPath) {
            failedAttempts++
            // Reverse the direction of the path we just followed
            sink = sink.pathOut!.head;
            let reverseArc: Arc | null = null;
            let intermediateNode = sink;
            do { 
                const tempArc = intermediateNode.pathOut!!;
                intermediateNode.pathOut = reverseArc;
                reverseArc = tempArc.reverse;
                intermediateNode = tempArc.head;
                await observer(nodeGrid);
            } while (intermediateNode !== sink);
        } else {
            sink.inPath = true;
            notInPathCount--;
            failedAttempts = 0;
            await observer(nodeGrid);

        }
    }

    for (let i = 0; i < gridSize * gridSize; i++) {
        if (nodes[i].pathOut != null) {
            nodes[i].pathOut!!.head.isSource = false
        }
    }

    let source: Node | null = null;
    for (let j = 0; j < gridSize * gridSize; j++) {
        if (nodes[j].isSource) {
            source = nodes[j];
            break;
        }
    }

    let count = 0
    while (true) {
        source!.label = ++count;
        if (source!.pathOut == null) {
            break;
        }
        source = source!.pathOut.head;
    }
    return nodeGrid;
}