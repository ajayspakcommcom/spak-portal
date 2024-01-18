import React from 'react';

interface SuccessMessageProps {
    message: string;
}

const Index: React.FC<SuccessMessageProps> = ({ message }) => {
    return (
        <div style={{ color: 'green', marginTop: '10px' }}>
            {message}
        </div>
    );
};

export default React.memo(Index);
