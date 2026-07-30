import {Paper} from '@mui/material';
import type { ReactNode } from 'react';

interface CardContainerProps{
    children: ReactNode;
}

const CardContainer = ({ children }: CardContainerProps) => {
    return (
        <Paper
            elevation={0}
            sx={{
                bgcolor: '#FFFFFF',
                p: 4,
                borderRadius: 3,
                border: '1px solid #E2E8F0',
                boxShadow: 3,
            }}
        >
            {children}
        </Paper>
    );
};

export default CardContainer;