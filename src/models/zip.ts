
export type Node = {
    id: string
    arcs: Arc[]
    inPath: boolean
    pathOut: Arc | null
    isSource: boolean
    label: number
    addEdge: (head: Node) => void
}


export type Arc = {
    head: Node
    reverse: Arc | null
}