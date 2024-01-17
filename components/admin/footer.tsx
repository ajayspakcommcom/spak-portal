import * as React from 'react';
import { Container, } from '@mui/material';

const Index = () => {


    React.useEffect(() => {

    }, []);

    return (
        <div className='footer-wrapper'>
            <Container>
                <p>Copyright 	&#169; {new Date().getFullYear()} All Rights Reserved.</p>
            </Container>
        </div>
    );
}

export default React.memo(Index);