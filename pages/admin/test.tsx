import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const Index: React.FC = () => {

    return (
        <div style={{ width: 280, backgroundColor: 'red' }}>
            <Tooltip title="Your tooltip text here" placement="bottom">
                <Typography>
                    Hover over this text to see the tooltip.
                </Typography>
            </Tooltip>
        </div>
    );
};

export default Index;
