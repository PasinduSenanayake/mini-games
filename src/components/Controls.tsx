import React from 'react';
import { Box, Button, Slider, Stack, Typography } from '@mui/material';

interface ControlsProps {
    gridSize: number;
    setGridSize: (value: number) => void;
    speed: number;
    setSpeed: (value: number) => void;
    isStarted: boolean;
    setIsStarted: (value: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({
    gridSize,
    setGridSize,
    speed,
    setSpeed,
    isStarted,
    setIsStarted,
}) => {
    return (
        <Stack spacing={2} sx={{ width: 300, margin: 'auto' }}>
            <Box>
                <Typography>Grid Size</Typography>
                <Slider
                    disabled={isStarted}
                    value={gridSize}
                    aria-label="Grid Size"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={2}
                    max={12}
                    onChange={(_, value) => setGridSize(value)}
                />
            </Box>
            <Box>
                <Typography>Speed</Typography>
                <Slider
                    disabled={isStarted}
                    value={speed}
                    aria-label="Speed"
                    valueLabelDisplay="auto"
                    step={10}
                    marks
                    min={0}
                    max={100}
                    onChange={(_, value) => setSpeed(value)}
                />
            </Box>
            <Button
                disabled={isStarted}
                variant="contained"
                onClick={() => setIsStarted(true)}
            >
                Generate
            </Button>
        </Stack>
    );
};

export default Controls;
