import { createFileRoute } from '@tanstack/react-router'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useEffect, useRef, useState } from 'react';
import { generateNumberGrid, sleep } from '../core/zip';
import type { Node } from '../models/zip';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Controls from '../components/Controls';
import theme from '../theme';


export const Route = createFileRoute('/')({
    component: Index,
})


function Index() {


    const [nodeGrid, setNodeGrid] = useState<Node[][]>([])

    const refs = useRef<Record<string, HTMLDivElement | null>>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const [paths, setPaths] = useState<string[]>([]);

    const [gridSize, setGridSize] = useState(12);
    const [speed, setSpeed] = useState(100);

    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        if (isStarted) {
            generateNumberGrid(gridSize, (gridNodes) => {
                return new Promise(resolve => {
                    const sleepTime = 100 - speed
                    if (sleepTime == 0) {
                        resolve()
                    } else {
                        const clonedGrid = gridNodes.map(row => row.map(node => ({ ...node })));
                        setNodeGrid(clonedGrid);
                        sleep(sleepTime).then(() => {
                            resolve()
                        })
                    }
                });
            }).then((gridNodes) => {
                const clonedGrid = gridNodes.map(row => row.map(node => ({ ...node })));
                setNodeGrid(clonedGrid);
                setIsStarted(false);
            });
        }
    }, [isStarted]);

    useEffect(() => {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const result: string[] = [];
        nodeGrid.forEach(row => {
            row.forEach(node => {
                const s = refs.current[node.id];
                const targetId = node.pathOut?.head?.id;
                if (!s || !targetId) return;
                const t = refs.current[targetId];
                if (!t) return;
                const a = s.getBoundingClientRect();
                const b = t.getBoundingClientRect();

                const x1 = a.left - containerRect.left + a.width / 2;
                const y1 = a.top - containerRect.top + a.height / 2;
                const x2 = b.left - containerRect.left + b.width / 2;
                const y2 = b.top - containerRect.top + b.height / 2;
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2;

                result.push(`M ${x1},${y1} L ${mx},${my} L ${x2},${y2}`);
            });
        });
        setPaths(result);
    }, [nodeGrid]);


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box ref={containerRef} sx={{ flexGrow: 1, p: 2, position: 'relative' }}>
                <Controls
                    gridSize={gridSize}
                    setGridSize={setGridSize}
                    speed={speed}
                    setSpeed={setSpeed}
                    isStarted={isStarted}
                    setIsStarted={setIsStarted}
                />
                <br />
                <svg
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                    }}
                >
                    <defs>
                        <marker
                            id="arrowhead"
                            markerWidth="5"
                            markerHeight="3.5"
                            refX="5"
                            refY="1.75"
                            orient="auto"
                        >
                            <polygon points="0 0, 5 1.75, 0 3.5" fill="yellow" />
                        </marker>
                    </defs>
                    {paths.map((d, i) => (
                        <path key={i} d={d} stroke="yellow" strokeWidth={4} markerMid="url(#arrowhead)" />
                    ))}
                </svg>
                <Grid container spacing={0} justifyContent="center">
                    {nodeGrid.map((row, rowIndex) => (
                        <Grid key={rowIndex}>
                            {row.map((node) => (
                                <Grid size={2} key={node.id}>
                                    <Box
                                        ref={(el: HTMLDivElement | null) => { refs.current[node.id] = el }}
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            borderStyle: 'solid',
                                            borderColor: 'gray',
                                            borderWidth: 1,
                                            bgcolor: node.pathOut != null ? 'primary.main' : 'primary.dark',
                                            '&:hover': {
                                                bgcolor: 'primary.dark',
                                            },
                                        }}
                                    >
                                        {node.label}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </ThemeProvider>
    )
}
