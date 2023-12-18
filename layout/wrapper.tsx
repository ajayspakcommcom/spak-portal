import React, { ReactNode } from 'react';

interface WrapperProps {
    children: ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
    return (
        <>
            {children}
        </>
    );
};

export default Wrapper;